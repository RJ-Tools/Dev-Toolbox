"use client"

import * as React from "react"
import { v1, v3, v4, v5 } from "uuid"
import { Copy, RefreshCw, AlertCircle, Check } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

export function UuidGeneratorViewer() {
    const [version, setVersion] = React.useState<"1" | "3" | "4" | "5">("4")
    const [quantity, setQuantity] = React.useState([1])
    const [namespace, setNamespace] = React.useState("")
    const [name, setName] = React.useState("")
    const [uppercase, setUppercase] = React.useState(false)
    const [hyphens, setHyphens] = React.useState(true) // Default true: standard representation
    const [generated, setGenerated] = React.useState("")
    const [error, setError] = React.useState("")

    const generate = React.useCallback(() => {
        setError("")
        const count = quantity[0]
        const uuids: string[] = []

        try {
            for (let i = 0; i < count; i++) {
                let uuid = ""
                switch (version) {
                    case "1":
                        uuid = v1()
                        break
                    case "3":
                        if (!namespace || !name) {
                            // Don't error immediately on empty input for v3/v5, just wait
                            if (i === 0) setError("Namespace and Name are required for v3")
                            return
                        }
                        // Validate namespace UUID
                        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(namespace)) {
                            if (i === 0) setError("Invalid Namespace UUID")
                            return
                        }
                        uuid = v3(name, namespace)
                        break
                    case "4":
                        uuid = v4()
                        break
                    case "5":
                        if (!namespace || !name) {
                            if (i === 0) setError("Namespace and Name are required for v5")
                            return
                        }
                        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(namespace)) {
                            if (i === 0) setError("Invalid Namespace UUID")
                            return
                        }
                        uuid = v5(name, namespace)
                        break
                }

                if (uppercase) uuid = uuid.toUpperCase()
                if (!hyphens) uuid = uuid.replace(/-/g, "")
                uuids.push(uuid)
            }
            setGenerated(uuids.join("\n"))
        } catch (err: any) {
            setError(err.message)
        }
    }, [version, quantity, namespace, name, uppercase, hyphens])

    React.useEffect(() => {
        generate()
    }, [generate])

    const copyToClipboard = () => {
        if (!generated) return
        navigator.clipboard.writeText(generated)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardContent className="p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>UUID Version</Label>
                                <Select value={version} onValueChange={(v: any) => setVersion(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Version 1 (Time-based)</SelectItem>
                                        <SelectItem value="3">Version 3 (Namespace MD5)</SelectItem>
                                        <SelectItem value="4">Version 4 (Random)</SelectItem>
                                        <SelectItem value="5">Version 5 (Namespace SHA-1)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={100}
                                        value={quantity[0]}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            if (!isNaN(val)) {
                                                setQuantity([Math.min(Math.max(val, 1), 100)])
                                            }
                                        }}
                                        className="w-20 h-8 font-mono text-center"
                                    />
                                </div>
                                <Slider
                                    value={quantity}
                                    onValueChange={setQuantity}
                                    min={1}
                                    max={100}
                                    step={1}
                                />
                            </div>

                            {(version === "3" || version === "5") && (
                                <div className="space-y-4 pt-2 border-t">
                                    <div className="space-y-2">
                                        <Label>Namespace UUID</Label>
                                        <Input
                                            placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                                            value={namespace}
                                            onChange={(e) => setNamespace(e.target.value)}
                                        />
                                        <p className="text-xs text-muted-foreground">Pre-defined UUID namespace</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            placeholder="Unique name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-4 mt-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="uppercase" className="cursor-pointer">Uppercase</Label>
                                    <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="hyphens" className="cursor-pointer">Hyphens</Label>
                                    <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 flex flex-col h-full">
                            <Label>Generated UUIDs</Label>
                            <div className="relative flex-1 min-h-[300px]">
                                <Textarea
                                    className="font-mono h-full resize-none p-4 text-sm"
                                    value={generated}
                                    readOnly
                                />
                                {generated && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="absolute top-2 right-2 h-8 w-8 bg-background/80 backdrop-blur-sm"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            {error && (
                                <div className="text-destructive text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}
                            <div className="flex justify-end">
                                <Button onClick={generate} className="w-full md:w-auto">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Regenerate
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
