"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { MergeSortView } from "@/components/playground/MergeSortView"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { ViewCodeButton } from "@/components/ViewCodeButton"
import { useMergeSortPlayback } from "@/hooks/useMergeSortPlayback"

function adaptStepForSidebar(step: { message: string; phase: string } | null) {
  if (!step) return null

  return {
    message: step.message,
    aiExplanation: "",
    operation: "sort",
    phase: step.phase,
    index: 0,
  }
}

export function MergeSortPlaygroundClient() {
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    speedMs,
    operationLabel,
    arraySize,
    runSort,
    generateNewArray,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  } = useMergeSortPlayback()

  const [sizeInput, setSizeInput] = useState(String(arraySize))
  const sidebarTimeline = useMemo(
    () =>
      timeline
        .map((s) => adaptStepForSidebar(s))
        .filter(
          (step): step is NonNullable<ReturnType<typeof adaptStepForSidebar>> =>
            step !== null
        ),
    [timeline]
  )

  const runSortWithReset = () => runSort()

  const handleSizeChange = (value: string) => {
    setSizeInput(value)
    const num = Number(value)
    if (Number.isInteger(num) && num >= 3 && num <= 30) generateNewArray(num)
  }

  return (
    <>
      <header className="rounded-xl border bg-card p-4 shadow-sm">
        <h1 className="text-xl font-semibold">
          Mini Algorithm Playground • Merge Sort
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate a random array and watch merge sort divide and conquer step
          by step.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Current: {operationLabel}
        </p>
        <div className="mt-3">
          <ViewCodeButton algorithmId="merge-sort" />
        </div>
      </header>
      <MergeSortView step={currentFrame} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
        <PlaybackControls
          inputValue={sizeInput}
          onInputChange={handleSizeChange}
          onInsert={runSortWithReset}
          onDelete={() => generateNewArray()}
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onStepPrev={stepPrev}
          onStepNext={stepNext}
          onReset={() => {
            setSizeInput(String(arraySize))
            reset()
          }}
          speedMs={speedMs}
          onSpeedChange={setSpeed}
          insertLabel="Sort"
          deleteLabel="New Array"
        />
        <ExplainerSidebar timeline={sidebarTimeline} frameIndex={frameIndex} />
      </div>
    </>
  )
}
