import './App.css'

import { useRef, useState } from 'react'
import { DEFAULT_SOUND_KEY, DEFAULT_SOUND_SRC } from './sound'
import useLocalState from './useLocalState'
import QuickOptions from './QuickOptions'

// const log = console.log.bind(console)
const log = (...args: any) => { }

interface ITask {
  name: string;
  minute: number;
}

function App() {
  return (
    <div className='App'>
      <Setup />
      <WorkSpace />
    </div>
  )
}

function Setup() {

  const [text, setText] = useState('00:00')
  const [minitue, setMinute] = useLocalState('minute', 1)
  const [isRuning, setIsRuning] = useState(false)

  const [soundkey, setSoundkey] = useLocalState('sound', DEFAULT_SOUND_KEY)

  const workerRef = useRef<Worker | null>(null);

  const [taskName, setTaskName] = useState('');

  const [taskList, setTaskList] = useState<ITask[]>([]);
  const AddTask = (t: ITask) =>  setTaskList([...taskList, t])

  function handleMinuteChange(m: number) {
    setMinute(m)
  }

  function handleStart() {
    // https://stackoverflow.com/questions/31776548/why-cant-javascript-play-audio-files-on-iphone-safari

    const soundEffect = new Audio();
    soundEffect.autoplay = true;

    // onClick of first interaction on page before I need the sounds
    // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
    soundEffect.src = "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

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
      // minute: 0.1,
    }
    myWorker.postMessage(payload)

    myWorker.onmessage = ev => {
      const data = ev.data
      log('debug ', data)
      if (data.type === 'interval') {
        setText(data.state.text)
      } else if (data.type === 'end') {
       
        // later on when you actually want to play a sound at any point without user interaction
        soundEffect.src = DEFAULT_SOUND_SRC;

        setText('00:00')
        setIsRuning(false)
      } else if (data.type === 'break') {
        // do nothing
      }
    }
  }

  function handleSoundChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const key = e.target.value
    setSoundkey(key)
  }

  function handleAddTask() {
    const task: ITask = {
      name: taskName,
      minute: minitue,
    }

    AddTask(task);
  }

  const actText = isRuning ? '计时中...(再次点击中断计时)' : '点击开始计时'

  return (
    <div>

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

      <div className='form-item'>
        <label>任务名称：</label>
        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder='任务名称'
        />
      </div>
      <button onClick={handleAddTask}>提交</button>

      <WorkSpace />
    </div>
  )
}

function WorkSpace() {
  return (
    <div>123</div>
  )
}

export default App
