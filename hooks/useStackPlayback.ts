"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { Stack } from "@/lib/stack/Stack"
import type { StackStep } from "@/lib/stack/types"

const DEFAULT_SPEED_MS = 850

export function useStackPlayback() {
  const [timeline, setTimeline] = useState<StackStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)
  const [currentArray, setCurrentArray] = useState<number[]>([])

  const stackRef = useMemo(() => new Stack(), [])

  const currentFrame = timeline[frameIndex] ?? null
  const hasTimeline = timeline.length > 0

  useEffect(() => {
    if (!isPlaying || timeline.length === 0) {
      return
    }

    const timer = window.setInterval(() => {
      setFrameIndex((prev) => {
        if (prev >= timeline.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, speedMs)

    return () => window.clearInterval(timer)
  }, [isPlaying, speedMs, timeline.length])

  const runPush = useCallback(
    (value: number) => {
      const steps = stackRef.push(value)
      setTimeline((prev) => {
        const baseIndex = prev.length
        const reindexed = steps.map((step, i) => ({
          ...step,
          index: baseIndex + i,
        }))
        return [...prev, ...reindexed]
      })
      setFrameIndex((prev) => prev)
      setIsPlaying(false)
      setCurrentArray((prev) => [...prev, value])
    },
    [stackRef]
  )

  const runPop = useCallback(() => {
    const steps = stackRef.pop()
    setTimeline((prev) => {
      const baseIndex = prev.length
      const reindexed = steps.map((step, i) => ({
        ...step,
        index: baseIndex + i,
      }))
      return [...prev, ...reindexed]
    })
    setFrameIndex((prev) => prev)
    setIsPlaying(false)
    setCurrentArray((prev) => prev.slice(0, -1))
  }, [stackRef])

  const runPeek = useCallback(() => {
    const steps = stackRef.peek()
    setTimeline((prev) => {
      const baseIndex = prev.length
      const reindexed = steps.map((step, i) => ({
        ...step,
        index: baseIndex + i,
      }))
      return [...prev, ...reindexed]
    })
    setFrameIndex((prev) => prev)
    setIsPlaying(false)
  }, [stackRef])

  const stepNext = useCallback(() => {
    setIsPlaying(false)
    setFrameIndex((prev) =>
      Math.min(prev + 1, Math.max(timeline.length - 1, 0))
    )
  }, [timeline.length])

  const stepPrev = useCallback(() => {
    setIsPlaying(false)
    setFrameIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const play = useCallback(() => {
    if (timeline.length > 0) {
      setIsPlaying(true)
    }
  }, [timeline.length])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    setTimeline([])
    setFrameIndex(0)
    setIsPlaying(false)
    setSpeedMs(DEFAULT_SPEED_MS)
    setCurrentArray([])
  }, [])

  const setSpeed = useCallback((nextSpeed: number) => {
    setSpeedMs(nextSpeed)
  }, [])

  const operationLabel = useMemo(() => {
    if (!currentFrame) {
      return "No operation yet"
    }
    return `Stack • ${currentFrame.operation} • ${currentFrame.phase}`
  }, [currentFrame])

  return {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    hasTimeline,
    speedMs,
    operationLabel,
    currentArray,
    runPush,
    runPop,
    runPeek,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
