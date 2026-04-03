"use client"

import { Code2 } from "lucide-react"
import { useState } from "react"
import { CodeDialog } from "@/components/CodeDialog"
import { ALGORITHM_CODES } from "@/lib/code-content"

type ViewCodeButtonProps = {
  algorithmId: string
}

export function ViewCodeButton({ algorithmId }: ViewCodeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!ALGORITHM_CODES[algorithmId]) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="View source code"
      >
        <Code2 className="h-4 w-4" />
        <span>View Code</span>
      </button>

      <CodeDialog
        algorithmId={algorithmId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
