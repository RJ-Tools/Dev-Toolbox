"use client"

import * as React from "react"
import { Copy, ArrowRight, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CurlToFetchViewer() {
    const [curl, setCurl] = React.useState(`curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer token" \\
  -d '{"name": "John Doe", "role": "admin"}'`)
    const [jsCode, setJsCode] = React.useState("")

    React.useEffect(() => {
        if (!curl.trim()) {
            setJsCode("")
            return
        }

        try {
            const result = parseCurl(curl)
            setJsCode(generateFetch(result))
        } catch (e) {
            setJsCode("// Error parsing cURL command\n// Please ensure format is correct")
        }
    }, [curl])

    const parseCurl = (cmd: string) => {
        // Very basic parser - meant for standard copy-paste from Chrome/Postman
        // 1. Clean up newlines and backslashes
        const cleanCmd = cmd.replace(/\\\n/g, " ").replace(/\n/g, " ").trim()

        let url = ""
        let method = "GET"
        const headers: Record<string, string> = {}
        let body: string | null = null

        // Safe extraction helpers with quotes handling support
        // This is a simplified regex approach

        // Extract URL - usually the last arg or just an arg that isn't a flag
        // We'll look for http/https, but might miss relative URLs (which curl supports but less common in this context)
        const urlMatch = cleanCmd.match(/["'](https?:\/\/[^"']+)["']/) || cleanCmd.match(/(https?:\/\/[^\s]+)/)
        if (urlMatch) url = urlMatch[1]

        // Extract Method
        const methodMatch = cleanCmd.match(/-X\s+([A-Z]+)/i) || cleanCmd.match(/--request\s+([A-Z]+)/i)
        if (methodMatch) method = methodMatch[1].toUpperCase()

        // Extract Headers
        const headerRegex = /-H\s+["']([^"']+)["']|--header\s+["']([^"']+)["']/g
        let match
        while ((match = headerRegex.exec(cleanCmd)) !== null) {
            const header = match[1] || match[2]
            const splitIndex = header.indexOf(":")
            if (splitIndex > -1) {
                headers[header.substring(0, splitIndex).trim()] = header.substring(splitIndex + 1).trim()
            }
        }

        // Extract Data
        const dataMatch = cleanCmd.match(/-d\s+(['"])(.*?)\1|--data\s+(['"])(.*?)\3|--data-raw\s+(['"])(.*?)\5/)
        if (dataMatch) {
            // Groups: 2, 4, 6 depending on flag match
            body = dataMatch[2] || dataMatch[4] || dataMatch[6]
            // Default to POST if data is present and method is GET (curl default behavior)
            if (method === "GET") method = "POST"
        }

        return { url, method, headers, body }
    }

    const generateFetch = ({ url, method, headers, body }: any) => {
        if (!url) return "// Could not find URL in cURL command"

        let code = `fetch("${url}", {\n`
        code += `  method: "${method}",\n`

        if (Object.keys(headers).length > 0) {
            code += `  headers: {\n`
            Object.entries(headers).forEach(([k, v]) => {
                code += `    "${k}": "${v}",\n`
            })
            code += `  },\n`
        }

        if (body) {
            // Try to beautify if JSON
            try {
                const jsonBody = JSON.parse(body)
                code += `  body: JSON.stringify(${JSON.stringify(jsonBody, null, 4).replace(/\n/g, "\n    ")})\n`
            } catch {
                code += `  body: ${JSON.stringify(body)}\n`
            }
        }

        code += `})`
        code += `\n  .then(response => response.json())`
        code += `\n  .then(data => console.log(data))`
        code += `\n  .catch(error => console.error(error));`

        return code
    }

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                {/* Input Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <Label>cURL Command</Label>
                        <Textarea
                            value={curl}
                            onChange={(e) => setCurl(e.target.value)}
                            placeholder="curl -X POST https://api.example.com..."
                            className="flex-1 font-mono text-sm resize-none p-4 leading-relaxed"
                        />
                    </CardContent>
                </Card>

                {/* Output Section */}
                <Card className="flex flex-col">
                    <CardContent className="p-6 flex flex-col gap-4 flex-1 h-full">
                        <div className="flex items-center justify-between">
                            <Label>JavaScript (Fetch)</Label>
                            <Button variant="ghost" size="sm" onClick={() => {
                                navigator.clipboard.writeText(jsCode)
                                toast.success("Code copied")
                            }}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Code
                            </Button>
                        </div>
                        <div className="flex-1 relative border rounded-md bg-muted/30">
                            <Textarea
                                value={jsCode}
                                readOnly
                                className="absolute inset-0 w-full h-full font-mono text-sm p-4 resize-none border-0 bg-transparent"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
