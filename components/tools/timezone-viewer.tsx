"use client"

import * as React from "react"
import { ArrowRightLeft, Clock, Copy, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function TimezoneViewer() {
    // Get all valid timezones
    const timezones = React.useMemo(() => {
        try {
            return Intl.supportedValuesOf("timeZone")
        } catch (e) {
            return ["UTC", "GMT", "America/New_York", "Europe/London", "Asia/Tokyo"]
        }
    }, [])

    const [date, setDate] = React.useState<string>(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
    const [sourceTz, setSourceTz] = React.useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone)
    const [targetTz, setTargetTz] = React.useState<string>("UTC")
    const [convertedTime, setConvertedTime] = React.useState("")

    const handleConvert = React.useCallback(() => {
        if (!date || !sourceTz || !targetTz) return

        try {
            // Create a date object from the input string, interpreting it as being in the sourceTz
            // This is tricky in pure JS without libraries like Luxon/date-fns-tz.
            // Workaround: Treat input as pure components, construct date in UTC, then offset?
            // Better: use new Date(date) which creates it in Local, then we need to "move" it to SourceTZ.

            // Actually, the simplest stable way without extra libs:
            // 1. Parse the input string (local time components)
            // 2. We want a timestamp that corresponds to these components in SourceTZ.
            // 3. We can brute-force find the timestamp or use specific parts.

            // Let's use a simpler approach for now: modifying the date string to be explicitly in the source TZ if supported,
            // or just using the browser's ability to formatting timestamps.

            // Step 1: Create a Date object representing the chosen time in LOCAL system time (default behavior of new Date("..."))
            // But we want "2023-01-01 10:00" in "Asia/Tokyo", not "Local System".

            // To get the timestamp of "2023-01-01 10:00 Asia/Tokyo":
            // We can construct a string: new Date("2023-01-01T10:00:00+09:00") IF we know the offset.
            // We don't know the offset easily.

            // Alternative:
            // Use Intl.DateTimeFormat to find the offset?
            // Let's rely on the user inputting a date, and we treat it as if it IS in the source timezone.
            // Accessing the timestamp is the hard part.

            // Let's try to simulate it:
            // 1. Take the input components (Y,M,D,H,m)
            // 2. Create a version in UTC: Date.UTC(Y, M, D, H, m) -> Timestamp T1
            // 3. Format T1 in SourceTZ to see "What time is T1 in SourceTZ?" -> string S1.
            // 4. Compare S1 components with input components. Calculate difference. Shift timestamp.
            // This is "Format-Parse" loop. Valid approach for client-side without libs.

            // For this MVP, let's assume standard behavior:
            // Input is in Local Time, we convert to Target.
            // OR we fix Source to "Local" (browser) and only allow Target change.
            // BUT "Timezone Converter" implies converting FROM any TO any.

            // Let's try the LocaleString hack:
            // "en-US" format with full components in a specific timezone can parse it back? No.

            // Let's implement the iterative offset finding (simple version):
            // 1. Guess UTC timestamp = Date.parse(input + "Z")
            // 2. Format guess in SourceTZ.
            // 3. Diff the formatted time vs expected time. Adjust guess.

            // Function to format a timestamp to "YYYY-MM-DDTHH:mm" in a specific TZ
            const formatInTz = (ts: number, tz: string) => {
                return new Intl.DateTimeFormat('sv-SE', {
                    timeZone: tz,
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).format(ts).replace(' ', 'T')
            }

            const targetDateStr = date; // "2023-01-01T12:00"
            const targetTs = Date.parse(targetDateStr + "Z"); // Treat input as UTC first for stable baseline

            // Binary search / Iterative approach to find TS where formatInTz(TS, sourceTz) == targetDateStr
            // Initial guess: targetTs itself.
            let guess = targetTs;
            // Limit iterations
            for (let i = 0; i < 5; i++) {
                const parts = new Intl.DateTimeFormat('en-US', {
                    timeZone: sourceTz,
                    year: 'numeric', month: 'numeric', day: 'numeric',
                    hour: 'numeric', minute: 'numeric', second: 'numeric',
                    hour12: false
                }).formatToParts(guess);

                const getPart = (type: string) => parseInt(parts.find(p => p.type === type)?.value || "0");

                // Construct where our guess actually landed in SourceTZ
                // Note: month is 1-based in Intl parts
                const currentInSource = Date.UTC(
                    getPart('year'),
                    getPart('month') - 1,
                    getPart('day'),
                    getPart('hour'),
                    getPart('minute'),
                    getPart('second')
                );

                // We wanted targetTs (as UTC value of input components)
                // Note: targetTs from Parse("...Z") is exactly the UTC timestamp of those components.
                // Difference = currentInSource - targetTs.
                const diff = currentInSource - targetTs;

                if (Math.abs(diff) < 1000) break; // Close enough

                guess -= diff;
            }

            // Now we have 'guess', which is the true timestamp.
            // Convert 'guess' to TargetTZ.
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: targetTz,
                dateStyle: 'full',
                timeStyle: 'long',
            });

            setConvertedTime(formatter.format(guess));

        } catch (e) {
            setConvertedTime("Invalid conversion")
        }
    }, [date, sourceTz, targetTz])

    React.useEffect(() => {
        handleConvert()
    }, [date, sourceTz, targetTz, handleConvert])

    const handleSwap = () => {
        setSourceTz(targetTz)
        setTargetTz(sourceTz)
    }

    const handleCopy = () => {
        if (!convertedTime) return
        navigator.clipboard.writeText(convertedTime)
        toast.success("Copied to clipboard")
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto h-[calc(100vh-140px)] min-h-[500px]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Timezone Converter
                </h2>
                <Button variant="outline" onClick={() => setDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"))}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset to Now
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_auto_1fr]">
                {/* Source Column */}
                <Card className="flex flex-col gap-4 p-4 h-full">
                    <div className="flex flex-col gap-2">
                        <Label>Source Timezone</Label>
                        <Select value={sourceTz} onValueChange={setSourceTz}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="max-h-[300px]">
                                {timezones.map(tz => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Date & Time</Label>
                        <Input
                            type="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="font-mono w-full"
                        />
                    </div>
                </Card>

                {/* Swap Button */}
                <div className="flex items-center justify-center pt-8">
                    <Button variant="ghost" size="icon" onClick={handleSwap}>
                        <ArrowRightLeft className="h-6 w-6" />
                    </Button>
                </div>

                {/* Target Column */}
                <Card className="flex flex-col gap-4 p-4 h-full">
                    <div className="flex flex-col gap-2">
                        <Label>Target Timezone</Label>
                        <Select value={targetTz} onValueChange={setTargetTz}>
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="max-h-[300px]">
                                {timezones.map(tz => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 justify-center">
                        <Label>Converted Time</Label>
                        <div className="flex flex-col gap-2 p-4 bg-muted rounded-md text-center min-h-[80px] justify-center relative group">
                            <span className="text-lg font-medium">{convertedTime || "..."}</span>
                            {convertedTime && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="text-sm text-muted-foreground text-center">
                * Calculates offsets including Daylight Saving Time rules for chosen regions.
            </div>
        </div>
    )
}
