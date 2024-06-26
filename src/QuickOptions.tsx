export default function QuickOptions({
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
