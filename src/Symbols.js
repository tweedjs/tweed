export const createSymbol = typeof Symbol === 'undefined' ? String : Symbol

export const UPDATE = createSymbol('[[UPDATE]]')
export const STATEFUL = createSymbol('[[STATEFUL]]')
export const WATCHED = createSymbol('[[WATCHED]]')
export const MUTATING_FIELDS = createSymbol('[[MUTATING_FIELDS]]')
