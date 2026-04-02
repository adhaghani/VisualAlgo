import {
  type ArrayListOperation,
  type ArrayListPhase,
  type ArrayListStep,
} from "@/lib/arrayList/types"

export class ArrayList {
  private array: number[]
  private capacity: number

  constructor() {
    this.array = []
    this.capacity = 4
  }

  private capture(
    index: number,
    operation: ArrayListOperation,
    phase: ArrayListPhase,
    array: number[],
    highlightIndices: number[],
    capacity: number,
    message: string,
    aiExplanation: string
  ): ArrayListStep {
    return {
      index,
      operation,
      phase,
      array: [...array],
      highlightIndices,
      capacity,
      message,
      aiExplanation,
    }
  }

  private resizeIfNeeded(): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    if (this.array.length >= this.capacity) {
      const oldCapacity = this.capacity
      this.capacity *= 2
      steps.push(
        this.capture(
          steps.length,
          "push",
          "push",
          this.array,
          [],
          this.capacity,
          `Array is full! Resizing capacity from ${oldCapacity} to ${this.capacity}.`,
          `Dynamic arrays double their capacity when full to maintain amortized O(1) insertion time.`
        )
      )
    }
    return steps
  }

  push(value: number): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    let nextIndex = 0

    const addStep = (
      phase: ArrayListPhase,
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push(
        this.capture(
          nextIndex++,
          "push",
          phase,
          this.array,
          highlightIndices,
          this.capacity,
          message,
          aiExplanation
        )
      )
    }

    addStep(
      "start",
      [],
      `Pushing ${value} to the end of the array. Current size: ${this.array.length}/${this.capacity}.`,
      `Push adds an element to the end of the array. If the array is full, it must resize first.`
    )

    const resizeSteps = this.resizeIfNeeded()
    steps.push(...resizeSteps.map((s) => ({ ...s, index: nextIndex++ })))

    this.array.push(value)
    const newIndex = this.array.length - 1

    addStep(
      "push",
      [newIndex],
      `Inserted ${value} at index ${newIndex}. Array: [${this.array.join(", ")}]. Size: ${this.array.length}/${this.capacity}.`,
      `The value ${value} is now at the last position. Push is O(1) amortized because resizing is rare.`
    )

    addStep(
      "complete",
      [],
      `Push complete. Array: [${this.array.join(", ")}].`,
      `Push operation finished successfully. The element was added to the end of the dynamic array.`
    )

    return steps
  }

  pop(): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    let nextIndex = 0

    const addStep = (
      phase: ArrayListPhase,
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push(
        this.capture(
          nextIndex++,
          "pop",
          phase,
          this.array,
          highlightIndices,
          this.capacity,
          message,
          aiExplanation
        )
      )
    }

    addStep(
      "start",
      [],
      `Popping from the array. Current size: ${this.array.length}/${this.capacity}.`,
      `Pop removes and returns the last element of the array. This is an O(1) operation.`
    )

    if (this.array.length === 0) {
      addStep(
        "out-of-bounds",
        [],
        `Cannot pop from an empty array.`,
        `The array has no elements to remove. Pop on an empty array would cause an underflow error.`
      )
      addStep(
        "complete",
        [],
        `Pop aborted. Array remains empty.`,
        `Operation cancelled to prevent an error. Always check if the array is non-empty before popping.`
      )
      return steps
    }

    const lastIndex = this.array.length - 1
    const value = this.array[lastIndex]

    addStep(
      "pop",
      [lastIndex],
      `Removing element ${value} at index ${lastIndex}.`,
      `The last element (${value}) is about to be removed. This shrinks the array by one.`
    )

    this.array.pop()

    addStep(
      "complete",
      [],
      `Popped ${value}. Array: [${this.array.join(", ")}]. Size: ${this.array.length}/${this.capacity}.`,
      `Pop completed. The array size decreased by one. The removed value was ${value}.`
    )

    return steps
  }

  insertAt(index: number, value: number): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    let nextIndex = 0

    const addStep = (
      phase: ArrayListPhase,
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push(
        this.capture(
          nextIndex++,
          "insert",
          phase,
          this.array,
          highlightIndices,
          this.capacity,
          message,
          aiExplanation
        )
      )
    }

    addStep(
      "start",
      [],
      `Inserting ${value} at index ${index}. Current size: ${this.array.length}/${this.capacity}.`,
      `Insert at places a new element at a specific position, shifting all subsequent elements to the right. This is O(n) in the worst case.`
    )

    if (index < 0 || index > this.array.length) {
      addStep(
        "out-of-bounds",
        [],
        `Index ${index} is out of bounds. Valid range: 0 to ${this.array.length}.`,
        `Insert index must be between 0 and the array length (inclusive). Index ${index} is invalid.`
      )
      addStep(
        "complete",
        [],
        `Insert at ${index} aborted. Array unchanged: [${this.array.join(", ")}].`,
        `Operation cancelled due to invalid index. No elements were shifted.`
      )
      return steps
    }

    const resizeSteps = this.resizeIfNeeded()
    steps.push(...resizeSteps.map((s) => ({ ...s, index: nextIndex++ })))

    addStep(
      "insert-at",
      [index],
      `Inserting ${value} at index ${index}. Elements from index ${index} onward will shift right.`,
      `All elements at index ${index} and beyond need to move one position to the right to make room for the new value.`
    )

    this.array.splice(index, 0, value)

    const shiftRange = Array.from(
      { length: this.array.length - index },
      (_, i) => index + i
    )

    addStep(
      "insert-at",
      shiftRange,
      `Inserted ${value} at index ${index}. Shifted ${shiftRange.length - 1} element(s) right. Array: [${this.array.join(", ")}].`,
      `The splice operation inserted ${value} at position ${index}, shifting all subsequent elements. This took O(n) time.`
    )

    addStep(
      "complete",
      [],
      `Insert at ${index} complete. Array: [${this.array.join(", ")}]. Size: ${this.array.length}/${this.capacity}.`,
      `Insert operation finished. The array grew by one element and all elements after the insertion point were shifted right.`
    )

    return steps
  }

  removeAt(index: number): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    let nextIndex = 0

    const addStep = (
      phase: ArrayListPhase,
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push(
        this.capture(
          nextIndex++,
          "remove",
          phase,
          this.array,
          highlightIndices,
          this.capacity,
          message,
          aiExplanation
        )
      )
    }

    addStep(
      "start",
      [],
      `Removing element at index ${index}. Current size: ${this.array.length}/${this.capacity}.`,
      `Remove at deletes the element at a specific position, shifting all subsequent elements to the left. This is O(n).`
    )

    if (index < 0 || index >= this.array.length) {
      addStep(
        "out-of-bounds",
        [],
        `Index ${index} is out of bounds. Valid range: 0 to ${this.array.length - 1}.`,
        `Remove index must be between 0 and length-1. Index ${index} is outside the valid range.`
      )
      addStep(
        "complete",
        [],
        `Remove at ${index} aborted. Array unchanged: [${this.array.join(", ")}].`,
        `Operation cancelled due to invalid index. No elements were shifted.`
      )
      return steps
    }

    const value = this.array[index]

    addStep(
      "remove-at",
      [index],
      `Removing ${value} at index ${index}. Elements after index ${index} will shift left.`,
      `The element at position ${index} (${value}) will be removed. All elements after it must shift left to fill the gap.`
    )

    this.array.splice(index, 1)

    if (this.array.length > 0 && index < this.array.length) {
      const shiftRange = Array.from(
        { length: this.array.length - index },
        (_, i) => index + i
      )
      addStep(
        "remove-at",
        shiftRange,
        `Removed ${value}. Shifted ${shiftRange.length} element(s) left. Array: [${this.array.join(", ")}].`,
        `After removing the element, all elements from position ${index} onward shifted left by one position.`
      )
    }

    addStep(
      "complete",
      [],
      `Remove at ${index} complete. Removed ${value}. Array: [${this.array.join(", ")}]. Size: ${this.array.length}/${this.capacity}.`,
      `Remove operation finished. The array shrank by one element and all elements after the removal point shifted left.`
    )

    return steps
  }

  peek(index: number): ArrayListStep[] {
    const steps: ArrayListStep[] = []
    let nextIndex = 0

    const addStep = (
      phase: ArrayListPhase,
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push(
        this.capture(
          nextIndex++,
          "peek",
          phase,
          this.array,
          highlightIndices,
          this.capacity,
          message,
          aiExplanation
        )
      )
    }

    addStep(
      "start",
      [],
      `Peeking at index ${index}. Current size: ${this.array.length}/${this.capacity}.`,
      `Peek retrieves the value at a specific index without modifying the array. This is an O(1) random access operation.`
    )

    if (index < 0 || index >= this.array.length) {
      addStep(
        "out-of-bounds",
        [],
        `Index ${index} is out of bounds. Valid range: 0 to ${this.array.length - 1}.`,
        `Peek index must be within the array bounds. Index ${index} does not exist in the current array.`
      )
      addStep(
        "complete",
        [],
        `Peek at ${index} aborted. Array: [${this.array.join(", ")}].`,
        `Operation cancelled due to invalid index. No element was accessed.`
      )
      return steps
    }

    const value = this.array[index]

    addStep(
      "peek",
      [index],
      `Element at index ${index} is ${value}.`,
      `Direct array access retrieves the value at position ${index} in O(1) time. No shifting or searching needed.`
    )

    addStep(
      "complete",
      [],
      `Peek complete. Array unchanged: [${this.array.join(", ")}].`,
      `Peek operation finished. The array was read but not modified. This is the advantage of array-based storage.`
    )

    return steps
  }

  getCurrentArray(): number[] {
    return [...this.array]
  }

  getCapacity(): number {
    return this.capacity
  }

  clear(): void {
    this.array = []
    this.capacity = 4
  }
}
