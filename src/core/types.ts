export type PromiseOr<T> = Promise<T> | T;
export type Validator<T> = (value: unknown) => value is T;
export type Nullish = null | undefined;
export type Nullable<T> = T | null | undefined;
export type StringKey<T extends object> = Extract<keyof T, string>;
export type EnumerateString<T extends string> = T | (string & {});
export type UnionToIntersection<U> = (U extends infer P ? (p: P) => void : never) extends infer T ? T : never;

export type UpdatePayload<T extends object, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;

export type Timer = ReturnType<typeof setTimeout>;
