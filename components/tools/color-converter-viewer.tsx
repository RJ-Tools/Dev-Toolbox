"use client"

import * as React from "react"
import { colord, extend } from "colord"
import cmykPlugin from "colord/plugins/cmyk"
import namesPlugin from "colord/plugins/names"
import hwbPlugin from "colord/plugins/hwb"
import { Copy, RotateCcw, Palette } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

extend([cmykPlugin, namesPlugin, hwbPlugin])

export function ColorConverterViewer() {
    const [color, setColor] = React.useState("#3b82f6") // Default blue
    const [parsed, setParsed] = React.useState<any>(null)

    React.useEffect(() => {
        const c = colord(color)
        if (c.isValid()) {
            setParsed({
                hex: c.toHex(),
                rgb: c.toRgbString(),
                hsl: c.toHslString(),
                cmyk: c.toCmykString(),
                name: c.toName({ closest: true }) || "Unknown",
                dark: c.isDark(),
                light: c.isLight(),
                alpha: c.alpha(),
                rgbObj: c.toRgb(),
                hslObj: c.toHsl()
            })
        }
    }, [color])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`Copied ${text}`)
    }

    const ColorInput = ({ label, value, type = "text" }: { label: string, value: string, type?: string }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="relative">
                <Input
                    value={value}
                    readOnly
                    className="font-mono pr-10"
                />
                <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full hover:bg-transparent"
                    onClick={() => copyToClipboard(value)}
                >
                    <Copy className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto">
            <Card>
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Color Picker / Preview */}
                        <div className="flex flex-col gap-4 w-full md:w-auto flex-shrink-0">
                            <div
                                className="w-full md:w-64 h-64 rounded-xl shadow-inner border-4 border-white dark:border-zinc-800 ring-1 ring-border relative group overflow-hidden"
                                style={{ backgroundColor: parsed?.hex || color }}
                            >
                                <Input
                                    type="color"
                                    value={parsed?.hex || "#000000"}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
                                    <span className="text-white font-medium bg-black/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm">Click to Pick</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Input Color</Label>
                                <Input
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="Enter HEX, RGB, or Name..."
                                    className="font-mono text-center"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 w-full space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ColorInput label="HEX" value={parsed?.hex || "-"} />
                                <ColorInput label="RGB" value={parsed?.rgb || "-"} />
                                <ColorInput label="HSL" value={parsed?.hsl || "-"} />
                                <ColorInput label="CMYK" value={parsed?.cmyk || "-"} />
                                <ColorInput label="Color Name" value={parsed?.name || "-"} />
                                <div className="space-y-2">
                                    <Label>Brightness</Label>
                                    <div className="h-10 border rounded-md flex items-center px-3 text-sm font-medium bg-muted/50">
                                        {parsed ? (parsed.dark ? "Dark" : "Light") : "-"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {parsed && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold flex items-center gap-2">
                                <Palette className="w-4 h-4" /> RGB Channels
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Red</span>
                                        <span className="font-mono text-muted-foreground">{parsed.rgbObj.r}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-red-500" style={{ width: `${(parsed.rgbObj.r / 255) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Green</span>
                                        <span className="font-mono text-muted-foreground">{parsed.rgbObj.g}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500" style={{ width: `${(parsed.rgbObj.g / 255) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Blue</span>
                                        <span className="font-mono text-muted-foreground">{parsed.rgbObj.b}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(parsed.rgbObj.b / 255) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <h3 className="font-semibold flex items-center gap-2">
                                <RotateCcw className="w-4 h-4" /> HSL Channels
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Hue</span>
                                        <span className="font-mono text-muted-foreground">{parsed.hslObj.h}°</span>
                                    </div>
                                    <div className="h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-full" />
                                    <Slider
                                        defaultValue={[parsed.hslObj.h]}
                                        max={360}
                                        className="py-1"
                                        onValueChange={([h]) => {
                                            const newColor = colord({ h, s: parsed.hslObj.s, l: parsed.hslObj.l }).toHex()
                                            setColor(newColor)
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Saturation</span>
                                        <span className="font-mono text-muted-foreground">{parsed.hslObj.s}%</span>
                                    </div>
                                    <Slider
                                        value={[parsed.hslObj.s]}
                                        max={100}
                                        onValueChange={([s]) => {
                                            const newColor = colord({ h: parsed.hslObj.h, s, l: parsed.hslObj.l }).toHex()
                                            setColor(newColor)
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Lightness</span>
                                        <span className="font-mono text-muted-foreground">{parsed.hslObj.l}%</span>
                                    </div>
                                    <Slider
                                        value={[parsed.hslObj.l]}
                                        max={100}
                                        onValueChange={([l]) => {
                                            const newColor = colord({ h: parsed.hslObj.h, s: parsed.hslObj.s, l }).toHex()
                                            setColor(newColor)
                                        }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
