console.log('++++++++++++++++')

self.addEventListener("fetch", event => {
  // This is a dummy event listener
  // just to pass the PWA installation criteria on 
  // some browsers
});

function start(m, asyncFn) {
  let startTime = performance.now()
  let total = m * 5 * 1000

  let id
  function loop() {
    // console.log('loop...')

    if (performance.now() > startTime + total) {
      console.log('Foo end...')
      asyncFn({
        type: 'end',
        msg: 'time is end.'
      })
      cancelAnimationFrame(id)
      return
    }
   
    const percent = (performance.now() - startTime) / total
    const progress = Math.floor(percent * 100)

    const currentSecond = Math.floor(
      (
        (startTime + total) - performance.now()
      ) / 1000
    )

    console.log('progress:', {
      percent,
      progress,
      currentSecond
    })

    id = requestAnimationFrame(loop)
  }
  id = requestAnimationFrame(loop)
}

self.addEventListener('message', ev => {
  const data = ev.data
  console.log('==*==', data)

  if (data.type === 'click') {
    start(1, (payload) => {
      self.postMessage(payload)
    })
  }
})

function notify(payload) {
  postMessage(payload)
}
