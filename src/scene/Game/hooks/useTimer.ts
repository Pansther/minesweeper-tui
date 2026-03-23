import { useEffect, useRef, useState } from 'react'

const secondsToHms = (totalSeconds: number) => {
  totalSeconds = Math.floor(totalSeconds)

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return {
    hours,
    minutes,
    seconds,
  }
}

const useTimer = () => {
  const [timer, setTimer] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>(undefined)

  const start = () => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1_000)
  }

  const stop = () => {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  return [
    secondsToHms(timer),
    {
      start,
      stop,
      restart: () => setTimer(0),
    },
  ] as const
}

export default useTimer
