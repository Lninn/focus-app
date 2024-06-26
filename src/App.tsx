import './App.css'

import { useEffect, useRef, useState } from 'react'
import { DEFAULT_SOUND_KEY, DEFAULT_SOUND_SRC, getSoundSrc } from './sound'
import { getInterval } from './state'
import useLocalState from './useLocalState'


function App() {

  const [text, setText] = useState('00:00')
  const [minitue, setMinute] = useLocalState('minute', 1)
  const [isRuning, setIsRuning] = useState(false)

  const [soundkey, setSoundkey] = useLocalState('sound', DEFAULT_SOUND_KEY)

  const timerRef = useRef<Timer>()

  useEffect(() => {
    timerRef.current = new Timer(
      () => {
        setIsRuning(false)
      },
      (t) => {
        setText(t)
      }
    )
  }, [])

  function handleMinuteChange(m: number) {
    setMinute(m)
  }

  function handleStart() {
    const coreTimer = timerRef.current

    if (!coreTimer) return

    if (isRuning) {
      coreTimer.stop(true)
    } else {
      coreTimer.start(minitue)
    }

    setIsRuning(!isRuning)
  }

  function handleSoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const coreTimer = timerRef.current

    if (!coreTimer) return

    const key = e.target.value
    setSoundkey(key)

    const soundSrc = getSoundSrc(key)
    coreTimer.changeSound(soundSrc)
  }

  const actText = isRuning ? '计时中...(再次点击中断计时)' : '点击开始计时'

  function handleTestClick() {
    const myWorker = new Worker('dummy-sw.js')
    const payload = {
      type: 'click',
      msg: 'hello from react'
    }
    myWorker.postMessage(payload)
    myWorker.onmessage = ev => {
      const data = ev.data
      console.log('debug ', data)
    }
  }

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

      <button onClick={handleTestClick}>启动一个1分钟定时</button>
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

class Timer {
  private id: number | null = null
  private ins: MinuteUpdater | null = null

  private endFn: () => void
  private setText: (t: string) => void

  private audio: HTMLAudioElement | null = null

  constructor(endFn: () => void, setText: (t: string) => void) {
    this.endFn = endFn
    this.setText = setText

    this.audio = new Audio(DEFAULT_SOUND_SRC)

    // function onSoundLoad(ev: Event) {
    //   console.log(ev);
    // }
    // this.audio.addEventListener('canplaythrough', onSoundLoad, false);
  }

  public start(minute: number) {
    const __interval = getInterval()

    const ins = new MinuteUpdater(minute)
    this.ins = ins

    this.id = setInterval(() => {
      if (!ins.updateFor1Sec()) {
        this.stop()
      }

      this.setText(ins.getText())
    }, __interval)
  }

  public stop(isAhead = false) {
    if (this.id) {
      clearInterval(this.id)
      this.id = null
    }

    this.ins = null

    this.endFn()

    this.setText('00:00')

    if (!isAhead) {
      this.audio?.play()
    }
  }

  public changeSound(src: string) {
    if (this.audio) {
      this.audio.src = src
    }
  }
}

class MinuteUpdater {
  private second: number
  private text: string
  constructor(min: number) {
    this.second = min * 60

    const _m = min < 9 ? '0' + min : min
    this.text = `${_m}:00`
  }

  public updateFor1Sec() {
    this.second--
    if (this.second < 0) {
      return false
    }
    const _m = Math.floor(this.second / 60)
    const _s = this.second % 60
    const m = _m < 9 ? '0' + _m : _m
    const s = _s < 9 ? '0' + _s : _s
    this.text = `${m}:${s}`
    return true
  }

  public getText() {
    return this.text
  }
}

export default App
