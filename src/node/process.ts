import { parse } from "node:path";
import { fileURLToPath } from "node:url";

export const isMain = (url: string) => process.argv.some((arg) => arg.includes(parse(fileURLToPath(url)).base));
