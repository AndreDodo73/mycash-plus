/**
 * Gera um ID único. Usa `crypto.randomUUID()` quando disponível.
 *
 * @param prefix - Prefixo opcional (ex.: `tx`, `card`)
 * @returns String única (`uuid` ou `prefix-uuid`)
 *
 * @example
 * generateUniqueId() // "a1b2c3d4-..."
 * generateUniqueId("tx") // "tx-a1b2c3d4-..."
 */
export function generateUniqueId(prefix?: string): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return prefix ? `${prefix}-${uuid}` : uuid;
}
