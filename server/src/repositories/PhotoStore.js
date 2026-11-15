// Saves profile photos (FR-05) in uploads/photos/.
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { SERVER_ROOT } from '../db.js';

export const PHOTO_DIR = process.env.VT_PHOTO_DIR || join(SERVER_ROOT, 'uploads', 'photos');
mkdirSync(PHOTO_DIR, { recursive: true });

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export const PhotoStore = {
  isAllowed(type) {
    return Boolean(EXT[type]);
  },
  save(buffer, type) {
    const fileName = `${Date.now()}-${randomBytes(6).toString('hex')}.${EXT[type]}`;
    writeFileSync(join(PHOTO_DIR, fileName), buffer);
    return fileName;
  },
  delete(fileName) {
    if (fileName) rmSync(join(PHOTO_DIR, fileName), { force: true });
  },
};
