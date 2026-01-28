"use client"

import * as React from "react"
import { JSONPath } from "jsonpath-plus"
import { AlertCircle, Copy, Eraser, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"

export function JsonPathTesterViewer() {
    const [json, setJson] = React.useState(`{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 19.95
    }
  }
}`)
    const [path, setPath] = React.useState("$.store.book[*].author")
    const [result, setResult] = React.useState<any>(null)
    const [error, setError] = React.useState("")

    React.useEffect(() => {
        if (!json.trim() || !path.trim()) {
            setResult(null)
            setError("")
            return
        }

        try {
            const parsedJson = JSON.parse(json)
            try {
                const queryResult = JSONPath({ path: path, json: parsedJson })
                setResult(queryResult)
                setError("")
            } catch (err: any) {
                setError(err.message)
                setResult(null)
            }
        } catch (err: any) {
            setError("Invalid JSON: " + err.message)
            setResult(null)
        }
    }, [json, path])

    const copyResult = () => {
        if (!result) return
        navigator.clipboard.writeText(JSON.stringify(result, null, 2))
        toast.success("Result copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <Card className="flex-none">
                <CardContent className="p-6">
                    <div className="space-y-2">
                        <Label>JSONPath Expression</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={path}
                                onChange={(e) => setPath(e.target.value)}
                                className="pl-9 font-mono bg-muted/50"
                                placeholder="$.store.book[*]"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Start with <code>$</code> for root object. Example: <code>$..author</code>
                        </p>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>Input JSON</Label>
                            <Button variant="ghost" size="sm" onClick={() => setJson("")}>
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            value={json}
                            onChange={(e) => setJson(e.target.value)}
                            className="flex-1 font-mono text-sm resize-none p-4"
                            placeholder="Paste your JSON here..."
                        />
                    </CardContent>
                </Card>

                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>Evaluation Result</Label>
                            <Button variant="ghost" size="sm" onClick={copyResult} disabled={!result}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                            </Button>
                        </div>

                        {error ? (
                            <div className="flex-1 flex items-center justify-center text-destructive text-center p-4">
                                <span className="flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </span>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={result !== null ? JSON.stringify(result, null, 2) : ""}
                                className="flex-1 font-mono text-sm resize-none p-4 bg-muted/30"
                                placeholder="Result will appear here..."
                            />
                        )}

                        <div className="text-sm text-muted-foreground">
                            <strong>{result ? result.length : 0}</strong> matches found
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
