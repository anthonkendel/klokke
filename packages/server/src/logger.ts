
export class Logger {
  info(...args: unknown[]): void {
    const now = new Date().toLocaleString();
    console.info(now, ':', ...args);
  }
}


