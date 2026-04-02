"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { Queue } from "@/lib/queue/Queue"
import type { QueueStep } from "@/lib/queue/types"

const DEFAULT_SPEED_MS = 850

export function useQueuePlayback() {
  const [timeline, setTimeline] = useState<QueueStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)
  const [currentArray, setCurrentArray] = useState<number[]>([])

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

  const runEnqueue = useCallback(
    (value: number) => {
      const queue = new Queue()
      const currentItems = [...currentArray]
      for (const item of currentItems) {
        queue.enqueue(item)
      }
      const steps = queue.enqueue(value)
      setTimeline(steps)
      setFrameIndex(0)
      setIsPlaying(false)
      setCurrentArray(queue.getItems())
    },
    [currentArray]
  )

  const runDequeue = useCallback(() => {
    const queue = new Queue()
    const currentItems = [...currentArray]
    for (const item of currentItems) {
      queue.enqueue(item)
    }
    const steps = queue.dequeue()
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
    setCurrentArray(queue.getItems())
  }, [currentArray])

  const runPeek = useCallback(() => {
    const queue = new Queue()
    const currentItems = [...currentArray]
    for (const item of currentItems) {
      queue.enqueue(item)
    }
    const steps = queue.peek()
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
    setCurrentArray(queue.getItems())
  }, [currentArray])

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
    return `Queue • ${currentFrame.operation} • ${currentFrame.phase}`
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
    runEnqueue,
    runDequeue,
    runPeek,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
