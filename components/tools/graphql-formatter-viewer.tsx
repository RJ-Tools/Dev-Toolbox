"use client"

import * as React from "react"
import { parse, print } from "graphql"
import { Copy, Eraser, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function GraphqlFormatterViewer() {
    const [query, setQuery] = React.useState(`# Welcome to GraphQL Formatter
query GetUser($id: ID!) {
  user(id: $id) { name email posts { title } }
}`)
    const [formatted, setFormatted] = React.useState("")
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        if (!query.trim()) {
            setFormatted("")
            setError("")
            return
        }

        try {
            const ast = parse(query)
            const pretty = print(ast)
            setFormatted(pretty)
            setError("")
        } catch (err: any) {
            // GraphQL errors are usually detailed
            setError(err.message)
            // Keep the old formatted content or clear it? 
            // Clearing it might be better to indicate broken state
            // But usually we just show error
        }
    }, [query])

    const copyToClipboard = () => {
        if (!formatted) return
        navigator.clipboard.writeText(formatted)
        toast.success("Formatted query copied")
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Input Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>GraphQL Query / Mutation</Label>
                            <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`query { \n  viewer { \n    login \n  } \n}`}
                            className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
                        />
                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md whitespace-pre-wrap font-mono max-h-32 overflow-y-auto">
                                {error}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>Formatted Output</Label>
                            <Button variant="ghost" size="sm" onClick={copyToClipboard} disabled={!formatted || !!error}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <Textarea
                            value={formatted || (error ? "" : query)} // Show query as fallback or formatted
                            readOnly
                            className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed bg-muted/30"
                            placeholder="Formatted query will appear here..."
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
