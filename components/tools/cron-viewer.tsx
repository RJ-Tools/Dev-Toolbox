"use client"

import * as React from "react"
// @ts-ignore
import parser from "cron-parser"
import { Clock, RotateCcw, Calendar, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CronViewer() {
    const [expression, setExpression] = React.useState("*/5 * * * *")
    const [nextDates, setNextDates] = React.useState<string[]>([])
    const [error, setError] = React.useState("")

    const handleParse = React.useCallback(() => {
        if (!expression) {
            setNextDates([])
            setError("")
            return
        }

        try {
            // @ts-ignore
            const interval = parser.parseExpression(expression)
            const dates = []
            for (let i = 0; i < 5; i++) {
                dates.push(interval.next().toString())
            }
            setNextDates(dates)
            setError("")
        } catch (err: any) {
            setError(err.message || "Invalid cron expression")
            setNextDates([])
        }
    }, [expression])

    React.useEffect(() => {
        handleParse()
    }, [expression, handleParse])

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Cron Parser
                </h2>
                <Button variant="outline" onClick={() => setExpression("*/5 * * * *")}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>

            <Card className="flex-1">
                <CardContent className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <Label>Cron Expression</Label>
                        <Input
                            value={expression}
                            onChange={(e) => setExpression(e.target.value)}
                            placeholder="* * * * *"
                            className={cn("font-mono text-lg", error && "border-destructive focus-visible:ring-destructive")}
                        />
                        {error && (
                            <div className="text-sm text-destructive flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" />
                                {error}
                            </div>
                        )}
                        {!error && (
                            <div className="text-xs text-muted-foreground mt-1">
                                Format: Minute Hour DayOfMonth Month DayOfWeek
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Label className="text-base">Next 5 Executions</Label>
                        <div className="bg-muted/30 rounded-md border divide-y">
                            {nextDates.length > 0 ? (
                                nextDates.map((date, i) => (
                                    <div key={i} className="p-3 font-mono text-sm flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-muted-foreground" />
                                        {date}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground text-sm">
                                    {error ? "Fix expression to see dates" : "Enter expression..."}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
