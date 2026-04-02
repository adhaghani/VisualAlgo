export type ArrayListPhase =
  | "start"
  | "push"
  | "pop"
  | "insert-at"
  | "remove-at"
  | "peek"
  | "out-of-bounds"
  | "complete"

export type ArrayListOperation = "push" | "pop" | "insert" | "remove" | "peek"

export type ArrayListStep = {
  index: number
  operation: ArrayListOperation
  phase: ArrayListPhase
  array: number[]
  highlightIndices: number[]
  capacity: number
  message: string
  aiExplanation: string
}
