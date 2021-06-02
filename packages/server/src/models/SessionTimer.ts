export interface KSessionTimer {
  timer?: NodeJS.Timeout;
  startTimer(): void;
  pauseTimer(): void;
}
