import clockCountDownSound from './assets/clock-countdown-bleeps.wav'
import smoothVibeSound from './assets/smooth-vibe.mp3'

const soundMap: Record<string, string> = {
  clockCountDownSound,
  smoothVibeSound
}
export const DEFAULT_SOUND_KEY = 'smoothVibeSound'
export const DEFAULT_SOUND_SRC = soundMap[DEFAULT_SOUND_KEY]

export function getSoundSrc(key: string) {
  return soundMap[key] || DEFAULT_SOUND_SRC
}

export function soundTest() {
  const audio = new Audio(DEFAULT_SOUND_SRC)
  audio.play()
}
