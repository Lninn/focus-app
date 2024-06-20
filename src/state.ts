const APP_CORE_STATE = {
  interval: 1000,
}

export function updateInterval(n: number) {
  APP_CORE_STATE.interval = n
}

export function getInterval() {
  return APP_CORE_STATE.interval
}
