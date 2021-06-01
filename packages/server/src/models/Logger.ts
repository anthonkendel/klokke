import chalk from 'chalk';

export class Logger {
  private now(): string {
    return new Date().toLocaleString('sv-SE');
  }

  debug(...args: unknown[]): void {
    const output = [this.now(), chalk.magenta('debug'), ...args].join(' ');
    console.debug(output);
  }

  info(...args: unknown[]): void {
    const output = [this.now(), chalk.cyan('info'), ...args].join(' ');
    console.info(output);
  }
}
