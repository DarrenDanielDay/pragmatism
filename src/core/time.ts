import { format, FormatProperties } from "./string";

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const pad0 = (n: number, length: number) => `${n}`.padStart(length, "0");

export const dateTemplate = format({
  YYYY: (d) => d.getFullYear(),
  MM: (d) => pad0(d.getMonth() + 1, 2),
  dd: (d) => pad0(d.getDate(), 2),
  HH: (d) => pad0(d.getHours(), 2),
  mm: (d) => pad0(d.getMinutes(), 2),
  ss: (d) => pad0(d.getSeconds(), 2),
  SSS: (d) => pad0(d.getMilliseconds(), 3),
} satisfies FormatProperties<Date>);

export const formatYYYYMMdd = dateTemplate`${"YYYY"}-${"MM"}-${"dd"}`;
export const formatYYYYMMddHHmmss = dateTemplate`${"YYYY"}-${"MM"}-${"dd"} ${"HH"}:${"MM"}:${"ss"}`;
export const formatLogTime = dateTemplate`${"YYYY"}-${"MM"}-${"dd"} ${"HH"}:${"MM"}:${"ss"}.${"SSS"}`;
