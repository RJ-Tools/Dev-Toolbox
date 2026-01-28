"use client"

import * as React from "react"
import { Moon, Sun, Sunset, Snowflake, Flower2, Leaf, Rocket, Waves, Laptop } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("sunset")}>
                    <Sunset className="mr-2 h-4 w-4" />
                    Sunset
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("winter")}>
                    <Snowflake className="mr-2 h-4 w-4" />
                    Winter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("spring")}>
                    <Flower2 className="mr-2 h-4 w-4" />
                    Spring
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("autumn")}>
                    <Leaf className="mr-2 h-4 w-4" />
                    Autumn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("space")}>
                    <Rocket className="mr-2 h-4 w-4" />
                    Space
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("ocean")}>
                    <Waves className="mr-2 h-4 w-4" />
                    Ocean
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="mr-2 h-4 w-4" />
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
