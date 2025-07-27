import { die } from "./fp";
import { isKey, isString } from "./language";

export const untagged = (templates: TemplateStringsArray, ...args: any[]) => {
  return String.raw({ raw: templates }, ...args);
};

export type TemplateValue = string | number | boolean | undefined | null | object;

export interface FormatDescriptor<T> {
  (value: T): TemplateValue;
}

export type FormatProperties<T> = Record<string, FormatDescriptor<T>>;
export type GetFormatObject<P extends FormatProperties<any>> = P extends FormatProperties<infer T> ? T : never;

export const format = <P extends FormatProperties<any>>(properties: P) => {
  return (
    templates: TemplateStringsArray,
    ...args: (keyof P | FormatDescriptor<GetFormatObject<P>>)[]
  ): FormatDescriptor<GetFormatObject<P>> => {
    const unknownProps = new Set(args.filter(isString)).difference(new Set(Reflect.ownKeys(properties)));
    if (unknownProps.size) {
      return die(`Unknown properties: ${formatKeys([...unknownProps])}`);
    }
    return (value) => {
      return untagged(templates, ...args.map((arg) => (isKey(arg) ? properties[arg](value) : arg(value))));
    };
  };
};

export interface ConstantFormatFragment extends FormatDescriptor<any> {
  (): string;
}

export const constant = (value: TemplateValue): ConstantFormatFragment => {
  const string = `${value}`;
  const fragment = () => string;
  return fragment;
};

export interface VariableFormatFragment extends FormatDescriptor<any> {
  (): string;
  set(value: TemplateValue): void;
}

export const variable = (init: TemplateValue): VariableFormatFragment => {
  let string = `${init}`;
  const fragment = () => string;
  fragment.set = (value: TemplateValue) => {
    string = `${value}`;
  };
  return fragment;
};

export const expand = (
  templates: TemplateStringsArray,
  ...fragments: (ConstantFormatFragment | VariableFormatFragment)[]
) => untagged(templates, ...fragments.map((v) => v()));

export const concat =
  <T>(templates: TemplateStringsArray, ...descriptors: FormatDescriptor<T>[]): FormatDescriptor<T> =>
  (value) =>
    untagged(templates, ...descriptors.map((descriptor) => descriptor(value)));

export const formatNullable = <T>(value: T): string => (value != null ? `${value}` : "");

export const formatKeys = (keys: PropertyKey[]) => {
  return keys.map(String).join(", ");
};

export const formatJSON = (value: any, tabSize = 2) => JSON.stringify(value, undefined, tabSize);

export { formatJSON as jsonFormat };

export const formatError = (error: Error) => formatNullable(error.stack) || error.message;

export interface ConvertDescriptor<T> {
  match: RegExp;
  as(input: string): T;
}

export type PatternDescriptor<T> = RegExp | ConvertDescriptor<T>;
type MatchedContext<T> = {
  [K in keyof T]: T[K] extends ConvertDescriptor<infer P> ? P : string;
};

export const pattern = <T extends Record<string, PatternDescriptor<any>>>(descriptors: T) => {
  return (templates: TemplateStringsArray, ...properties: (keyof T)[]) => {
    const used = new Set(properties);
    const expected = new Set(Reflect.ownKeys(descriptors));
    const unknownProps = used.difference(expected);
    if (unknownProps.size) {
      return die(`Unknown properties: ${formatKeys([...unknownProps])}`);
    }
    const unusedProps = expected.difference(used);
    if (unusedProps.size) {
      return die(`Unused properties: ${formatKeys([...unusedProps])}`);
    }
    const duplicated = new Set<keyof T>();
    for (const prop of properties) {
      if (!used.has(prop)) {
        duplicated.add(prop);
      } else {
        used.delete(prop);
      }
    }
    if (duplicated.size) {
      return die(`Duplicated properties: ${formatKeys([...duplicated])}`);
    }
    const regex = String.raw(
      templates,
      ...properties.map((prop) => {
        const desc = descriptors[prop];
        return `(${desc instanceof RegExp ? desc.source : desc.match.source})`;
      }),
    );
    const matcher = (input: string): MatchedContext<T> | null => {
      const match = new RegExp(regex).exec(input);
      if (!match) {
        return null;
      }
      // @ts-expect-error cannot infer dynamic object type
      return Object.fromEntries(
        properties.map((arg, i) => {
          const desc = descriptors[arg];
          const capture = match[i + 1];
          return [arg, desc instanceof RegExp ? capture : desc.as(capture)];
        }),
      );
    };
    return matcher;
  };
};
