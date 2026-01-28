"use client"

import * as React from "react"
import { Copy, ArrowRight, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function SlugGeneratorViewer() {
    const [input, setInput] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [separator, setSeparator] = React.useState("-")
    const [lowercase, setLowercase] = React.useState(true)
    const [trim, setTrim] = React.useState(true)

    React.useEffect(() => {
        let result = input

        if (lowercase) {
            result = result.toLowerCase()
        }

        if (trim) {
            result = result.trim()
        }

        // Replace invalid chars with separator
        result = result
            .replace(/[^a-zA-Z0-9\s-_]/g, "") // Remove bad chars
            .replace(/[\s_]+/g, separator)     // Replace spaces/underscores with separator

        // Remove trailing/leading separators if any
        if (result.startsWith(separator)) result = result.substring(separator.length)
        if (result.endsWith(separator)) result = result.substring(0, result.length - separator.length)

        setSlug(result)
    }, [input, separator, lowercase, trim])

    const copyToClipboard = () => {
        if (!slug) return
        navigator.clipboard.writeText(slug)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                        <Label>Input Text</Label>
                        <Input
                            placeholder="Enter text to slugify..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="text-lg"
                        />
                    </div>

                    <div className="flex justify-center py-2">
                        <ArrowRight className="text-muted-foreground w-6 h-6 rotate-90 md:rotate-0" />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Generated Slug</Label>
                            {slug && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={copyToClipboard}
                                    className="h-8 text-xs"
                                >
                                    <Copy className="mr-2 h-3.5 w-3.5" />
                                    Copy
                                </Button>
                            )}
                        </div>
                        <div className="relative">
                            <div className="min-h-[60px] p-4 bg-muted rounded-md font-mono break-all flex items-center">
                                {slug || <span className="text-muted-foreground italic">Result will appear here...</span>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-4">
                            <Label>Separator</Label>
                            <RadioGroup value={separator} onValueChange={setSeparator} className="flex gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="-" id="hyphen" />
                                    <Label htmlFor="hyphen">Hyphen (-)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="_" id="underscore" />
                                    <Label htmlFor="underscore">Underscore (_)</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="lowercase" className="cursor-pointer">Force Lowercase</Label>
                                <Switch id="lowercase" checked={lowercase} onCheckedChange={setLowercase} />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="trim" className="cursor-pointer">Trim Whitespace</Label>
                                <Switch id="trim" checked={trim} onCheckedChange={setTrim} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
