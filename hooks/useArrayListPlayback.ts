"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { ArrayList } from "@/lib/arrayList/ArrayList"
import type { ArrayListStep } from "@/lib/arrayList/types"

const DEFAULT_SPEED_MS = 850

export function useArrayListPlayback() {
  const listRef = useRef(new ArrayList())
  const [timeline, setTimeline] = useState<ArrayListStep[]>([])
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

  const runPush = useCallback((value: number) => {
    const steps = listRef.current.push(value)
    setCurrentArray(listRef.current.getCurrentArray())
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

  const runPop = useCallback(() => {
    const steps = listRef.current.pop()
    setCurrentArray(listRef.current.getCurrentArray())
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

  const runInsertAt = useCallback((index: number, value: number) => {
    const steps = listRef.current.insertAt(index, value)
    setCurrentArray(listRef.current.getCurrentArray())
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

  const runRemoveAt = useCallback((index: number) => {
    const steps = listRef.current.removeAt(index)
    setCurrentArray(listRef.current.getCurrentArray())
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

  const runPeek = useCallback((index: number) => {
    const steps = listRef.current.peek(index)
    setCurrentArray(listRef.current.getCurrentArray())
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

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
    listRef.current.clear()
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
    return `${currentFrame.operation.toUpperCase()} • ${currentFrame.phase}`
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
    runInsertAt,
    runRemoveAt,
    runPeek,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
