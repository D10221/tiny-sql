import { randomBytes } from "crypto";

export const randomString = (length = 4, enc = "hex") =>
  randomBytes(length).toString(enc);

export function* range(from: number, to: number) {
  while (from <= to) {
    yield from++;
  }
}

export function isClosed(x: any) {
  return x && x.closed;
}
export function inTransaction(x: any) {
  return x && x.inTransaction;
}
