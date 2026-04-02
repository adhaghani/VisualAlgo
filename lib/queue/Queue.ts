import {
  type QueueOperation,
  type QueuePhase,
  type QueueStep,
} from "@/lib/queue/types"

export class Queue {
  private items: number[]
  private nextIndex: number

  constructor() {
    this.items = []
    this.nextIndex = 0
  }

  private capture(
    operation: QueueOperation,
    phase: QueuePhase,
    array: number[],
    frontIndex: number,
    rearIndex: number,
    highlightIndices: number[],
    message: string,
    aiExplanation: string
  ): QueueStep {
    return {
      index: this.nextIndex++,
      operation,
      phase,
      array: [...array],
      frontIndex,
      rearIndex,
      highlightIndices,
      message,
      aiExplanation,
    }
  }

  enqueue(value: number): QueueStep[] {
    const steps: QueueStep[] = []

    steps.push(
      this.capture(
        "enqueue",
        "start",
        [...this.items],
        0,
        this.items.length - 1,
        [],
        `Preparing to enqueue value ${value} into the queue.`,
        "The enqueue operation adds an element to the rear of the queue."
      )
    )

    this.items.push(value)
    const rearIndex = this.items.length - 1

    steps.push(
      this.capture(
        "enqueue",
        "enqueue",
        [...this.items],
        0,
        rearIndex,
        [rearIndex],
        `Enqueued ${value} at rear (index ${rearIndex}). Queue: [${this.items.join(", ")}].`,
        `Value ${value} has been added to the rear of the queue. The rear pointer is now at index ${rearIndex}.`
      )
    )

    return steps
  }

  dequeue(): QueueStep[] {
    const steps: QueueStep[] = []

    if (this.items.length === 0) {
      steps.push(
        this.capture(
          "dequeue",
          "empty",
          [],
          -1,
          -1,
          [],
          "Cannot dequeue: the queue is empty.",
          "The queue has no elements. Dequeue operation cannot be performed on an empty queue."
        )
      )
      return steps
    }

    const frontValue = this.items[0]

    steps.push(
      this.capture(
        "dequeue",
        "start",
        [...this.items],
        0,
        this.items.length - 1,
        [0],
        `Preparing to dequeue. Front element is ${frontValue}.`,
        "The dequeue operation removes the element at the front of the queue (FIFO - First In, First Out)."
      )
    )

    this.items.shift()

    steps.push(
      this.capture(
        "dequeue",
        "dequeue",
        [...this.items],
        this.items.length > 0 ? 0 : -1,
        this.items.length - 1,
        [],
        `Dequeued ${frontValue} from front. Queue: [${this.items.join(", ")}].`,
        `Value ${frontValue} has been removed from the front. The queue now has ${this.items.length} element(s).`
      )
    )

    return steps
  }

  peek(): QueueStep[] {
    const steps: QueueStep[] = []

    if (this.items.length === 0) {
      steps.push(
        this.capture(
          "peek",
          "empty",
          [],
          -1,
          -1,
          [],
          "Cannot peek: the queue is empty.",
          "The queue has no elements. Peek operation cannot be performed on an empty queue."
        )
      )
      return steps
    }

    const frontValue = this.items[0]

    steps.push(
      this.capture(
        "peek",
        "peek",
        [...this.items],
        0,
        this.items.length - 1,
        [0],
        `Peeked front element: ${frontValue}. Queue remains unchanged.`,
        `The front element is ${frontValue}. Peek allows us to view the front element without removing it.`
      )
    )

    return steps
  }

  getItems(): number[] {
    return [...this.items]
  }

  isEmpty(): boolean {
    return this.items.length === 0
  }
}
