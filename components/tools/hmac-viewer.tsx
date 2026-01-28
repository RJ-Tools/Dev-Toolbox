"use client"

import * as React from "react"
import { Copy, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import CryptoJS from "crypto-js"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CodeTextarea } from "@/components/ui/code-textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type HmacAlgo = "SHA256" | "SHA512" | "SHA1" | "MD5"

export function HmacViewer() {
    const [input, setInput] = React.useState("")
    const [secret, setSecret] = React.useState("secret")
    const [output, setOutput] = React.useState("")
    const [algo, setAlgo] = React.useState<HmacAlgo>("SHA256")

    const handleHmac = React.useCallback(() => {
        if (!input || !secret) {
            setOutput("")
            return
        }

        try {
            let hashed: any;
            switch (algo) {
                case "SHA256": hashed = CryptoJS.HmacSHA256(input, secret); break;
                case "SHA512": hashed = CryptoJS.HmacSHA512(input, secret); break;
                case "SHA1": hashed = CryptoJS.HmacSHA1(input, secret); break;
                case "MD5": hashed = CryptoJS.HmacMD5(input, secret); break;
            }
            setOutput(hashed.toString(CryptoJS.enc.Hex))
        } catch (e) {
            setOutput("Error generating HMAC")
        }
    }, [input, secret, algo])

    React.useEffect(() => {
        handleHmac()
    }, [input, secret, algo, handleHmac])

    const handleCopy = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        toast.success("HMAC copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    HMAC Generator
                </h2>
                <div className="flex items-center gap-2">
                    <Select value={algo} onValueChange={(v) => setAlgo(v as HmacAlgo)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SHA256">HmacSHA256</SelectItem>
                            <SelectItem value="SHA512">HmacSHA512</SelectItem>
                            <SelectItem value="SHA1">HmacSHA1</SelectItem>
                            <SelectItem value="MD5">HmacMD5</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => { setInput(""); setSecret("") }}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Input Section */}
                <div className="flex flex-col gap-4 h-full">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="secret">Secret Key</Label>
                        <Input
                            id="secret"
                            placeholder="Enter secret key..."
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="font-mono"
                        />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                        <Label htmlFor="input">Message</Label>
                        <CodeTextarea
                            id="input"
                            placeholder="Type message to hash..."
                            className="h-full"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>

                {/* Output Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>HMAC Output (Hex)</Label>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCopy}
                            title="Copy HMAC"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative flex-1 h-full min-h-0">
                        <CodeTextarea
                            readOnly
                            className="h-full border rounded-md font-mono text-sm leading-6"
                            value={output}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
