"use client"

import { useMemo, useState } from "react"

import { DijkstraView } from "@/components/playground/DijkstraView"
import { ExplainerSidebar } from "@/components/playground/ExplainerSidebar"
import { PlaybackControls } from "@/components/playground/PlaybackControls"
import { useDijkstraPlayback } from "@/hooks/useDijkstraPlayback"

function adaptStepForSidebar(step: { message: string; phase: string } | null) {
  if (!step) return null
  return {
    message: step.message,
    aiExplanation: "",
    operation: "shortest-path",
    phase: step.phase,
    index: 0,
  }
}

export default function DijkstraPlaygroundPage() {
  const {
    timeline,
    frameIndex,
    currentFrame,
    isPlaying,
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
  } = useDijkstraPlayback()

  const [countInput, setCountInput] = useState(String(nodeCount))
  const [startInput, setStartInput] = useState("1")
  const [endInput, setEndInput] = useState("")

  const sidebarTimeline = useMemo(() => {
    return timeline
      .map((step) => adaptStepForSidebar(step))
      .filter((step): step is NonNullable<typeof step> => step !== null)
  }, [timeline])

  const runPath = () => {
    const startId = Number(startInput) || undefined
    const endId = endInput ? Number(endInput) || undefined : undefined
    runShortestPath(startId, endId)
  }

  const handleCountChange = (value: string) => {
    setCountInput(value)
    const num = Number(value)
    if (Number.isInteger(num) && num >= 3 && num <= 15) {
      regenerateGraph(num)
    }
  }

  return (
    <main className="min-h-svh bg-gradient-to-b from-background to-muted/20 p-4 md:p-6">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <header className="rounded-xl border bg-card p-4 shadow-sm">
          <h1 className="text-xl font-semibold">
            Mini Algorithm Playground • Dijkstra&apos;s Algorithm
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find the shortest path in a weighted graph. Adjust the node count
            and watch Dijkstra&apos;s algorithm step by step.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Current: {operationLabel}
          </p>
        </header>

        <DijkstraView step={currentFrame} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <PlaybackControls
              inputValue={countInput}
              onInputChange={handleCountChange}
              onInsert={runPath}
              onDelete={() => regenerateGraph()}
              isPlaying={isPlaying}
              onPlay={play}
              onPause={pause}
              onStepPrev={stepPrev}
              onStepNext={stepNext}
              onReset={reset}
              speedMs={speedMs}
              onSpeedChange={setSpeed}
              insertLabel="Find Path"
              deleteLabel="New Graph"
              inputLabel="Node count (3-15)"
              inputPlaceholder="e.g. 7"
            />
            <div className="rounded-xl border bg-card p-4 shadow-sm">
              <h2 className="text-sm font-semibold">Path Options</h2>
              <div className="mt-3 flex flex-col gap-2">
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  Start Node ID
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={startInput}
                    onChange={(e) => setStartInput(e.target.value)}
                    placeholder="e.g. 1"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-muted-foreground">
                  End Node ID (optional)
                  <input
                    className="h-9 rounded-md border bg-background px-3 text-sm text-foreground ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    type="number"
                    value={endInput}
                    onChange={(e) => setEndInput(e.target.value)}
                    placeholder="e.g. 5"
                  />
                </label>
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
