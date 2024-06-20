import './App.css'

import { useRef, useState } from 'react'
import clockCountDownSound from './assets/clock-countdown-bleeps.wav'
import smoothVibeSound from './assets/smooth-vibe.mp3'


const soundMap: Record<string, string> = {
  clockCountDownSound,
  smoothVibeSound
}
const defaultSoundKey = 'clockCountDownSound'
const defaultSoundSrc = soundMap[defaultSoundKey]


function App() {

  const [text, setText] = useState('00:00')
  const [minitue, setMinute] = useState(1)
  const [isRuning, setIsRuning] = useState(false)
  
  const [soundkey, setSoundkey] = useState(defaultSoundKey)

  const timerRef = useRef<Timer>(new Timer(
    () => {
      setIsRuning(false)
    },
    (t) => {
      setText(t)
    }
  ))

  function handleStart() {
    const coreTimer = timerRef.current

    if (isRuning) {
      coreTimer.stop()
    } else {
      coreTimer.start(minitue)
    }

    setIsRuning(!isRuning)
  }

  function handleSoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value
    setSoundkey(key)

    timerRef.current.changeSound(
      soundMap[key]
    )
  }

  const actText = isRuning ? '计时中...(再次点击中断计时)' : '点击开始计时'

  return (
    <div className="App">

      <audio src={clockCountDownSound}></audio>

      <div>
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
        value={minitue}
        onChange={e => setMinute(+e.target.value)}
      />
      <span className='sub-label'>分钟</span>
     </div>

     

      <button onClick={handleStart}>{actText}</button>
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

    this.audio = new Audio(defaultSoundSrc)
  }

  public start(minute: number) {

    const ins = new MinuteUpdater(minute)
    this.ins = ins

    this.id = setInterval(() => {
      if (!ins.updateFor1Sec()) {
        this.stop()
      }

      this.setText(ins.getText())
    }, 30)
  }

  public stop() {
    if (this.id) {
      clearInterval(this.id)
      this.id = null
    }

    this.ins = null

    this.endFn()

    this.setText('00:00')

    this.audio?.play()
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
