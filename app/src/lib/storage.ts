import { prisma } from "./prisma";
import path from "path";
import fs from "fs/promises";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "/data/uploads";

export async function ensureUploadDir(subDir?: string) {
  const dir = subDir ? path.join(UPLOAD_DIR, subDir) : UPLOAD_DIR;
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function saveFile(params: {
  organizationId: string;
  file: Buffer;
  originalName: string;
  mimeType: string;
}) {
  const dir = await ensureUploadDir(params.organizationId);
  const ext = path.extname(params.originalName);
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const filePath = path.join(dir, fileName);

  await fs.writeFile(filePath, params.file);

  const record = await prisma.fileUpload.create({
    data: {
      organizationId: params.organizationId,
      fileName,
      originalName: params.originalName,
      mimeType: params.mimeType,
      fileSize: params.file.length,
      filePath,
    },
  });

  return record;
}

export async function getFile(fileId: string) {
  const record = await prisma.fileUpload.findUnique({ where: { id: fileId } });
  if (!record) return null;

  const buffer = await fs.readFile(record.filePath);
  return { ...record, buffer };
}

export async function deleteFile(fileId: string) {
  const record = await prisma.fileUpload.findUnique({ where: { id: fileId } });
  if (!record) return false;

  try {
    await fs.unlink(record.filePath);
  } catch {
    // File may not exist on disk
  }

  await prisma.fileUpload.delete({ where: { id: fileId } });
  return true;
}
