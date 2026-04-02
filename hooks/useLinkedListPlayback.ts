"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { LinkedList } from "@/lib/linkedlist/LinkedList"
import type {
  LinkedListOperation,
  LinkedListSnapshotStep,
} from "@/lib/linkedlist/types"

const DEFAULT_SPEED_MS = 850

export function useLinkedListPlayback() {
  const listRef = useRef(new LinkedList())
  const [timeline, setTimeline] = useState<LinkedListSnapshotStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)
  const [pendingOperation, setPendingOperation] =
    useState<LinkedListOperation | null>(null)

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

  const runOperation = useCallback(
    (operation: LinkedListOperation, value: number) => {
      const list = listRef.current
      let steps: LinkedListSnapshotStep[] = []

      switch (operation) {
        case "insert-front":
          steps = list.insertFront(value)
          break
        case "insert-back":
          steps = list.insertBack(value)
          break
        case "delete":
          steps = list.delete(value)
          break
        case "search":
          steps = list.search(value)
          break
      }

      setTimeline(steps)
      setFrameIndex(0)
      setIsPlaying(false)
      setPendingOperation(operation)
    },
    []
  )

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
    listRef.current.reset()
    setTimeline([])
    setFrameIndex(0)
    setIsPlaying(false)
    setSpeedMs(DEFAULT_SPEED_MS)
    setPendingOperation(null)
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
    pendingOperation,
    runOperation,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
