export const line = new RegExp("^(?<function>^[^#:\\s]+:?)(?<args>[^:]*?)(?<comment>#.*)*$", "")
export const hash = new RegExp('^HASH\\("(?<hash>.+?)"\\)$', "")
export const reg = /^(?<prefix>r*)r(?<index>0|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|a)$/
export const dev = /^d([012345b])$/
export const strStart = /^".+$/
export const strEnd = /.+"$/
