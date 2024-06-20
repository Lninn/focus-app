export default function Settings() {
  return (
    <div>
      <div className="form-item">
        <label>模式</label>
        <select>
          <option value="1">debug</option>
          <option value="2">正常</option>
        </select>
      </div>

      <div className="form-item">
        <label>声音测试</label>
        <button>播放</button>
      </div>
    </div>
  )
}
