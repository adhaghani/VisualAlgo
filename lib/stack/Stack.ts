import {
  type StackOperation,
  type StackPhase,
  type StackStep,
} from "@/lib/stack/types"

export class Stack {
  private items: number[] = []

  private capture(
    steps: StackStep[],
    nextIndex: { value: number },
    operation: StackOperation,
    phase: StackPhase,
    array: number[],
    topIndex: number,
    highlightIndices: number[],
    message: string,
    aiExplanation: string
  ) {
    steps.push({
      index: nextIndex.value++,
      operation,
      phase,
      array: [...array],
      topIndex,
      highlightIndices,
      message,
      aiExplanation,
    })
  }

  push(value: number): StackStep[] {
    const steps: StackStep[] = []
    const nextIndex = { value: 0 }

    this.capture(
      steps,
      nextIndex,
      "push",
      "push",
      this.items,
      this.items.length - 1,
      [],
      `Pushing ${value} onto the stack.`,
      `The value ${value} will be placed on top of the stack. Stack follows LIFO (Last In, First Out) principle.`
    )

    this.items.push(value)

    this.capture(
      steps,
      nextIndex,
      "push",
      "push",
      this.items,
      this.items.length - 1,
      [this.items.length - 1],
      `${value} is now at the top of the stack (index ${this.items.length - 1}).`,
      `Push operation complete. The new element ${value} is now the top element. Current stack size: ${this.items.length}.`
    )

    return steps
  }

  pop(): StackStep[] {
    const steps: StackStep[] = []
    const nextIndex = { value: 0 }

    if (this.items.length === 0) {
      this.capture(
        steps,
        nextIndex,
        "pop",
        "empty",
        this.items,
        -1,
        [],
        "Cannot pop from an empty stack.",
        "Stack underflow! The stack is empty, so there is no element to remove. This is an error condition."
      )
      return steps
    }

    const topValue = this.items[this.items.length - 1]

    this.capture(
      steps,
      nextIndex,
      "pop",
      "pop",
      this.items,
      this.items.length - 1,
      [this.items.length - 1],
      `Popping ${topValue} from the top of the stack.`,
      `The top element ${topValue} will be removed. In LIFO, the last element added is the first to be removed.`
    )

    this.items.pop()

    this.capture(
      steps,
      nextIndex,
      "pop",
      "pop",
      this.items,
      this.items.length - 1,
      [],
      `${topValue} removed. New top is at index ${this.items.length - 1}.`,
      `Pop operation complete. ${topValue} has been removed. Stack size is now ${this.items.length}.`
    )

    if (this.items.length === 0) {
      this.capture(
        steps,
        nextIndex,
        "pop",
        "empty",
        this.items,
        -1,
        [],
        "Stack is now empty.",
        "All elements have been popped. The stack is empty."
      )
    }

    return steps
  }

  peek(): StackStep[] {
    const steps: StackStep[] = []
    const nextIndex = { value: 0 }

    if (this.items.length === 0) {
      this.capture(
        steps,
        nextIndex,
        "peek",
        "empty",
        this.items,
        -1,
        [],
        "Cannot peek an empty stack.",
        "The stack is empty, so there is no top element to view."
      )
      return steps
    }

    const topValue = this.items[this.items.length - 1]

    this.capture(
      steps,
      nextIndex,
      "peek",
      "peek",
      this.items,
      this.items.length - 1,
      [this.items.length - 1],
      `Peeking at top element: ${topValue}.`,
      `Peek operation returns the top element (${topValue}) without removing it. Stack remains unchanged.`
    )

    return steps
  }
}
