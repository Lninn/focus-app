import { useEffect } from "react"
import { soundTest } from "./sound"
import { updateInterval } from "./state"
import useLocalState from "./useLocalState"

export default function Settings() {
  const [mode, setMode] = useLocalState('mode')

  useEffect(() => {
    // TODO
    // 应该放到 App 里的一个 initial 函数中统一处理
    onModeChange(mode)
  }, [])

  function onModeChange(val: string) {
    const i = val === '1' ? 50 : 1000
    updateInterval(i)
  }

  function playSound() {
    soundTest()
  }

  function playSoundAfter3s() {
    setTimeout(soundTest, 3000)
  }

  function handleModeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value
    setMode(val)
  
    onModeChange(val)
  }

  return (
    <div>
      <div className="form-item">
        <label>模式</label>
        <select value={mode} onChange={e => handleModeChange(e)}>
          <option value="1">debug</option>
          <option value="2">正常</option>
        </select>
      </div>

      <div className="form-item">
        <label>声音测试</label>
        <button onClick={playSound}>立即播放</button>
      </div>

      <div className="form-item">
        <label>声音测试</label>
        <button onClick={playSoundAfter3s}>3秒后播放</button>
      </div>
    </div>
  )
}
