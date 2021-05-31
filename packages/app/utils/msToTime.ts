export function msToTime(s: number) {
  // Pad to 2 or 3 digits, default is 2
  function pad(n: number, z: number = 2) {
    return ('00' + n).slice(-z)
  }

  const ms = s % 1000
  s = (s - ms) / 1000
  const secs = s % 60
  s = (s - secs) / 60
  const mins = s % 60
  const hrs = (s - mins) / 60

  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs) + '.' + pad(ms, 3)
}
