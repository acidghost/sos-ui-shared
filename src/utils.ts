export function identityFn<T>(x: T): T { return x }

export function timeToString(time: number): string {
  const hours = (time / 60 / 60 / 1000) + 1;
  const minutes = (hours % 1) * 60;
  const wholeHours = hours - (hours % 1);
  return (wholeHours < 10 ? '0':'') + wholeHours + ':' + (minutes < 10 ? '0':'') + minutes;
}

export function dateWithoutTimestamp(date: Date): string {
  const t = date.getTime() - (date.getTimezoneOffset() * 60 * 1000);
  return new Date(t).toISOString().split('T')[0];
}
