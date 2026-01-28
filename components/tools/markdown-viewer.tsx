"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Copy, FileCode, Split, RotateCcw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CodeTextarea } from "@/components/ui/code-textarea"
import { cn } from "@/lib/utils"

const defaultMarkdown = `# Markdown Previewer

Welcome to the **Markdown Previewer**!

## Features
- Real-time preview
- GitHub Flavored Markdown support
- Syntax highlighting ready

## Code Example
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

## Tables
| Feature | Support |
| :--- | :---: |
| Tables | ✅ |
| Task Lists | ✅ |
| Auto-linking | ✅ |

> Enjoy writing documentation!
`

export function MarkdownViewer() {
    const [input, setInput] = React.useState(defaultMarkdown)

    const handleCopy = () => {
        if (!input) return
        navigator.clipboard.writeText(input)
        toast.success("Markdown copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    Markdown Previewer
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setInput("")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Editor Section */}
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="input">Markdown Editor</Label>
                    <CodeTextarea
                        id="input"
                        placeholder="Type markdown here..."
                        className="h-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Preview Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>Preview</Label>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCopy}
                            title="Copy Markdown"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative flex-1 h-full min-h-0 border rounded-md p-6 overflow-auto bg-background/50">
                        <article className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {input}
                            </ReactMarkdown>
                        </article>
                    </div>
                </div>
            </div>
        </div>
    )
}
