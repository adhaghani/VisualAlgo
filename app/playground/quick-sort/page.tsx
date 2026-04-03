"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { QuickSortView } from "@/components/playground/QuickSortView"
import { ViewCodeButton } from "@/components/ViewCodeButton"
import { useQuickSortPlayback } from "@/hooks/useQuickSortPlayback"

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

export default function QuickSortPlaygroundPage() {
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
  } = useQuickSortPlayback()

  const [sizeInput, setSizeInput] = useState(String(arraySize))

  const sidebarTimeline = useMemo(() => {
    return timeline
      .map((step) => adaptStepForSidebar(step))
      .filter((step): step is NonNullable<typeof step> => step !== null)
  }, [timeline])

  const runSortWithReset = () => {
    runSort()
  }

  const handleSizeChange = (value: string) => {
    setSizeInput(value)
    const num = Number(value)
    if (Number.isInteger(num) && num >= 3 && num <= 30) {
      generateNewArray(num)
    }
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • Quick Sort
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a random array and watch quick sort partition and sort
            elements using the divide-and-conquer approach.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
          <div className="mt-3">
            <ViewCodeButton algorithmId="quick-sort" />
          </div>
        </header>

        <QuickSortView step={currentFrame} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
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
          </div>

          <ExplainerSidebar
            timeline={sidebarTimeline}
            frameIndex={frameIndex}
          />
        </div>
      </div>
    </main>
  )
}
