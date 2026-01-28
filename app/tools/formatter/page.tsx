import { FormatterViewer } from "@/components/tools/formatter-viewer"

export const metadata = {
    title: "Formatter - Developer Tools",
    description: "Format JSON, YAML, XML, CSV",
}

export default function FormatterPage() {
    return <FormatterViewer />
}
