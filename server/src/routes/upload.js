// Reads multipart uploads into memory. The size limit is checked here and
// again in PostService (FR-10).
import multer from 'multer';

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 + 1 } });

// Turns "file too large" into the same clear message the service uses.
export function single(field) {
  const handler = upload.single(field);
  return (req, res, next) =>
    handler(req, res, (err) => {
      if (err?.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'The file is larger than 10 MB.' });
      next(err);
    });
}
