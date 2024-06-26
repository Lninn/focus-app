import './App.css'

import { useEffect, useRef, useState } from 'react'
import { DEFAULT_SOUND_KEY, DEFAULT_SOUND_SRC, getSoundSrc } from './sound'
import { getInterval } from './state'
import useLocalState from './useLocalState'

// const log = console.log.bind(console)
const log = (...args: any) => { }

function playSound() {
  const raudio = new Audio(DEFAULT_SOUND_SRC)
  raudio.play()
}

function App() {

  const [text, setText] = useState('00:00')
  const [minitue, setMinute] = useLocalState('minute', 1)
  const [isRuning, setIsRuning] = useState(false)

  const [soundkey, setSoundkey] = useLocalState('sound', DEFAULT_SOUND_KEY)

  const workerRef = useRef<Worker | null>(null);

  function handleMinuteChange(m: number) {
    setMinute(m)
  }

  function handleStart() {
    setIsRuning(!isRuning)
    if (isRuning) {
      const worker = workerRef.current
      if (worker) {
        worker.postMessage({ type: 'stop' })
        workerRef.current = null
      }
      return
    }

    const myWorker = new Worker('dummy-sw.js')
    workerRef.current = myWorker;
    
    const payload = {
      type: 'start',
      msg: 'start a timer by value filed.',
      minute: minitue,
    }
    myWorker.postMessage(payload)

    myWorker.onmessage = ev => {
      const data = ev.data
      log('debug ', data)
      if (data.type === 'interval') {
        setText(data.state.text)
      } else if (data.type === 'end') {
        playSound()
      } else if (data.type === 'break') {
        // do nothing
      }
    }
  }

  function handleSoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value
    setSoundkey(key)
  }

  const actText = isRuning ? '计时中...(再次点击中断计时)' : '点击开始计时'

  return (
    <div className="App">

      <div className='countDownText'>
        <label>{text}</label>
      </div>

      <div className='form-item'>
        <label>音效：</label>
        <select value={soundkey} onChange={handleSoundChange} disabled={isRuning}>
          <option value='clockCountDownSound'>Clock CountDown</option>
          <option value='smoothVibeSound'>Smooth Vibe</option>
        </select>
      </div>

      <div className='form-item'>
        <label>时间：</label>
        <input
          type='number'
          disabled={isRuning}
          min={1}
          max={99}
          step={1}
          style={{ width: 120 }}
          value={minitue}
          onChange={e => handleMinuteChange(+e.target.value)}
        />
        <span className='sub-label'>分钟</span>
      </div>

      <div className='form-item'>
        <label>快捷选项：</label>

        <QuickOptions disabled={isRuning} setMinute={handleMinuteChange} />
      </div>

      <button onClick={handleStart}>{actText}</button>
    </div>
  )
}

function QuickOptions({
  setMinute,
  disabled,
}: {
  setMinute: (m: number) => void
  disabled: boolean
}) {
  const minuteOptions = [
    15,
    30,
    45,
    55,
  ]

  return (
    <div className='quick-options'>
      {minuteOptions.map(minute => (
        <button
          key={minute}
          disabled={disabled}
          onClick={() => setMinute(minute)}
        >
          {minute + '分钟'}
        </button>
      ))}
    </div>
  )
}

export default App
