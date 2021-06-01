export interface KSessionTimer {
  timer?: NodeJS.Timeout;
  startTimer(): void;
  stopTimer(): void;
}
