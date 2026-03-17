"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { AVLTree } from "@/lib/avl/AVLTree"
import type { AvlOperation, AvlSnapshotStep } from "@/lib/avl/types"

const DEFAULT_SPEED_MS = 850

export function useAvlPlayback() {
  const treeRef = useRef(new AVLTree())
  const [timeline, setTimeline] = useState<AvlSnapshotStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)

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

  const runOperation = useCallback((operation: AvlOperation, value: number) => {
    const nextTimeline =
      operation === "insert"
        ? treeRef.current.insert(value)
        : treeRef.current.delete(value)

    setTimeline(nextTimeline)
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
    treeRef.current.clear()
    setTimeline([])
    setFrameIndex(0)
    setIsPlaying(false)
    setSpeedMs(DEFAULT_SPEED_MS)
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
    runOperation,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
