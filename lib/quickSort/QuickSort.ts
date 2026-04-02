import { type QuickSortPhase, type QuickSortStep } from "@/lib/quickSort/types"

export class QuickSort {
  generateSteps(inputArray: number[]): QuickSortStep[] {
    const arr = [...inputArray]
    const steps: QuickSortStep[] = []
    let nextIndex = 0
    const sortedIndices = new Set<number>()

    const capture = (
      phase: QuickSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      pivotIndex: number | null,
      message: string,
      aiExplanation: string
    ) => {
      steps.push({
        index: nextIndex++,
        phase,
        array: [...array],
        highlightIndices,
        sortedIndices: new Set(sortedIndices),
        pivotIndex,
        message,
        aiExplanation,
      })
    }

    capture(
      "start",
      arr,
      [],
      new Set(),
      null,
      `Starting quick sort on array of ${arr.length} elements.`,
      "Quick sort picks a pivot element and partitions the array around it, then recursively sorts each half."
    )

    this.quickSort(arr, 0, arr.length - 1, sortedIndices, capture)

    for (let i = 0; i < arr.length; i++) {
      sortedIndices.add(i)
    }

    capture(
      "complete",
      arr,
      [],
      sortedIndices,
      null,
      `Array is fully sorted: [${arr.join(", ")}].`,
      "Quick sort complete. All elements are now in ascending order."
    )

    return steps
  }

  private quickSort(
    arr: number[],
    low: number,
    high: number,
    sortedIndices: Set<number>,
    capture: (
      phase: QuickSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      pivotIndex: number | null,
      message: string,
      aiExplanation: string
    ) => void
  ): void {
    if (low >= high) {
      if (low === high) sortedIndices.add(low)
      return
    }

    const pivotIndex = this.partition(arr, low, high, sortedIndices, capture)
    sortedIndices.add(pivotIndex)

    this.quickSort(arr, low, pivotIndex - 1, sortedIndices, capture)
    this.quickSort(arr, pivotIndex + 1, high, sortedIndices, capture)
  }

  private partition(
    arr: number[],
    low: number,
    high: number,
    sortedIndices: Set<number>,
    capture: (
      phase: QuickSortPhase,
      array: number[],
      highlightIndices: number[],
      sortedIndices: Set<number>,
      pivotIndex: number | null,
      message: string,
      aiExplanation: string
    ) => void
  ): number {
    const pivot = arr[high]

    capture(
      "choose-pivot",
      arr,
      [high],
      new Set(sortedIndices),
      high,
      `Choose pivot: ${pivot} at index ${high} (last element).`,
      "The last element is used as the pivot for partitioning."
    )

    let i = low - 1

    for (let j = low; j < high; j++) {
      capture(
        "partition",
        arr,
        [j, high],
        new Set(sortedIndices),
        high,
        `Compare ${arr[j]} with pivot ${pivot}.`,
        `If arr[${j}] (${arr[j]}) <= pivot (${pivot}), it belongs in the left partition.`
      )

      if (arr[j] <= pivot) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          capture(
            "swap",
            arr,
            [i, j],
            new Set(sortedIndices),
            high,
            `Swap ${arr[j]} at index ${j} with ${arr[i]} at index ${i}.`,
            `Element ${arr[i]} is <= pivot, so it moves to the left partition at index ${i}.`
          )
        }
      }
    }

    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    const finalPivotIndex = i + 1

    capture(
      "pivot-placed",
      arr,
      [finalPivotIndex],
      new Set(sortedIndices),
      finalPivotIndex,
      `Pivot ${pivot} placed at final position ${finalPivotIndex}.`,
      `Pivot ${pivot} is now at its correct sorted position. Left side has smaller elements, right side has larger.`
    )

    return finalPivotIndex
  }
}
