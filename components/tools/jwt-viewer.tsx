"use client"

import * as React from "react"
import { Copy, RotateCcw, Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CodeTextarea } from "@/components/ui/code-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function JwtViewer() {
    const [token, setToken] = React.useState("")
    const [header, setHeader] = React.useState("")
    const [payload, setPayload] = React.useState("")
    const [signature, setSignature] = React.useState("")
    const [isValid, setIsValid] = React.useState<boolean | null>(null)

    const decodeJwt = React.useCallback((input: string) => {
        if (!input) {
            setHeader("")
            setPayload("")
            setSignature("")
            setIsValid(null)
            return
        }

        const parts = input.split(".")
        if (parts.length !== 3) {
            setIsValid(false)
            // Still try to decode what we can? No, strict 3 parts for JWT.
            // Actually, some unassigned ones might have 2, but standard is 3.
            return
        }

        try {
            const decodePart = (part: string) => {
                const base64 = part.replace(/-/g, "+").replace(/_/g, "/")
                const json = decodeURIComponent(
                    atob(base64).split("").map(function (c) {
                        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                    }).join("")
                )
                return JSON.stringify(JSON.parse(json), null, 2)
            }

            const decodedHeader = decodePart(parts[0])
            const decodedPayload = decodePart(parts[1])

            setHeader(decodedHeader)
            setPayload(decodedPayload)
            setSignature(parts[2])
            setIsValid(true)
        } catch (e) {
            setIsValid(false)
        }
    }, [])

    React.useEffect(() => {
        decodeJwt(token)
    }, [token, decodeJwt])

    const handleCopy = (text: string, label: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        toast.success(`Copied ${label} to clipboard`)
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[600px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    JWT Decoder
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setToken("")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Input Section */}
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="token" className="flex items-center gap-2">
                        Encoded Token
                        {isValid === true && <span className="text-xs text-green-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Valid Structure</span>}
                        {isValid === false && <span className="text-xs text-red-500 flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Invalid Token</span>}
                    </Label>
                    <CodeTextarea
                        id="token"
                        placeholder="Paste JWT here (header.payload.signature)..."
                        className="h-full"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>

                {/* Output Section */}
                <div className="flex flex-col gap-2 h-full min-h-0">
                    <Tabs defaultValue="payload" className="h-full flex flex-col">
                        <TabsList className="w-full justify-start">
                            <TabsTrigger value="payload">Payload</TabsTrigger>
                            <TabsTrigger value="header">Header</TabsTrigger>
                            <TabsTrigger value="signature">Signature</TabsTrigger>
                        </TabsList>

                        <div className="flex-1 relative min-h-0 mt-2">
                            <TabsContent value="payload" className="h-full m-0">
                                <CodeTextarea
                                    readOnly
                                    value={payload || (isValid === false ? "Invalid payload" : "")}
                                    className="h-full border rounded-md"
                                />
                                {payload && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-6 z-10"
                                        onClick={() => handleCopy(payload, "Payload")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                            </TabsContent>

                            <TabsContent value="header" className="h-full m-0">
                                <CodeTextarea
                                    readOnly
                                    value={header || (isValid === false ? "Invalid header" : "")}
                                    className="h-full border rounded-md"
                                />
                                {header && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-6 z-10"
                                        onClick={() => handleCopy(header, "Header")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                            </TabsContent>

                            <TabsContent value="signature" className="h-full m-0">
                                <CodeTextarea
                                    readOnly
                                    value={signature || (isValid === false ? "Invalid signature" : "")}
                                    className="h-full border rounded-md text-wrap break-all"
                                />
                                {signature && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-6 z-10"
                                        onClick={() => handleCopy(signature, "Signature")}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
