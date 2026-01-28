"use client"

import * as React from "react"
import { validate, version as uuidVersion, NIL } from "uuid"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function UuidValidatorViewer() {
    const [input, setInput] = React.useState("")
    const [isValid, setIsValid] = React.useState<boolean | null>(null)
    const [version, setVersion] = React.useState<number | null>(null)
    const [isNil, setIsNil] = React.useState(false)

    React.useEffect(() => {
        if (!input.trim()) {
            setIsValid(null)
            setVersion(null)
            setIsNil(false)
            return
        }

        const valid = validate(input)
        setIsValid(valid)

        if (valid) {
            setVersion(uuidVersion(input))
            setIsNil(input === NIL)
        } else {
            setVersion(null)
            setIsNil(false)
        }
    }, [input])

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                        <Label>UUID to Validate</Label>
                        <Input
                            placeholder="Enter UUID..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className={cn(
                                "font-mono text-lg transition-colors",
                                isValid === true && "border-green-500 focus-visible:ring-green-500",
                                isValid === false && "border-destructive focus-visible:ring-destructive"
                            )}
                        />
                    </div>

                    {isValid !== null && (
                        <div className={cn(
                            "rounded-lg p-4 border flex items-center gap-4",
                            isValid ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300" : "bg-destructive/10 border-destructive/20 text-destructive"
                        )}>
                            {isValid ? (
                                <CheckCircle2 className="h-6 w-6" />
                            ) : (
                                <XCircle className="h-6 w-6" />
                            )}
                            <div className="flex flex-col">
                                <span className="font-semibold text-lg">
                                    {isValid ? "Valid UUID" : "Invalid UUID"}
                                </span>
                                {isValid && (
                                    <span className="text-sm opacity-90">
                                        Version: {version} {isNil ? "(NIL UUID)" : ""}
                                    </span>
                                )}
                                {!isValid && (
                                    <span className="text-sm opacity-90">
                                        The provided string is not a valid UUID.
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {!input && (
                        <div className="p-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                            Enter a UUID above to check its validity and version.
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-muted/50 border-none shadow-none">
                    <CardContent className="p-4 space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Format Rule
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Where M represents the version and N represents the variant.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
