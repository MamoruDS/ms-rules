type TYPE_SINGLE = 'FINAL'
type TYPE_GROUP = 'ADD' | 'OR' | 'NOT'

const TYPE_NOT = 'NOT'
const TYPE_SINGLE = ['FINAL']
const TYPE_GROUP = ['ADD', 'OR', 'NOT']
const LEN_LIMIT: {
    [key in TYPE_GROUP]: number
} = {
    ADD: Infinity,
    OR: Infinity,
    NOT: 1,
}

const TYPE_RESERVED = [...TYPE_SINGLE, ...TYPE_GROUP]
type TYPE_RESERVED = TYPE_SINGLE | TYPE_GROUP

export { TYPE_NOT, TYPE_SINGLE, TYPE_GROUP, LEN_LIMIT, TYPE_RESERVED }
