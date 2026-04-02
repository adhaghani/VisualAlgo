export type LinkedListOperation =
  | "insert-front"
  | "insert-back"
  | "delete"
  | "search"

export type LinkedListPhase =
  | "start"
  | "traverse"
  | "found"
  | "insert"
  | "delete"
  | "complete"
  | "miss"

export type SerializedListNode = {
  id: number
  value: number
  nextId?: number
}

export type LinkedListSnapshotStep = {
  index: number
  operation: LinkedListOperation
  phase: LinkedListPhase
  nodes: SerializedListNode[]
  activeId?: number
  highlightIds: number[]
  message: string
  aiExplanation: string
}
