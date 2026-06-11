import { HttpInterceptorFn } from '@angular/common/http';
import DOMPurify from 'dompurify';

export const sanitizeInterceptor: HttpInterceptorFn = (req, next) => {
  const methodRequiresSanitization = ['POST', 'PUT', 'PATCH'].includes(req.method);

  if (methodRequiresSanitization && req.body && !(req.body instanceof FormData)) {
    try {
      const sanitizedBody = sanitizeRequestBody(req.body);
      req = req.clone({ body: sanitizedBody });
    } catch (error) {
      console.error('Erro ao sanitizar request body:', error);
    }
  }

  return next(req);
};

function sanitizeRequestBody(obj: any): any {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeRequestBody(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = sanitizeRequestBody(obj[key]);
      return acc;
    }, {} as any);
  }

  return obj;
}
