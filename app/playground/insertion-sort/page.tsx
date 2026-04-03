"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { InsertionSortView } from "@/components/playground/InsertionSortView"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { ViewCodeButton } from "@/components/ViewCodeButton"
import { useInsertionSortPlayback } from "@/hooks/useInsertionSortPlayback"

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

export default function InsertionSortPlaygroundPage() {
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
  } = useInsertionSortPlayback()

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
    <main className="min-h-svh bg-linear-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • Insertion Sort
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate a random array and watch insertion sort pick and insert
            elements step by step.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
          <div className="mt-3">
            <ViewCodeButton algorithmId="insertion-sort" />
          </div>
        </header>

        <InsertionSortView step={currentFrame} />

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
