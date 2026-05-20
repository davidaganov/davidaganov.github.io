export type LocalizedRecord = Record<string, string>

export type LocalizedFlexible = string | LocalizedRecord | Partial<Record<string, string>>
