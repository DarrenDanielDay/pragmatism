import type { PathLike, Stats } from "node:fs";
import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, join, parse, type ParsedPath } from "node:path";
import { fileURLToPath } from "node:url";
import { die, isString, type PromiseOr, type Validator } from "../core";

export let defaultEncoding: BufferEncoding = "utf-8";

export function pathLikeToString(path: PathLike) {
  if (isString(path)) {
    return path;
  }
  if (path instanceof URL) {
    return fileURLToPath(path);
  }
  if (path instanceof Buffer) {
    return path.toString(defaultEncoding);
  }
  return die();
}

export async function existsFile(path: PathLike) {
  try {
    const s = await stat(path);
    return s.isFile();
  } catch (error) {
    return false;
  }
}

export async function existsDir(path: PathLike) {
  try {
    const s = await stat(path);
    return s.isDirectory();
  } catch (error) {
    return false;
  }
}

export function readTextFile(path: PathLike, encoding: BufferEncoding = defaultEncoding) {
  return readFile(path, encoding);
}

export interface WalkResult {
  stat: Stats;
  path: string;
  parsed: ParsedPath;
}

export async function* walk(path: string): AsyncGenerator<WalkResult, void, boolean | undefined> {
  const s = await stat(path);
  if (s.isFile()) {
    yield {
      stat: s,
      path,
      parsed: parse(path),
    };
    return;
  }
  if (s.isDirectory()) {
    const children = await readdir(path);
    const next = yield {
      stat: s,
      parsed: parse(path),
      path,
    };
    if (next === false) {
      return;
    }
    for (const child of children) {
      yield* walk(join(path, child));
    }
  }
  // Other types will not be handled.
}

export async function writeTextFile(path: PathLike, content: string, encoding: BufferEncoding = defaultEncoding) {
  await ensureDir(dirname(pathLikeToString(path)));
  return writeFile(path, content, encoding);
}

export async function editTextFile(
  path: PathLike,
  edit: (content: string) => PromiseOr<string>,
  encoding: BufferEncoding = defaultEncoding,
) {
  const content = await readTextFile(path, encoding);
  const newContent = await edit(content);
  await writeTextFile(path, newContent, encoding);
}

interface JSONReadOptions<T> {
  validator?: Validator<T>;
  encoding?: BufferEncoding;
}

export async function readJSON<T>(path: PathLike, options: JSONReadOptions<T> = {}): Promise<T> {
  const { validator, encoding } = options;
  const obj = JSON.parse(await readTextFile(path, encoding));
  if (validator && !validator(obj)) {
    return die(`JSON shape validation failed for ${pathLikeToString(path)}.`);
  }
  return obj;
}

export function writeJSON(path: PathLike, obj: unknown, space: number = 2) {
  return writeTextFile(path, JSON.stringify(obj, undefined, space));
}

export async function editJSON<T>(
  path: PathLike,
  edit: (json: T) => PromiseOr<T | void>,
  options: JSONReadOptions<T> = {},
) {
  const { validator } = options;
  const json = await readJSON<T>(path, options);
  const edited = (await edit(json)) ?? json;
  if (validator && !validator(edited)) {
    return die(`JSON shape validation failed for edited ${path}.`);
  }
  await writeJSON(path, edited);
}

export function ensureDir(dir: PathLike) {
  return mkdir(dir, { recursive: true });
}

export function rm_rf(dir: PathLike) {
  return rm(dir, { force: true, recursive: true });
}
