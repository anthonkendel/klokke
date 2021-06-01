import chalk from 'chalk';

export class Logger {
  debug(...args: unknown[]): void {
    const now = Date.now().toLocaleString('sv');
    const output = [now, chalk.magenta('debug'), ...args].join(' ');
    console.debug(output);
  }

  info(...args: unknown[]): void {
    const now = Date.now().toLocaleString('sv');
    const output = [now, chalk.cyan('info'), ...args].join(' ');
    console.info(output);
  }
}
