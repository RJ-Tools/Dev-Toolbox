import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"
import Link from "next/link"

export default function ToolPlaceholderPage({ params }: { params: { slug: string } }) {
    // In Next.js 15+ params should be awaited if async, but 14 is synchronous mostly unless strict.
    // Assuming 14 standard usage.
    // Actually, let's just use the prop.

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-muted rounded-full">
                            <Construction className="w-8 h-8 text-muted-foreground" />
                        </div>
                    </div>
                    <CardTitle>Tool Under Construction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                        The tool <code className="bg-muted px-1 py-0.5 rounded">{params.slug}</code> is coming soon!
                        We are working hard to bring it to you.
                    </p>
                    <Link href="/">
                        <Button variant="default">Back to Dashboard</Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}
