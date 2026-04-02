import type { AvlSnapshotStep } from "@/lib/avl/types"

type GenericStep = {
  message: string
  aiExplanation?: string
  operation?: string
  phase: string
  index?: number
}

type ExplainerSidebarProps = {
  timeline: (AvlSnapshotStep | GenericStep)[]
  frameIndex: number
}

export function ExplainerSidebar({
  timeline,
  frameIndex,
}: ExplainerSidebarProps) {
  return (
    <aside className="rounded-xl border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold">Step-by-Step Explainer</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Each step shows what the algorithm is doing.
      </p>

      <div className="mt-4 max-h-[60vh] space-y-3 overflow-auto pr-2">
        {timeline.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            Run an operation to generate a timeline.
          </div>
        ) : null}

        {timeline.map((step, index) => {
          const isActive = index === frameIndex
          const message = "message" in step ? step.message : ""
          const aiExplanation =
            "aiExplanation" in step ? step.aiExplanation : ""
          const operation = "operation" in step ? step.operation : "step"
          const phase = "phase" in step ? step.phase : ""

          return (
            <div
              key={`${index}-${phase}`}
              className={
                isActive
                  ? "rounded-lg border border-primary bg-primary/10 p-3"
                  : "rounded-lg border bg-background p-3"
              }
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium tracking-wide uppercase">
                  {operation} • {phase}
                </span>
                <span className="text-muted-foreground">#{index + 1}</span>
              </div>
              <p className="mt-2 text-sm">{message}</p>
              {aiExplanation && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {aiExplanation}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
