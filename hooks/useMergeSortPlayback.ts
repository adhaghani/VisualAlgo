"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import { MergeSort } from "@/lib/mergeSort/MergeSort"
import type { MergeSortStep } from "@/lib/mergeSort/types"

const DEFAULT_SPEED_MS = 450

function generateRandomArray(size: number, max: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1)
}

export function useMergeSortPlayback() {
  const [timeline, setTimeline] = useState<MergeSortStep[]>([])
  const [frameIndex, setFrameIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speedMs, setSpeedMs] = useState(DEFAULT_SPEED_MS)
  const [arraySize, setArraySize] = useState(10)
  const [currentArray, setCurrentArray] = useState<number[]>(() =>
    generateRandomArray(10, 50)
  )

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

  const runSort = useCallback(() => {
    const sorter = new MergeSort()
    const steps = sorter.generateSteps(currentArray)
    setTimeline(steps)
    setFrameIndex(0)
    setIsPlaying(false)
  }, [currentArray])

  const generateNewArray = useCallback(
    (size?: number) => {
      const newSize = size ?? arraySize
      setArraySize(newSize)
      const newArr = generateRandomArray(newSize, 50)
      setCurrentArray(newArr)
      setTimeline([])
      setFrameIndex(0)
      setIsPlaying(false)
    },
    [arraySize]
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
    setTimeline([])
    setFrameIndex(0)
    setIsPlaying(false)
    setSpeedMs(DEFAULT_SPEED_MS)
    setCurrentArray(generateRandomArray(arraySize, 50))
  }, [arraySize])

  const setSpeed = useCallback((nextSpeed: number) => {
    setSpeedMs(nextSpeed)
  }, [])

  const operationLabel = useMemo(() => {
    if (!currentFrame) {
      return "No operation yet"
    }
    return `Merge Sort • ${currentFrame.phase}`
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
    arraySize,
    runSort,
    generateNewArray,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  }
}
