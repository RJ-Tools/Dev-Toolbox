import { DiffViewer } from "@/components/tools/diff-viewer"

export const metadata = {
    title: "Diff Checker - Developer Tools",
    description: "Compare text and code files",
}

export default function DiffPage() {
    return <DiffViewer />
}
