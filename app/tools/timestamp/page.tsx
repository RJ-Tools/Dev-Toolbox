import { TimestampViewer } from "@/components/tools/timestamp-viewer"

export const metadata = {
    title: "Timestamp Converter - Developer Tools",
    description: "Convert epoch, unix, iso timestamps",
}

export default function TimestampPage() {
    return <TimestampViewer />
}
