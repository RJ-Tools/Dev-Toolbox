"use client"

import * as React from "react"
import { Copy, RefreshCw, Eraser, ArrowDown } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HttpHeaderParserViewer() {
    const [input, setInput] = React.useState("Content-Type: application/json\nAuthorization: Bearer token123\nX-Custom-Header: value")
    const [parsed, setParsed] = React.useState<Record<string, string>>({})
    const [jsonOutput, setJsonOutput] = React.useState("")

    const parse = React.useCallback(() => {
        if (!input.trim()) {
            setParsed({})
            setJsonOutput("{}")
            return
        }

        const lines = input.split(/\n+/)
        const result: Record<string, string> = {}

        lines.forEach(line => {
            const index = line.indexOf(":")
            if (index > -1) {
                const key = line.substring(0, index).trim()
                const value = line.substring(index + 1).trim()
                if (key) result[key] = value
            }
        })

        setParsed(result)
        setJsonOutput(JSON.stringify(result, null, 2))
    }, [input])

    React.useEffect(() => {
        parse()
    }, [parse])

    const copyToClipboard = (text: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Input Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>Raw Headers</Label>
                            <Button variant="ghost" size="sm" onClick={() => setInput("")}>
                                <Eraser className="w-4 h-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={"Content-Type: application/json\nAnd so on..."}
                            className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
                        />
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <Tabs defaultValue="json" className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <TabsList>
                                    <TabsTrigger value="json">JSON</TabsTrigger>
                                    <TabsTrigger value="table">Table</TabsTrigger>
                                </TabsList>
                                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(jsonOutput)}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy JSON
                                </Button>
                            </div>

                            <TabsContent value="json" className="flex-1 mt-0">
                                <Textarea
                                    className="h-full w-full font-mono text-sm resize-none p-4"
                                    value={jsonOutput}
                                    readOnly
                                />
                            </TabsContent>

                            <TabsContent value="table" className="flex-1 mt-0 overflow-auto border rounded-md">
                                <div className="w-full">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b bg-muted/50">
                                                <th className="h-10 px-4 text-left font-medium text-muted-foreground w-1/3">Header Name</th>
                                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(parsed).length > 0 ? (
                                                Object.entries(parsed).map(([key, value], i) => (
                                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                                                        <td className="p-4 font-mono font-medium">{key}</td>
                                                        <td className="p-4 font-mono text-muted-foreground break-all">{value}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={2} className="p-8 text-center text-muted-foreground">
                                                        No headers parsed
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
