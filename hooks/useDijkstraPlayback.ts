"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Dijkstra } from "@/lib/dijkstra/Dijkstra"
import type { DijkstraSnapshotStep } from "@/lib/dijkstra/types"

const DEFAULT_SPEED_MS = 850

export function useDijkstraPlayback() {
  const [nodeCount, setNodeCount] = useState(7)
  const dijkstraRef = useRef(new Dijkstra(nodeCount))
  const [timeline, setTimeline] = useState<DijkstraSnapshotStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)

  const currentFrame = timeline[frameIndex] ?? null
  const hasTimeline = timeline.length > 0

  useEffect(() => {
    if (!isPlaying || timeline.length === 0) return
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

  const runShortestPath = useCallback((startId?: number, endId?: number) => {
    const steps = dijkstraRef.current.run(startId, endId)
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [])

  const regenerateGraph = useCallback(
    (count?: number) => {
      const newCount = count ?? nodeCount
      setNodeCount(newCount)
      dijkstraRef.current.setNodeCount(newCount)
      setTimeline([])
      setFrameIndex(0)
      setIsPlaying(false)
    },
    [nodeCount]
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
    if (timeline.length > 0) setIsPlaying(true)
  }, [timeline.length])

  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  const reset = useCallback(() => {
    dijkstraRef.current.reset()
    setTimeline([])
    setFrameIndex(0)
    setIsPlaying(false)
    setSpeedMs(DEFAULT_SPEED_MS)
  }, [])

  const setSpeed = useCallback((nextSpeed: number) => {
    setSpeedMs(nextSpeed)
  }, [])

  const operationLabel = useMemo(() => {
    if (!currentFrame) return "No operation yet"
    return `DIJKSTRA • ${currentFrame.phase}`
  }, [currentFrame])

  return {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    hasTimeline,
    speedMs,
    operationLabel,
    nodeCount,
    runShortestPath,
    regenerateGraph,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
