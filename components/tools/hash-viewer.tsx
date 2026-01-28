"use client"

import * as React from "react"
import { Copy, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import CryptoJS from "crypto-js"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CodeTextarea } from "@/components/ui/code-textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type HashAlgo = "MD5" | "SHA1" | "SHA256" | "SHA512" | "RIPEMD160"

export function HashViewer() {
    const [input, setInput] = React.useState("")
    const [output, setOutput] = React.useState("")
    const [algo, setAlgo] = React.useState<HashAlgo>("SHA256")

    const handleHash = React.useCallback(() => {
        if (!input) {
            setOutput("")
            return
        }

        try {
            let hashed: any;
            switch (algo) {
                case "MD5": hashed = CryptoJS.MD5(input); break;
                case "SHA1": hashed = CryptoJS.SHA1(input); break;
                case "SHA256": hashed = CryptoJS.SHA256(input); break;
                case "SHA512": hashed = CryptoJS.SHA512(input); break;
                case "RIPEMD160": hashed = CryptoJS.RIPEMD160(input); break;
            }
            setOutput(hashed.toString(CryptoJS.enc.Hex))
        } catch (e) {
            setOutput("Error hashing input")
        }
    }, [input, algo])

    React.useEffect(() => {
        handleHash()
    }, [input, algo, handleHash])

    const handleCopy = () => {
        if (!output) return
        navigator.clipboard.writeText(output)
        toast.success("Hash copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Hash Generator
                </h2>
                <div className="flex items-center gap-2">
                    <Select value={algo} onValueChange={(v) => setAlgo(v as HashAlgo)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="SHA256">SHA-256</SelectItem>
                            <SelectItem value="SHA512">SHA-512</SelectItem>
                            <SelectItem value="SHA1">SHA-1</SelectItem>
                            <SelectItem value="MD5">MD5</SelectItem>
                            <SelectItem value="RIPEMD160">RIPEMD-160</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setInput("")}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                </div>
            </div>

            <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                {/* Input Section */}
                <div className="flex flex-col gap-2 h-full">
                    <Label htmlFor="input">Input Text</Label>
                    <CodeTextarea
                        id="input"
                        placeholder="Type text to hash..."
                        className="h-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Output Section */}
                <div className="flex flex-col gap-2 h-full">
                    <div className="flex items-center justify-between">
                        <Label>Hash Output (Hex)</Label>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCopy}
                            title="Copy Hash"
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
