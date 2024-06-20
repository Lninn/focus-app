import './App.css'

import { useEffect, useRef, useState } from 'react'
import { DEFAULT_SOUND_KEY, DEFAULT_SOUND_SRC, getSoundSrc } from './sound'


const FOCUS_APP_MINUTE_KEY = 'focus-app-minute'


function App() {

  const [text, setText] = useState('00:00')
  const [minitue, setMinute] = useState(1)
  const [isRuning, setIsRuning] = useState(false)
  
  const [soundkey, setSoundkey] = useState(DEFAULT_SOUND_KEY)

  const timerRef = useRef<Timer>(new Timer(
    () => {
      setIsRuning(false)
    },
    (t) => {
      setText(t)
    }
  ))

  useEffect(() => {
    const cacheValue = window.localStorage.getItem(FOCUS_APP_MINUTE_KEY)
    if (!cacheValue) {
      //
    } else {
      setMinute(+cacheValue)
    }
  }, [])

  function handleMinuteChange(m: number) {
    setMinute(m)
    localStorage.setItem(FOCUS_APP_MINUTE_KEY, m.toString())
  }

  function handleStart() {
    const coreTimer = timerRef.current

    if (isRuning) {
      coreTimer.stop(true)
    } else {
      coreTimer.start(minitue)
    }

    setIsRuning(!isRuning)
  }

  function handleSoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value
    setSoundkey(key)

    const soundSrc = getSoundSrc(key)
    timerRef.current.changeSound(soundSrc)
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

      <div className='footer'>
        <a target='_blank' href='https://dash.zeabur.com/projects'>
          <span>部署</span>
          <span style={{ display: 'inline-block', width: 4 }}></span>
          <img className='logo' src='https://dash.zeabur.com/logo-with-text-dark.svg' />
        </a>

        <a target='_blank' href="https://github.com/Lninn/focus-app">源码</a>
      </div>
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
  return (
    <div className='quick-options'>
      <button disabled={disabled} onClick={() => setMinute(15)}>15分钟</button>
      <button disabled={disabled} onClick={() => setMinute(30)}>30分钟</button>
      <button disabled={disabled} onClick={() => setMinute(55)}>55分钟</button>
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
  }

  public start(minute: number) {

    const ins = new MinuteUpdater(minute)
    this.ins = ins

    this.id = setInterval(() => {
      if (!ins.updateFor1Sec()) {
        this.stop()
      }

      this.setText(ins.getText())
    }, 1000)
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
