"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { StackView } from "@/components/playground/StackView"
import { useStackPlayback } from "@/hooks/useStackPlayback"

function adaptStepForSidebar(
  step: { message: string; phase: string; operation: string } | null
) {
  if (!step) return null
  return {
    message: step.message,
    aiExplanation: "",
    operation: step.operation,
    phase: step.phase,
    index: 0,
  }
}

export default function StackPlaygroundPage() {
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    speedMs,
    operationLabel,
    runPush,
    runPop,
    runPeek,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  } = useStackPlayback()

  const [valueInput, setValueInput] = useState("1")

  const sidebarTimeline = useMemo(() => {
    return timeline
      .map((step) => adaptStepForSidebar(step))
      .filter(
        (step): step is NonNullable<ReturnType<typeof adaptStepForSidebar>> =>
          step !== null
      )
  }, [timeline])

  const handlePush = () => {
    const num = Number(valueInput)
    if (!Number.isNaN(num)) {
      runPush(num)
    }
  }

  const handlePop = () => {
    runPop()
  }

  const handlePeek = () => {
    runPeek()
  }

  return (
    <main className="min-h-svh bg-linear-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground &bull; Stack
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Push, pop, and peek elements to see how a LIFO stack operates step
            by step.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
        </header>

        <StackView step={currentFrame} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Controls</h2>

              <div className="mt-3 flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Value
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={valueInput}
                    onChange={(event) => setValueInput(event.target.value)}
                    placeholder="e.g. 42"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    onClick={handlePush}
                  >
                    Push
                  </button>
                  <button
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={handlePop}
                  >
                    Pop
                  </button>
                  <button
                    className="flex-1 rounded-md border bg-background px-3 py-2 text-sm font-medium hover:bg-muted"
                    onClick={handlePeek}
                  >
                    Peek
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  onClick={stepPrev}
                >
                  Prev
                </button>

                {isPlaying ? (
                  <button
                    className="rounded-md bg-secondary px-3 py-2 text-sm font-medium"
                    onClick={pause}
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
                    onClick={play}
                  >
                    Play
                  </button>
                )}

                <button
                  className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                  onClick={stepNext}
                >
                  Next
                </button>

                <button
                  className="rounded-md px-3 py-2 text-sm hover:bg-muted"
                  onClick={reset}
                >
                  Reset
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Playback speed</p>
                <div className="mt-2 flex gap-2">
                  {[1200, 850, 450].map((option) => (
                    <button
                      key={option}
                      className={`rounded-md px-3 py-1.5 text-sm ${
                        option === speedMs
                          ? "bg-primary text-primary-foreground"
                          : "border bg-background hover:bg-muted"
                      }`}
                      onClick={() => setSpeed(option)}
                    >
                      {option}ms
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
