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
    ArrowRightLeft,
    Braces,
    FileJson,
    FileType,
    Database,
    Hash,
    Link as LinkIcon,
    Key,
    Shield,
    Code2,
    Calendar,
    Timer,
    ListOrdered,
    Palette,
    AlignLeft,
    Activity,
    Search,
    CaseSensitive,
    Regex,
    Copy,
    Terminal,
    Server
} from "lucide-react";

export type Tool = {
    id: string;
    name: string;
    slug: string;
    description?: string;
    href?: string;
    icon: LucideIcon;
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
            { id: "json-formatter", name: "JSON Formatter & Validator", slug: "json-formatter", href: "/tools/json-formatter", icon: FileJson },
            { id: "yaml-formatter", name: "YAML Formatter & Validator", slug: "yaml-formatter", href: "/tools/yaml-formatter", icon: FileType },
            { id: "xml-formatter", name: "XML Formatter & Validator", slug: "xml-formatter", href: "/tools/xml-formatter", icon: Code2 },
            { id: "format-converter", name: "Format Converter (JSON/YAML/XML)", slug: "format-converter", href: "/tools/converter", icon: ArrowRightLeft },
            { id: "sql-formatter", name: "SQL Formatter & Validator", slug: "sql-formatter", href: "/tools/sql-formatter", icon: Database },
            { id: "markdown-previewer", name: "Markdown Previewer", slug: "markdown-previewer", href: "/tools/markdown-previewer", icon: FileCode },
            { id: "toml-validator", name: "TOML Validator", slug: "toml-validator", href: "/tools/toml-validator", icon: FileType }
        ]
    },
    {
        id: "encoding-security",
        name: "Encoding, Decoding & Security",
        icon: Lock,
        description: "Encode, decode, hash, and secure data",
        tools: [
            { id: "base64", name: "Base64 Encode / Decode", slug: "base64-encoder-decoder", href: "/tools/base64-encoder-decoder", icon: Code2 },
            { id: "url-encoder", name: "URL Encode / Decode", slug: "url-encoder-decoder", href: "/tools/url-encoder-decoder", icon: LinkIcon },
            { id: "jwt-decoder", name: "JWT Decoder", slug: "jwt-decoder", href: "/tools/jwt-decoder", icon: Shield },
            { id: "hash-generator", name: "Hash Generator (MD5, SHA)", slug: "hash-generator", href: "/tools/hash-generator", icon: Hash },
            { id: "hmac-generator", name: "HMAC Generator", slug: "hmac-generator", href: "/tools/hmac-generator", icon: Key },
            { id: "bcrypt-tool", name: "Bcrypt Hash Tool", slug: "bcrypt-hash-tool", href: "/tools/bcrypt-hash-tool", icon: Lock },
            { id: "html-escape", name: "HTML Escape / Unescape", slug: "html-escape-unescape", href: "/tools/html-escape-unescape", icon: Code2 }
        ]
    },
    {
        id: "date-time",
        name: "Date, Time & Timestamp",
        icon: Clock,
        description: "Convert, compare, and calculate time values",
        tools: [
            { id: "timestamp-converter", name: "Unix Timestamp Converter", slug: "timestamp-converter", href: "/tools/timestamp", icon: Clock },
            { id: "timezone-converter", name: "Timezone Converter", slug: "timezone-converter", href: "/tools/timezone-converter", icon: Globe },
            { id: "cron-parser", name: "Cron Expression Parser", slug: "cron-parser", href: "/tools/cron-parser", icon: Timer },
            { id: "date-diff", name: "Date Difference Calculator", slug: "date-difference", href: "/tools/date-difference", icon: Calendar },
            { id: "iso-converter", name: "ISO 8601 Converter", slug: "iso-date-converter", href: "/tools/iso-date-converter", icon: Activity }
        ]
    },
    {
        id: "generators",
        name: "ID, Random & Generators",
        icon: Shuffle,
        description: "Generate IDs, test data, and random values",
        tools: [
            { id: "uuid-generator", name: "UUID Generator", slug: "uuid-generator", href: "/tools/uuid-generator", icon: Hash },
            { id: "uuid-validator", name: "UUID Validator", slug: "uuid-validator", href: "/tools/uuid-validator", icon: CheckCircle },
            { id: "random-string", name: "Random String Generator", slug: "random-string-generator", href: "/tools/random-string-generator", icon: Type },
            { id: "fake-data", name: "Fake Data Generator", slug: "fake-data-generator", href: "/tools/fake-data-generator", icon: Copy },
            { id: "password-generator", name: "Password Generator", slug: "password-generator", href: "/tools/password-generator", icon: Key },
            { id: "slug-generator", name: "Slug Generator", slug: "slug-generator", href: "/tools/slug-generator", icon: LinkIcon }
        ]
    },
    {
        id: "text-dev-utils",
        name: "Text & Developer Utilities",
        icon: Type,
        description: "Manipulate, compare, and analyze text",
        tools: [
            { id: "regex-tester", name: "Regex Tester", slug: "regex-tester", href: "/tools/regex-tester", icon: Regex },
            { id: "diff-checker", name: "Text Diff Checker", slug: "diff-checker", href: "/tools/diff", icon: FileDiff },
            { id: "case-converter", name: "Text Case Converter", slug: "text-case-converter", href: "/tools/text-case-converter", icon: CaseSensitive },
            { id: "line-sorter", name: "Line Sorter / Deduplicator", slug: "line-sorter", href: "/tools/line-sorter", icon: ListOrdered },
            { id: "word-counter", name: "Word & Character Counter", slug: "word-counter", href: "/tools/word-counter", icon: AlignLeft },
            { id: "color-converter", name: "Color Converter (HEX/RGB/HSL)", slug: "color-converter", href: "/tools/color-converter", icon: Palette }
        ]
    },
    {
        id: "web-api",
        name: "Web & API Tools",
        icon: Globe,
        description: "Work with APIs, requests, and web data",
        tools: [
            { id: "http-header-parser", name: "HTTP Header Parser", slug: "http-header-parser", icon: Server },
            { id: "curl-to-fetch", name: "cURL → Fetch Converter", slug: "curl-to-fetch", icon: Terminal },
            { id: "jsonpath-tester", name: "JSONPath Tester", slug: "jsonpath-tester", icon: Search },
            { id: "graphql-formatter", name: "GraphQL Query Formatter", slug: "graphql-formatter", icon: Braces }
        ]
    }
];
