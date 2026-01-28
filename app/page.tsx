import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toolsConfig } from "@/lib/tools-config"; // Use the central config

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your developer toolkit. Select a category or tool to get started.
        </p>
      </div>

      <div className="space-y-8">
        {toolsConfig.map((category) => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 border-b pb-2">
              <category.icon className="w-5 h-5 text-primary" />
              {category.name}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.tools.map((tool) => (
                <Link key={tool.id} href={tool.href || `/tools/${tool.slug}`}>
                  <Card className="hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <tool.icon className="h-4 w-4 text-muted-foreground" />
                        {tool.name}
                      </CardTitle>
                    </CardHeader>
                    {/* If we had description per tool, we'd show it here. For now we only have it on category or inferred. */}
                    {/* The config has descriptions for categories, but not all tools. Let's skip tool description for cleaner look or fallback. */}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
