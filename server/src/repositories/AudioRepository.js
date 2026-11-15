// The only code that touches the audio folder (uploads/audio/).
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { SERVER_ROOT } from '../db.js';

const AUDIO_DIR = process.env.VT_AUDIO_DIR || join(SERVER_ROOT, 'uploads', 'audio');
mkdirSync(AUDIO_DIR, { recursive: true });

const EXT = { 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a' };

export const AudioRepository = {
  saveFile(buffer, baseType) {
    const fileName = `${Date.now()}-${randomBytes(6).toString('hex')}.${EXT[baseType]}`;
    writeFileSync(join(AUDIO_DIR, fileName), buffer);
    return fileName;
  },
  deleteFile(fileName) {
    if (fileName) rmSync(join(AUDIO_DIR, fileName), { force: true });
  },
  openFile(fileName) {
    const path = join(AUDIO_DIR, fileName);
    return existsSync(path) ? path : null;
  },
};
