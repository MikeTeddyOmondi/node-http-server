import { pino } from "pino";
// import { PinoPretty } from "pino-pretty";
// import type { PrettyOptions } from "pino-pretty";
import { tmpdir } from "os";
import { join } from "path";

const file = join(tmpdir(), `${process.pid}-audit-logs`);

// const options: PrettyOptions = {
//   destination: file,
//   colorize: true,
// };

// Logger
// export const logger = pino(PinoPretty(options));
export const logger = pino();

// Error handler
export interface ResponseError extends Error {
  status: number;
}

export function createError(status: number, message: string) {
  const err = new Error() as ResponseError;
  err.status = status;
  err.message = message;
  return err;
}
