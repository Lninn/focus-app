// const log = console.log.bind(console)
const log = () => {}

log('run dummy-sw.js...')

self.addEventListener("fetch", event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on 
  // some browsers
});

let flag = 0

self.addEventListener('message', ev => {
  const data = ev.data
  log('[worker message event]', data)

  const send = p => self.postMessage(p)

  if (data.type === 'start') {
    handleTimer(data.minute, send)
  } else if (data.type === 'stop') {
    log('stop timer', data, getState())
    flag = 1;
  }
})

function handleTimer(minute, sendFn) {

  let previousSecond = 0
  function onSecondChange(second) {
    if (second === previousSecond) {
      return
    }
    previousSecond = second
    updateFor1Sec()

    const state = getState()
    sendFn({
      type: 'interval',
      msg: 'async data to main thread.',
      state,
    })
  }

  let id
  let startTime = performance.now()
  let total = minute * 60 * 1000
  function loop() {
    if (flag === 1) {
      sendFn({
        type: 'break',
        msg: '提前終止計時器'
      })
      flag = 0;
      cancelAnimationFrame(id)
      return
    }

    if (performance.now() > startTime + total) {
      sendFn({
        type: 'end',
        msg: 'end of timer.'
      })
      cancelAnimationFrame(id)
      return
    }

    const currentSecond = Math.floor(
      (
        (startTime + total) - performance.now()
      ) / 1000
    )

    onSecondChange(currentSecond)

    id = requestAnimationFrame(loop)
  }

  initial(minute)
  id = requestAnimationFrame(loop)
}

let second = 0
let text = '00:00'
function initial(minute) {
  second = minute * 60
}
function updateFor1Sec() {
  second--
  if (second < 0) {
    return false
  }
  const m = Math.floor(second / 60)
  const s = second % 60
  text = `${num2str(m)}:${num2str(s)}`
  return true
}
function getState() {
  return {
    second,
    text,
  }
}

function num2str(num) {
  const str = String(num)
  if (str.length === 1) {
    return '0' + str
  } else if (str.length > 2) {
    throw new Error('too long number')
  }
  return str
}
