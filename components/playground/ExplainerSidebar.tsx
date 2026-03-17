import type { AvlSnapshotStep } from "@/lib/avl/types"

type ExplainerSidebarProps = {
  timeline: AvlSnapshotStep[]
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
        Placeholder text for AI-generated explanations is shown per step.
      </p>

      <div className="mt-4 max-h-[540px] space-y-3 overflow-auto pr-2">
        {timeline.length === 0 ? (
          <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground">
            Run insert/delete to generate a timeline.
          </div>
        ) : null}

        {timeline.map((step, index) => {
          const isActive = index === frameIndex

          return (
            <div
              key={`${step.index}-${step.phase}`}
              className={
                isActive
                  ? "rounded-lg border border-primary bg-primary/10 p-3"
                  : "rounded-lg border bg-background p-3"
              }
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium tracking-wide uppercase">
                  {step.operation} • {step.phase}
                </span>
                <span className="text-muted-foreground">#{index + 1}</span>
              </div>
              <p className="mt-2 text-sm">{step.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {step.aiExplanation}
              </p>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
