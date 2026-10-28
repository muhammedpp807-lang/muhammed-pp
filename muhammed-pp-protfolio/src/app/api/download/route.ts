import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { deflateRawSync } from "node:zlib";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROOT_FILES = [
  ".env.example",
  ".gitignore",
  "README.md",
  "drizzle.config.ts",
  "eslint.config.mjs",
  "next.config.ts",
  "package.json",
  "package-lock.json",
  "postcss.config.mjs",
  "tsconfig.json",
  "vercel.json",
];
const SOURCE_EXTENSIONS = new Set([".avif", ".cjs", ".css", ".gif", ".ico", ".jpeg", ".jpg", ".json", ".js", ".jsx", ".md", ".mjs", ".png", ".svg", ".ts", ".tsx", ".txt", ".webp", ".woff", ".woff2"]);
const EXCLUDED_DIRECTORIES = new Set([".git", ".next", ".vercel", "build", "coverage", "dist", "node_modules", "uploads"]);
const CRC_TABLE = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});

function crc32(data: Buffer) {
  let crc = 0xffffffff;
  for (const byte of data) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const packedDate = ((Math.max(date.getFullYear(), 1980) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: packedDate };
}

async function collectSourceFiles(root: string) {
  const files = new Set<string>();
  for (const file of ROOT_FILES) {
    try {
      const rootFilePath = path.join(/*turbopackIgnore: true*/ root, file);
      await readFile(/*turbopackIgnore: true*/ rootFilePath);
      files.add(file);
    } catch {
      // Optional files such as package-lock.json or vercel.json may not exist.
    }
  }

  async function walk(directory: string, prefix: string) {
    const entries = await readdir(/*turbopackIgnore: true*/ directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith(".env") || entry.name === ".DS_Store") continue;
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRECTORIES.has(entry.name) || entry.name.startsWith(".")) continue;
        await walk(path.join(/*turbopackIgnore: true*/ directory, entry.name), `${prefix}/${entry.name}`);
      } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        files.add(`${prefix}/${entry.name}`);
      }
    }
  }

  for (const directory of ["src", "public"]) {
    try {
      await walk(path.join(/*turbopackIgnore: true*/ root, directory), directory);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  return [...files].sort();
}

function createZip(entries: Array<{ name: string; data: Buffer }>) {
  const localParts: Buffer[] = [];
  const centralParts: Buffer[] = [];
  const { time, date } = dosDateTime();
  let localOffset = 0;
  let centralSize = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name.replaceAll(path.sep, "/"), "utf8");
    const compressed = deflateRawSync(entry.data, { level: 6 });
    const checksum = crc32(entry.data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(date, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(entry.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, compressed);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(date, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(compressed.length, 20);
    central.writeUInt32LE(entry.data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(localOffset, 42);
    centralParts.push(central, name);
    centralSize += central.length + name.length;
    localOffset += local.length + name.length + compressed.length;
  }

  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(localOffset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, ...centralParts, end]);
}

export async function GET() {
  try {
    const root = /*turbopackIgnore: true*/ process.cwd();
    const sourcePaths = await collectSourceFiles(root);
    if (sourcePaths.length > 2000) return new Response("Source archive contains too many files.", { status: 413 });

    const entries = await Promise.all(sourcePaths.map(async (relativePath) => {
      const absolutePath = path.resolve(/*turbopackIgnore: true*/ root, relativePath);
      if (!absolutePath.startsWith(`${root}${path.sep}`)) throw new Error("Invalid source path");
      const data = await readFile(/*turbopackIgnore: true*/ absolutePath);
      return { name: `muhammed-pp-portfolio/${relativePath}`, data };
    }));
    const size = entries.reduce((total, entry) => total + entry.data.length, 0);
    if (size > 32 * 1024 * 1024) return new Response("Source archive exceeds the size limit.", { status: 413 });

    const archive = createZip(entries);
    return new Response(new Uint8Array(archive), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="muhammed-pp-portfolio-source.zip"',
        "Content-Length": String(archive.length),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Source archive generation failed:", error);
    return new Response("Source archive is temporarily unavailable.", { status: 503 });
  }
}
