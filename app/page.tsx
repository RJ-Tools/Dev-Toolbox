import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileDiff, FileCode, CheckCircle, Clock, ArrowRightLeft } from "lucide-react";

export default function Home() {
  const tools = [
    {
      title: "Diff Checker",
      description: "Compare two text files or code snippets to find differences.",
      icon: FileDiff,
      href: "/tools/diff",
      color: "text-blue-500",
    },
    {
      title: "Formatter",
      description: "Format JSON, YAML, XML, and CSV files instantly.",
      icon: FileCode,
      href: "/tools/formatter",
      color: "text-green-500",
    },
    {
      title: "Validator",
      description: "Validate and automatically fix JSON, YAML, and XML content.",
      icon: CheckCircle,
      href: "/tools/validator",
      color: "text-purple-500",
    },
    {
      title: "Timestamp Converter",
      description: "Convert timestamps between various formats (UTC, Epoch, ISO).",
      icon: Clock,
      href: "/tools/timestamp",
      color: "text-orange-500",
    },
    {
      title: "Format Converter",
      description: "Convert data between JSON, XML, and YAML formats.",
      icon: ArrowRightLeft,
      href: "/tools/converter",
      color: "text-pink-500",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your developer toolkit. Select a tool to get started.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <Link key={tool.title} href={tool.href}>
            <Card className="hover:bg-muted/50 transition-colors h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {tool.title}
                </CardTitle>
                <tool.icon className={`h-4 w-4 ${tool.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold"></div>
                <CardDescription className="mt-2">
                  {tool.description}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
