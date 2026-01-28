"use client"

import * as React from "react"
import { Copy, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import bcrypt from "bcryptjs"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CodeTextarea } from "@/components/ui/code-textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"

export function BcryptViewer() {
    // Generate
    const [input, setInput] = React.useState("")
    const [saltRounds, setSaltRounds] = React.useState(10)
    const [hash, setHash] = React.useState("")
    const [isGenerating, setIsGenerating] = React.useState(false)

    // Verify
    const [verifyInput, setVerifyInput] = React.useState("")
    const [verifyHash, setVerifyHash] = React.useState("")
    const [isMatch, setIsMatch] = React.useState<boolean | null>(null)

    const handleGenerate = async () => {
        if (!input) return
        setIsGenerating(true)
        // Bcrypt is sync/async. Async is better for React to not block UI.
        try {
            const h = await bcrypt.hash(input, saltRounds)
            setHash(h)
        } catch (e) {
            toast.error("Error generating hash")
        } finally {
            setIsGenerating(false)
        }
    }

    const handleVerify = async () => {
        if (!verifyInput || !verifyHash) {
            setIsMatch(null)
            return
        }
        try {
            const match = await bcrypt.compare(verifyInput, verifyHash)
            setIsMatch(match)
        } catch (e) {
            setIsMatch(false)
        }
    }

    // Auto-verify when inputs change
    React.useEffect(() => {
        handleVerify()
    }, [verifyInput, verifyHash])

    const handleCopy = () => {
        if (!hash) return
        navigator.clipboard.writeText(hash)
        toast.success("Bcrypt hash copied")
    }

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    Bcrypt Tool
                </h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => { setInput(""); setHash(""); setVerifyInput(""); setVerifyHash(""); }}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="generate" className="h-full flex flex-col">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="generate">Generate Hash</TabsTrigger>
                    <TabsTrigger value="verify">Verify Hash</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="flex-1 mt-4">
                    <div className="grid h-full gap-4 md:grid-cols-2 pb-4">
                        <div className="flex flex-col gap-4 h-full">
                            <div className="flex flex-col gap-2 flex-1">
                                <Label htmlFor="input">Password</Label>
                                <CodeTextarea
                                    id="input"
                                    placeholder="Type password to hash..."
                                    className="h-full"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-4 p-4 border rounded-md bg-muted/20">
                                <div className="flex justify-between">
                                    <Label>Salt Rounds: {saltRounds}</Label>
                                </div>
                                <Slider
                                    value={[saltRounds]}
                                    onValueChange={(v) => setSaltRounds(v[0])}
                                    min={4}
                                    max={16}
                                    step={1}
                                />
                                <Button onClick={handleGenerate} disabled={isGenerating}>
                                    {isGenerating ? "Hashing..." : "Generate Hash"}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 h-full">
                            <div className="flex items-center justify-between">
                                <Label>Bcrypt Hash</Label>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleCopy}
                                    title="Copy Hash"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <CodeTextarea
                                readOnly
                                className="h-full"
                                value={hash}
                                placeholder="Hash will appear here..."
                            />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="verify" className="flex-1 mt-4">
                    <div className="flex flex-col gap-6 max-w-2xl mx-auto pt-8">
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="v-pass">Password</Label>
                            <Input
                                id="v-pass"
                                placeholder="Enter plain text password"
                                value={verifyInput}
                                onChange={(e) => setVerifyInput(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="v-hash">Bcrypt Hash</Label>
                            <Input
                                id="v-hash"
                                placeholder="Enter hash to verify against ($2a$10$...)"
                                value={verifyHash}
                                onChange={(e) => setVerifyHash(e.target.value)}
                                className="font-mono text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-center p-8 border rounded-lg bg-muted/10 mt-4">
                            {isMatch === true && (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xl font-bold animate-in zoom-in duration-300">
                                    <CheckCircle className="w-8 h-8" />
                                    Match!
                                </div>
                            )}
                            {isMatch === false && (
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xl font-bold animate-in zoom-in duration-300">
                                    <XCircle className="w-8 h-8" />
                                    No Match
                                </div>
                            )}
                            {isMatch === null && (
                                <span className="text-muted-foreground">Enter password and hash to verify</span>
                            )}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
