import { promisify } from "node:util";
import child_process from "node:child_process";

export const command = promisify(child_process.exec);
