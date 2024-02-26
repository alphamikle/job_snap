import { registeredHandlers } from '../sources/handlers-registrar';
import { SourceHandler } from '../sources/source-handler';

export const holidays = 30;
export const workingHours = 8;
export const workingHoursInTheYear = 2080;
export const mainKey = 'e';

export let domain = '';

export let logResult = false;

export function needToLogResult(need: boolean) {
  logResult = need;
}

(window as any).needToLogResult = needToLogResult;

export function findHandler(): SourceHandler | null {
  const location = window.location.href;
  domain = window.location.hostname;
  for (const handler of registeredHandlers) {
    if (location.includes(handler.code)) {
      return handler;
    }
  }
  return null;
}