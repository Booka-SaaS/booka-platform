import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth';
import { prisma } from '../../lib/db';
import { AppError } from '../../lib/errors';

const AVATARS_DIR = path.resolve(process.cwd(), 'uploads', 'avatars');
const CAPAS_DIR = path.resolve(process.cwd(), 'uploads', 'capas');

if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

if (!fs.existsSync(CAPAS_DIR)) {
  fs.mkdirSync(CAPAS_DIR, { recursive: true });
}

function makeStorage(dir: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  });
}

function makeUpload(dir: string) {
  return multer({
    storage: makeStorage(dir),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new AppError('Apenas imagens JPEG, PNG ou WEBP sao permitidas.', 400));
      }
    },
  });
}

const upload = makeUpload(AVATARS_DIR);
const uploadCapa = makeUpload(CAPAS_DIR);

export function buildUploadRouter() {
  const router = Router();

  router.post('/avatar', requireAuth, upload.single('avatar'), async (request: Request, response: Response, next: NextFunction) => {
    try {
      const req = request as AuthenticatedRequest;

      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado.', 400);
      }

      const imagemUrl = `/uploads/avatars/${req.file.filename}`;

      const usuario = await prisma.usuario.findUnique({
        where: { id: req.auth!.userId },
        select: { imagemUrl: true },
      });

      if (usuario?.imagemUrl && usuario.imagemUrl.startsWith('/uploads/avatars/')) {
        const oldPath = path.resolve(process.cwd(), usuario.imagemUrl.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      await prisma.usuario.update({ where: { id: req.auth!.userId }, data: { imagemUrl } });

      response.json({ imagemUrl });
    } catch (error) {
      next(error);
    }
  });

  router.post('/capa-loja', requireAuth, uploadCapa.single('capa'), async (request: Request, response: Response, next: NextFunction) => {
    try {
      const req = request as AuthenticatedRequest;

      if (!req.file) {
        throw new AppError('Nenhum arquivo enviado.', 400);
      }

      const imagemUrl = `/uploads/capas/${req.file.filename}`;

      const loja = await prisma.loja.findUnique({
        where: { usuarioId: req.auth!.userId },
        select: { id: true, imagemUrl: true },
      });

      if (!loja) {
        throw new AppError('Loja nao encontrada.', 404);
      }

      if (loja.imagemUrl && loja.imagemUrl.startsWith('/uploads/capas/')) {
        const oldPath = path.resolve(process.cwd(), loja.imagemUrl.replace(/^\//, ''));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      await prisma.loja.update({ where: { id: loja.id }, data: { imagemUrl } });
      await prisma.perfilProfissional.updateMany({ where: { usuarioId: req.auth!.userId }, data: { imagemUrl } });

      response.json({ imagemUrl });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
