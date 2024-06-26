self.addEventListener("fetch", event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on 
  // some browsers
});

self.addEventListener('message', ev => {
  const data = ev.data
  console.log(data)

  if (data.type === 'start') {
    startTimer()
  }
})

let startTime
let total = 1 * 60 * 1000

let id
function startTimer() {
  startTime = performance.now()
  _startTimer()
}
function _startTimer() {
  console.log('setTimeout start...')
  id = setInterval(() => {
    if (performance.now() > startTime + total) {
      notify({
        type: 'end',
        msg: 'time is end.'
      })
      clearInterval(id)
    }

    console.log('setInterval procesing...')
  }, 1000)
}

function notify(payload) {
  postMessage(payload)
}
