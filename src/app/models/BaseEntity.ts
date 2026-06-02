/**
 * Campos base compartilhados por todas as entidades do backend.
 * Princípio DRY: evita repetir id/createdAt/updatedAt em cada interface.
 */
export interface BaseEntity {
  id: string;          // UUID
  createdAt: string;   // ISO 8601
  updatedAt: string;   // ISO 8601
}
