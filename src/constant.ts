import { RuleFnMap } from './types'

type TYPE_SINGLE = 'FINAL'
type TYPE_GROUP = 'AND' | 'OR' | 'NOT'

const TYPE_NOT = 'NOT'
const TYPE_SINGLE = ['FINAL']
const TYPE_GROUP = ['AND', 'OR', 'NOT']
const LEN_LIMIT: {
    [key in TYPE_GROUP]: number
} = {
    AND: Infinity,
    OR: Infinity,
    NOT: 1,
}

const TYPE_RESERVED = [...TYPE_SINGLE, ...TYPE_GROUP]
type TYPE_RESERVED = TYPE_SINGLE | TYPE_GROUP

const RULE_FN_MAP_RESERVED: RuleFnMap<TYPE_RESERVED> = {
    AND: {
        fn: (input: { lhs: number; rhs: number }) => {
            if (typeof input['lhs'] == 'undefined') {
                return Boolean(input['rhs'])
            } else {
                return Boolean(input['lhs'] & input['rhs'])
            }
        },
    },
    OR: {
        fn: (input: { lhs: number; rhs: number }) => {
            if (typeof input['lhs'] == 'undefined') {
                return Boolean(input['rhs'])
            } else {
                return Boolean(input['lhs'] | input['rhs'])
            }
        },
    },
    NOT: {
        fn: (input: { lhs: number; rhs: number }) => {
            return !Boolean(input['rhs'])
        },
    },
    FINAL: {
        fn: () => {
            return true
        },
    },
}

export { TYPE_NOT, TYPE_SINGLE, TYPE_GROUP, TYPE_RESERVED }

export { LEN_LIMIT, RULE_FN_MAP_RESERVED }
