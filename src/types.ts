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

export { Rule, RuleFn, RuleFnMap, Path }
export { RuleCheckError }
