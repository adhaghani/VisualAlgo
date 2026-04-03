"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Check, Clipboard, X } from "lucide-react"
import { ALGORITHM_CODES, type Language } from "@/lib/code-content"

type CodeDialogProps = {
  algorithmId: string
  isOpen: boolean
  onClose: () => void
}

const LANGUAGES: { key: Language; label: string; icon: string }[] = [
  { key: "javascript", label: "JavaScript", icon: "JS" },
  { key: "python", label: "Python", icon: "PY" },
  { key: "java", label: "Java", icon: "JA" },
  { key: "cpp", label: "C++", icon: "C++" },
]

function highlightSyntax(code: string, language: Language): string {
  const escape = (str: string) =>
    str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  let escaped = escape(code)

  const protectedTokens: string[] = []
  const protect = (value: string) => {
    const idx = protectedTokens.push(value) - 1
    return `__TOKEN_${idx}__`
  }

  const keywords: Record<Language, string[]> = {
    javascript: [
      "const",
      "let",
      "var",
      "function",
      "return",
      "if",
      "else",
      "for",
      "while",
      "class",
      "new",
      "this",
      "import",
      "from",
      "export",
      "default",
      "type",
      "interface",
      "throw",
      "try",
      "catch",
      "typeof",
      "null",
      "undefined",
      "true",
      "false",
      "async",
      "await",
    ],
    python: [
      "def",
      "class",
      "return",
      "if",
      "elif",
      "else",
      "for",
      "while",
      "import",
      "from",
      "as",
      "self",
      "None",
      "True",
      "False",
      "raise",
      "try",
      "except",
      "with",
      "in",
      "not",
      "and",
      "or",
      "is",
    ],
    java: [
      "public",
      "private",
      "protected",
      "static",
      "void",
      "int",
      "boolean",
      "String",
      "class",
      "new",
      "return",
      "if",
      "else",
      "for",
      "while",
      "import",
      "throw",
      "throws",
      "try",
      "catch",
      "null",
      "true",
      "false",
      "this",
      "final",
      "extends",
      "implements",
      "interface",
      "List",
      "Map",
      "Set",
      "ArrayList",
      "HashMap",
      "LinkedList",
      "Queue",
      "Deque",
      "ArrayDeque",
      "HashSet",
      "AbstractMap",
      "SimpleEntry",
      "SuppressWarnings",
      "Override",
    ],
    cpp: [
      "void",
      "int",
      "bool",
      "string",
      "class",
      "struct",
      "public",
      "private",
      "const",
      "return",
      "if",
      "else",
      "for",
      "while",
      "new",
      "delete",
      "nullptr",
      "true",
      "false",
      "include",
      "using",
      "namespace",
      "std",
      "vector",
      "queue",
      "stack",
      "unordered_map",
      "unordered_set",
      "priority_queue",
      "pair",
      "greater",
      "numeric_limits",
      "runtime_error",
      "out_of_range",
      "template",
      "typename",
      "auto",
    ],
  }

  const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g
  escaped = escaped.replace(stringRegex, (m) =>
    protect(`<span class="text-[#98c379]">${m}</span>`)
  )

  const commentRegex = language === "python" ? /(#.*$)/gm : /(\/\/.*$)/gm
  escaped = escaped.replace(commentRegex, (m) =>
    protect(`<span class="text-[#5c6370] italic">${m}</span>`)
  )

  const kw = keywords[language]
  const kwRegex = new RegExp(`\\b(${kw.join("|")})\\b`, "g")
  escaped = escaped.replace(kwRegex, '<span class="text-[#c678dd]">$1</span>')

  const numberRegex = /\b(\d+\.?\d*)\b/g
  escaped = escaped.replace(
    numberRegex,
    '<span class="text-[#d19a66]">$1</span>'
  )

  escaped = escaped.replace(/__TOKEN_(\d+)__/g, (_, idx) => {
    return protectedTokens[Number(idx)] ?? ""
  })

  return escaped
}

function CodeBlock({ code, language }: { code: string; language: Language }) {
  const [copied, setCopied] = useState(false)
  const highlighted = highlightSyntax(code, language)
  const lines = code.split("\n")

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 z-10 flex items-center gap-1.5 rounded-md border bg-background/90 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-green-500" />
            <span className="text-green-500">Copied!</span>
          </>
        ) : (
          <>
            <Clipboard className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>

      <div className="overflow-x-auto rounded-lg bg-[#282c34] text-[#abb2bf]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-[#2c313c]">
                <td className="w-12 min-w-12 border-r border-[#3e4451] px-4 py-0.5 text-right font-mono text-xs leading-6 text-[#636d83] select-none">
                  {i + 1}
                </td>
                <td className="px-4 py-0.5 font-mono text-xs leading-6 whitespace-pre">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlighted.split("\n")[i] || "",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function CodeDialog({ algorithmId, isOpen, onClose }: CodeDialogProps) {
  const [activeTab, setActiveTab] = useState<Language>("javascript")
  const overlayRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const algorithm = ALGORITHM_CODES[algorithmId]

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === "Tab") {
        const overlay = overlayRef.current
        if (!overlay) return

        const focusable = Array.from(
          overlay.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    firstFocusableRef.current?.focus()

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
      previouslyFocused.current?.focus()
    }
  }, [isOpen, onClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen || !algorithm) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-dialog-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl animate-in flex-col rounded-xl border bg-background shadow-2xl duration-200 zoom-in-95 fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 id="code-dialog-title" className="text-lg font-semibold">
            {algorithm.name} — Source Code
          </h2>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex border-b px-5 pt-3"
          role="tablist"
          aria-label="Programming language"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              role="tab"
              aria-selected={activeTab === lang.key}
              aria-controls={`panel-${lang.key}`}
              id={`tab-${lang.key}`}
              onClick={() => setActiveTab(lang.key)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === lang.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {lang.label}
              {activeTab === lang.key && (
                <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {/* Code Panel */}
        <div className="flex-1 overflow-y-auto p-5">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.key}
              role="tabpanel"
              id={`panel-${lang.key}`}
              aria-labelledby={`tab-${lang.key}`}
              hidden={activeTab !== lang.key}
            >
              {activeTab === lang.key && (
                <CodeBlock
                  code={algorithm.code[lang.key]}
                  language={lang.key}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
