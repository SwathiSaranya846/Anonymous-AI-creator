import crypto from "crypto";

export function createId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}
