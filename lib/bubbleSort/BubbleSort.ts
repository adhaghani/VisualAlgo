import {
  type BubbleSortPhase,
  type BubbleSortStep,
} from "@/lib/bubbleSort/types"

export class BubbleSort {
  generateSteps(inputArray: number[]): BubbleSortStep[] {
    const arr = [...inputArray]
    const steps: BubbleSortStep[] = []
    let nextIndex = 0
    const sortedIndices = new Set<number>()
    const n = arr.length

    const capture = (
      phase: BubbleSortPhase,
      array: number[],
      highlightIndices: number[],
      message: string,
      aiExplanation: string
    ) => {
      steps.push({
        index: nextIndex++,
        phase,
        array: [...array],
        highlightIndices,
        sortedIndices: new Set(sortedIndices),
        message,
        aiExplanation,
      })
    }

    capture(
      "start",
      arr,
      [],
      `Starting bubble sort on array of ${n} elements.`,
      "Bubble sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order."
    )

    for (let i = 0; i < n - 1; i++) {
      let swapped = false

      for (let j = 0; j < n - i - 1; j++) {
        capture(
          "compare",
          arr,
          [j, j + 1],
          `Comparing elements at index ${j} (${arr[j]}) and ${j + 1} (${arr[j + 1]}).`,
          `We compare adjacent elements. If arr[${j}] > arr[${j + 1}], they need to be swapped.`
        )

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          swapped = true

          capture(
            "swap",
            arr,
            [j, j + 1],
            `Swapped ${arr[j + 1]} and ${arr[j]} at indices ${j} and ${j + 1}.`,
            `Since ${arr[j + 1]} < ${arr[j]}, we swap them to move the larger element toward the end.`
          )
        } else {
          capture(
            "no-swap",
            arr,
            [j, j + 1],
            `No swap needed: ${arr[j]} <= ${arr[j + 1]}.`,
            `Elements are already in correct order. No swap required.`
          )
        }
      }

      sortedIndices.add(n - 1 - i)
      capture(
        "sorted",
        arr,
        [n - 1 - i],
        `Element ${arr[n - 1 - i]} is now in its final sorted position.`,
        `After pass ${i + 1}, the largest unsorted element has bubbled to its correct position.`
      )

      if (!swapped) {
        break
      }
    }

    sortedIndices.add(0)
    capture(
      "complete",
      arr,
      [],
      `Array is fully sorted: [${arr.join(", ")}].`,
      "Bubble sort complete. All elements are now in ascending order."
    )

    return steps
  }
}
