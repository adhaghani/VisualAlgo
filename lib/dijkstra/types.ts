export type DijkstraPhase =
  | "start"
  | "visit"
  | "relax"
  | "update"
  | "skip"
  | "complete"

export type SerializedDijkstraNode = {
  id: number
  label: string
  x: number
  y: number
  neighbors: { nodeId: number; weight: number }[]
}

export type DijkstraSnapshotStep = {
  index: number
  phase: DijkstraPhase
  nodes: SerializedDijkstraNode[]
  edges: [number, number, number][]
  activeNode?: number
  visitedNodes: Set<number>
  distances: Map<number, number>
  pathNodes: Set<number>
  message: string
  aiExplanation: string
}
