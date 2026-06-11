-- Idempotency key for notifications created from external/domain events.
ALTER TABLE "Notificacao" ADD COLUMN "eventoId" TEXT;

CREATE UNIQUE INDEX "Notificacao_eventoId_key" ON "Notificacao"("eventoId");
