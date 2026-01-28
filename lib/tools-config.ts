import {
    FileCode,
    Lock,
    Clock,
    Shuffle,
    Type,
    Globe,
    LucideIcon,
    FileDiff,
    CheckCircle,
    ArrowRightLeft
} from "lucide-react";

export type Tool = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    href?: string; // Optional override for existing paths
};

export type Category = {
    id: string;
    name: string;
    icon: LucideIcon;
    description: string;
    tools: Tool[];
};

export const toolsConfig: Category[] = [
    {
        id: "data-formatters",
        name: "Data Formatters & Validators",
        icon: FileCode,
        description: "Format, validate, and convert structured data",
        tools: [
            { id: "json-formatter", name: "JSON Formatter & Validator", slug: "json-formatter", href: "/tools/formatter" },
            { id: "yaml-formatter", name: "YAML Formatter & Validator", slug: "yaml-formatter", href: "/tools/formatter" },
            { id: "xml-formatter", name: "XML Formatter", slug: "xml-formatter", href: "/tools/formatter" },
            { id: "yaml-json-converter", name: "YAML ↔ JSON Converter", slug: "yaml-json-converter", href: "/tools/converter" },
            { id: "csv-json-converter", name: "CSV ↔ JSON Converter", slug: "csv-json-converter", href: "/tools/formatter" }, // Formatter handles CSV
            { id: "sql-formatter", name: "SQL Formatter", slug: "sql-formatter" },
            { id: "markdown-previewer", name: "Markdown Previewer", slug: "markdown-previewer" },
            { id: "toml-validator", name: "TOML Validator", slug: "toml-validator" }
        ]
    },
    {
        id: "encoding-security",
        name: "Encoding, Decoding & Security",
        icon: Lock,
        description: "Encode, decode, hash, and secure data",
        tools: [
            { id: "base64", name: "Base64 Encode / Decode", slug: "base64-encoder-decoder" },
            { id: "url-encoder", name: "URL Encode / Decode", slug: "url-encoder-decoder" },
            { id: "jwt-decoder", name: "JWT Decoder", slug: "jwt-decoder" },
            { id: "hash-generator", name: "Hash Generator (MD5, SHA)", slug: "hash-generator" },
            { id: "hmac-generator", name: "HMAC Generator", slug: "hmac-generator" },
            { id: "bcrypt-tool", name: "Bcrypt Hash Tool", slug: "bcrypt-hash-tool" },
            { id: "html-escape", name: "HTML Escape / Unescape", slug: "html-escape-unescape" }
        ]
    },
    {
        id: "date-time",
        name: "Date, Time & Timestamp",
        icon: Clock,
        description: "Convert, compare, and calculate time values",
        tools: [
            { id: "timestamp-converter", name: "Unix Timestamp Converter", slug: "timestamp-converter", href: "/tools/timestamp" },
            { id: "timezone-converter", name: "Timezone Converter", slug: "timezone-converter" },
            { id: "cron-parser", name: "Cron Expression Parser", slug: "cron-parser" },
            { id: "date-diff", name: "Date Difference Calculator", slug: "date-difference" },
            { id: "iso-converter", name: "ISO 8601 Converter", slug: "iso-date-converter" }
        ]
    },
    {
        id: "generators",
        name: "ID, Random & Generators",
        icon: Shuffle,
        description: "Generate IDs, test data, and random values",
        tools: [
            { id: "uuid-generator", name: "UUID Generator", slug: "uuid-generator" },
            { id: "uuid-validator", name: "UUID Validator", slug: "uuid-validator" },
            { id: "random-string", name: "Random String Generator", slug: "random-string-generator" },
            { id: "fake-data", name: "Fake Data Generator", slug: "fake-data-generator" },
            { id: "password-generator", name: "Password Generator", slug: "password-generator" },
            { id: "slug-generator", name: "Slug Generator", slug: "slug-generator" }
        ]
    },
    {
        id: "text-dev-utils",
        name: "Text & Developer Utilities",
        icon: Type,
        description: "Manipulate, compare, and analyze text",
        tools: [
            { id: "regex-tester", name: "Regex Tester", slug: "regex-tester" },
            { id: "diff-checker", name: "Text Diff Checker", slug: "diff-checker", href: "/tools/diff" },
            { id: "case-converter", name: "Text Case Converter", slug: "text-case-converter" },
            { id: "line-sorter", name: "Line Sorter / Deduplicator", slug: "line-sorter" },
            { id: "word-counter", name: "Word & Character Counter", slug: "word-counter" },
            { id: "color-converter", name: "Color Converter (HEX/RGB/HSL)", slug: "color-converter" }
        ]
    },
    {
        id: "web-api",
        name: "Web & API Tools",
        icon: Globe,
        description: "Work with APIs, requests, and web data",
        tools: [
            { id: "http-header-parser", name: "HTTP Header Parser", slug: "http-header-parser" },
            { id: "curl-to-fetch", name: "cURL → Fetch Converter", slug: "curl-to-fetch" },
            { id: "jsonpath-tester", name: "JSONPath Tester", slug: "jsonpath-tester" },
            { id: "graphql-formatter", name: "GraphQL Query Formatter", slug: "graphql-formatter" }
        ]
    }
];
