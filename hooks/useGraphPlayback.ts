"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Graph } from "@/lib/graph/Graph"
import type { GraphOperation, GraphSnapshotStep } from "@/lib/graph/types"

const DEFAULT_SPEED_MS = 850

export function useGraphPlayback() {
  const graphRef = useRef(new Graph())
  const [timeline, setTimeline] = useState<GraphSnapshotStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)
  const [pendingOperation, setPendingOperation] =
    useState<GraphOperation | null>(null)

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

  const runOperation = useCallback((operation: GraphOperation) => {
    const graph = graphRef.current
    let steps: GraphSnapshotStep[] = []

    switch (operation) {
      case "bfs":
        steps = graph.bfs()
        break
      case "dfs":
        steps = graph.dfs()
        break
      default:
        return
    }

    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
    setPendingOperation(operation)
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
    graphRef.current.reset()
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
