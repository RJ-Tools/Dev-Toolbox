"use client"

import * as React from "react"
import { Calendar, RotateCcw } from "lucide-react"
import { intervalToDuration, formatDuration, differenceInDays, type Duration } from "date-fns"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export function DateDiffViewer() {
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")
    const [result, setResult] = React.useState<Duration | null>(null)
    const [totalDays, setTotalDays] = React.useState<number | null>(null)

    const handleCalculate = React.useCallback(() => {
        if (!startDate || !endDate) {
            setResult(null)
            setTotalDays(null)
            return
        }

        try {
            const start = new Date(startDate)
            const end = new Date(endDate)

            if (isNaN(start.getTime()) || isNaN(end.getTime())) return

            const duration = intervalToDuration({ start, end })
            setResult(duration)
            setTotalDays(differenceInDays(end, start))
        } catch (e) {
            setResult(null)
        }
    }, [startDate, endDate])

    React.useEffect(() => {
        handleCalculate()
    }, [startDate, endDate, handleCalculate])

    return (
        <div className="flex flex-col gap-6 max-w-2xl mx-auto h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Date Difference
                </h2>
                <Button variant="outline" onClick={() => { setStartDate(""); setEndDate("") }}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                </Button>
            </div>

            <Card>
                <CardContent className="p-6 grid gap-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label>Start Date</Label>
                            <Input
                                type="datetime-local"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>End Date</Label>
                            <Input
                                type="datetime-local"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-muted p-6 rounded-lg text-center min-h-[150px] flex flex-col justify-center gap-4">
                        {result ? (
                            <>
                                <div className="text-3xl font-bold tracking-tight">
                                    {formatDuration(result, { delimiter: ', ' }) || "0 seconds"}
                                </div>
                                <div className="text-muted-foreground font-mono text-sm border-t pt-4 mt-2">
                                    Total Days: {totalDays}
                                    {totalDays !== null && totalDays < 0 && " (Negative duration)"}
                                </div>
                            </>
                        ) : (
                            <div className="text-muted-foreground">
                                Select start and end dates to calculate duration
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
