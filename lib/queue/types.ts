export type QueuePhase =
  | "start"
  | "enqueue"
  | "dequeue"
  | "peek"
  | "empty"
  | "complete"

export type QueueOperation = "enqueue" | "dequeue" | "peek"

export type QueueStep = {
  index: number
  operation: QueueOperation
  phase: QueuePhase
  array: number[]
  frontIndex: number
  rearIndex: number
  highlightIndices: number[]
  message: string
  aiExplanation: string
}
