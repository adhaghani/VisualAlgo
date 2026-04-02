"use client"

import { useMemo, useState } from "react"

import { ArrayListView } from "@/components/playground/ArrayListView"
import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { Button } from "@/components/ui/button"
import { useArrayListPlayback } from "@/hooks/useArrayListPlayback"
import { List, ListMinus, ListPlus, Search } from "lucide-react"

function adaptStepForSidebar(step: { message: string; phase: string } | null) {
  if (!step) return null
  return {
    message: step.message,
    aiExplanation: "",
    operation: "array-list",
    phase: step.phase,
    index: 0,
  }
}

export default function ArrayListPlaygroundPage() {
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
    speedMs,
    operationLabel,
    runPush,
    runPop,
    runInsertAt,
    runRemoveAt,
    runPeek,
    stepNext,
    stepPrev,
    play,
    pause,
    reset,
    setSpeed,
  } = useArrayListPlayback()

  const [valueInput, setValueInput] = useState("")
  const [indexInput, setIndexInput] = useState("")

  const parsedValue = useMemo(() => Number(valueInput), [valueInput])
  const parsedIndex = useMemo(() => Number(indexInput), [indexInput])
  const valueIsValid = Number.isInteger(parsedValue)
  const indexIsValid = Number.isInteger(parsedIndex)

  const sidebarTimeline = useMemo(() => {
    return timeline
      .map((step) => adaptStepForSidebar(step))
      .filter((step): step is NonNullable<typeof step> => step !== null)
  }, [timeline])

  const handlePush = () => {
    if (!valueIsValid) return
    runPush(parsedValue)
  }

  const handlePop = () => {
    runPop()
  }

  const handleInsertAt = () => {
    if (!valueIsValid || !indexIsValid) return
    runInsertAt(parsedIndex, parsedValue)
  }

  const handleRemoveAt = () => {
    if (!indexIsValid) return
    runRemoveAt(parsedIndex)
  }

  const handlePeek = () => {
    if (!indexIsValid) return
    runPeek(parsedIndex)
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • ArrayList
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Push, pop, insert, remove, and peek elements in a dynamic array.
            Watch capacity doubling and element shifting step by step.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
        </header>

        <ArrayListView step={currentFrame} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Controls</h2>

              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="flex min-w-[100px] flex-1 flex-col gap-1 text-xs text-muted-foreground">
                  Value
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={valueInput}
                    onChange={(event) => setValueInput(event.target.value)}
                    placeholder="e.g. 42"
                  />
                </label>

                <label className="flex min-w-[100px] flex-1 flex-col gap-1 text-xs text-muted-foreground">
                  Index
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={indexInput}
                    onChange={(event) => setIndexInput(event.target.value)}
                    placeholder="e.g. 0"
                  />
                </label>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button onClick={handlePush} className="w-full">
                  <ListPlus className="mr-1 h-4 w-4" />
                  Push
                </Button>
                <Button
                  variant="secondary"
                  onClick={handlePop}
                  className="w-full"
                >
                  <ListMinus className="mr-1 h-4 w-4" />
                  Pop
                </Button>
                <Button
                  variant="outline"
                  onClick={handleInsertAt}
                  className="w-full"
                >
                  <List className="mr-1 h-4 w-4" />
                  Insert At
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRemoveAt}
                  className="w-full"
                >
                  <ListMinus className="mr-1 h-4 w-4" />
                  Remove At
                </Button>
                <Button
                  variant="ghost"
                  onClick={handlePeek}
                  className="col-span-2 w-full"
                >
                  <Search className="mr-1 h-4 w-4" />
                  Peek At Index
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button variant="outline" size="icon" onClick={stepPrev}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="19 20 9 12 19 4 19 20" />
                    <line x1="5" y1="19" x2="5" y2="5" />
                  </svg>
                </Button>

                {isPlaying ? (
                  <Button variant="secondary" onClick={pause}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause
                  </Button>
                ) : (
                  <Button onClick={play}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Play
                  </Button>
                )}

                <Button variant="outline" size="icon" onClick={stepNext}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 4 15 12 5 20 5 4" />
                    <line x1="19" y1="5" x2="19" y2="19" />
                  </svg>
                </Button>

                <Button variant="ghost" onClick={reset}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Reset
                </Button>
              </div>

              <div className="mt-4">
                <p className="text-xs text-muted-foreground">Playback speed</p>
                <div className="mt-2 flex gap-2">
                  {[1200, 850, 450].map((option) => (
                    <Button
                      key={option}
                      variant={option === speedMs ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSpeed(option)}
                    >
                      {option}ms
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {!valueIsValid && valueInput.length > 0 ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Please enter a valid integer for value.
              </div>
            ) : null}

            {!indexIsValid && indexInput.length > 0 ? (
              <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                Please enter a valid integer for index.
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
