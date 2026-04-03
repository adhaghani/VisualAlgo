"use client"

import { useMemo, useState } from "react"

import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import HashTableView from "@/components/playground/HashTableView"
import { ViewCodeButton } from "@/components/ViewCodeButton"
import { useHashTablePlayback } from "@/hooks/useHashTablePlayback"
import type { HashTableSnapshotStep } from "@/lib/hashTable/types"

function adaptStepForSidebar(step: HashTableSnapshotStep) {
  return {
    message: step.message,
    aiExplanation: step.aiExplanation,
    operation: step.operation,
    phase: step.phase,
    index: step.index,
  }
}

export default function HashTablePlaygroundPage() {
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    speedMs,
    operationLabel,
    runOperation,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  } = useHashTablePlayback()
  const [valueInput, setValueInput] = useState("")
  const [modeInput, setModeInput] = useState("insert")
  const parsedValue = useMemo(() => Number(valueInput), [valueInput])
  const valueIsValid = Number.isInteger(parsedValue)
  const sidebarTimeline = useMemo(
    () => timeline.map(adaptStepForSidebar),
    [timeline]
  )
  const runAction = () => {
    if (!valueIsValid) return
    const mode = modeInput as "insert" | "search" | "delete"
    runOperation(mode, parsedValue)
  }

  return (
    <main className="min-h-svh bg-linear-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-400 flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • Hash Table
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Insert, search, and delete keys with separate chaining collision
            resolution.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
          <div className="mt-3">
            <ViewCodeButton algorithmId="hash-table" />
          </div>
        </header>
        <HashTableView step={currentFrame} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Controls</h2>
              <div className="mt-3 flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Mode
                  <select
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={modeInput}
                    onChange={(e) => setModeInput(e.target.value)}
                  >
                    <option value="insert">Insert</option>
                    <option value="search">Search</option>
                    <option value="delete">Delete</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Key
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={valueInput}
                    onChange={(e) => setValueInput(e.target.value)}
                    placeholder="e.g. 42"
                  />
                </label>
                <button
                  className="mt-2 h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  onClick={runAction}
                  disabled={!valueIsValid}
                >
                  Execute
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  className="h-9 rounded-md border bg-background px-3 text-sm hover:bg-accent"
                  onClick={stepPrev}
                >
                  Prev
                </button>
                {isPlaying ? (
                  <button
                    className="h-9 rounded-md bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                    onClick={pause}
                  >
                    Pause
                  </button>
                ) : (
                  <button
                    className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    onClick={play}
                  >
                    Play
                  </button>
                )}
                <button
                  className="h-9 rounded-md border bg-background px-3 text-sm hover:bg-accent"
                  onClick={stepNext}
                >
                  Next
                </button>
                <button
                  className="h-9 rounded-md px-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                      className={`h-8 rounded-md px-3 text-xs font-medium transition-colors ${option === speedMs ? "bg-primary text-primary-foreground" : "border bg-background hover:bg-accent"}`}
                      onClick={() => setSpeed(option)}
                    >
                      {option}ms
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {!valueIsValid && valueInput.length > 0 ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Please enter a valid integer.
              </div>
            ) : null}
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
