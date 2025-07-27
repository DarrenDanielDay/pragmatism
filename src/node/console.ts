import { createInterface, type Interface } from "node:readline";
import { die } from "../core/fp";

let readlineInterface: Interface | null = null;
let readlineIterator: ReturnType<Interface[(typeof Symbol)["asyncIterator"]]> | null = null;

export async function input(prompt: string) {
  process.stdout.write(prompt);
  readlineInterface ??= createInterface({ input: process.stdin });
  readlineIterator ??= readlineInterface[Symbol.asyncIterator]();
  readlineInterface.resume();
  const result = await readlineIterator.next();
  if (result.done) {
    return die(`Cannot read input: EOF`);
  }
  readlineInterface.pause();
  return result.value;
}
