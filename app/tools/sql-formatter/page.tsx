import { FormatterViewer } from "@/components/tools/formatter-viewer";

export default function SqlFormatterPage() {
    return <FormatterViewer defaultType="sql" hideSelector={true} />;
}
