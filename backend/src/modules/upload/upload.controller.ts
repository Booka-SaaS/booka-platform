import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'avatars');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Apenas imagens JPEG, PNG ou WEBP são permitidas.', 400));
    }
  },
});

export function buildUploadRouter() {
  const router = Router();

  router.post('/avatar', requireAuth, upload.single('avatar'), async (request: Request, response: Response, next: NextFunction) => {
    try {
      const req = request as AuthenticatedRequest;

      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado.', 400);
      }

      const imagemUrl = `/uploads/avatars/${req.file.filename}`;

      // Remove avatar anterior se existir
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.auth!.userId },
        include: { loja: true },
      });

      if (usuario?.loja?.imagemUrl) {
        const oldPath = path.resolve(process.cwd(), usuario.loja.imagemUrl.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      // Atualiza imagemUrl na Loja (profissional) ou apenas retorna a URL (cliente)
      if (usuario?.loja) {
        await prisma.$transaction([
          prisma.loja.update({ where: { id: usuario.loja.id }, data: { imagemUrl } }),
          prisma.perfilProfissional.updateMany({ where: { usuarioId: req.auth!.userId }, data: { imagemUrl } }),
        ]);
      }

      response.json({ imagemUrl });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
