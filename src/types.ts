import * as CONST from './constant'

interface Rule<A extends string, T extends string> {
    type: T | CONST.TYPE_RESERVED
    list?: Rule<A, T>[]
    value?: any
    comment?: string
    action?: A
}

type RuleFn = (input: any, value?: any) => boolean

type RuleFnMap<T extends string> = {
    [key in T]: {
        fn: RuleFn
        valType?:
            | 'undefined'
            | 'object'
            | 'array'
            | 'boolean'
            | 'number'
            | 'string'
            | 'function'
        inputType?:
            | 'undefined'
            | 'object'
            | 'array'
            | 'boolean'
            | 'number'
            | 'string'
            | 'function'
            | ((input: any) => boolean)
    }
}

type Path = {
    lineNr: number
    type: string
    action: string
}

class RuleCheckError extends Error {
    constructor(message: string) {
        super(message)
    }
}

type _Decimal = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'

type Decimal = '0' | _Decimal

type MatchKey =
    | 'match'
    | 'action'
    | `${Decimal}` // 0 - 9
    | `${_Decimal}${Decimal}` // 10 - 99

type Matches<A> = {
    [key in MatchKey]: key extends 'match'
        ? boolean
        : key extends 'action'
        ? A
        : Matches<A>
}

export { Rule, RuleFn, RuleFnMap, Path, Matches }
export { RuleCheckError }
