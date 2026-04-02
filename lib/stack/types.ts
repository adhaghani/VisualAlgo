export type StackPhase =
  | "start"
  | "push"
  | "pop"
  | "peek"
  | "empty"
  | "complete"

export type StackOperation = "push" | "pop" | "peek"

export type StackStep = {
  index: number
  operation: StackOperation
  phase: StackPhase
  array: number[]
  topIndex: number
  highlightIndices: number[]
  message: string
  aiExplanation: string
}
