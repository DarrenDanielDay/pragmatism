import { fileURLToPath } from "node:url";
import { die } from "../core/fp";

export function relativeTo(base: string): (path: string) => string;
export function relativeTo(base: string, path: string): string;
export function relativeTo(...args: [base: string] | [base: string, path: string]) {
  if (args.length === 1) {
    const [base] = args;
    return (path: string) => fileURLToPath(new URL(path, base));
  }
  if (args.length === 2) {
    const [base, path] = args;
    return fileURLToPath(new URL(path, base));
  }
  return die();
}
