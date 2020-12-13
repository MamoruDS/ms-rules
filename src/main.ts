import * as CONST from './constant'
import {
    Rule,
    RuleFn,
    RuleFnMap,
    Path,
    Matches,
    RuleLineStatus,
    RuleCheckError,
} from './types'
import { RuleLine } from './line'
import { println } from './utils'

const config = {
    silentMode: false,
}

class RuleEngine<A extends string, T extends string> {
    private _ruleFnMap: RuleFnMap<T>
    private _rules: Rule<A, T>[]
    private _final: A
    constructor(fnMap: RuleFnMap<T>, finalAction: A) {
        this._ruleFnMap = fnMap
        this._rules = []
        this._final = finalAction
    }
    private _check(
        rule: Rule<A, T>,
        path: Path[] = []
    ): {
        error: boolean
        errorMsg?: string
    } {
        let res = {
            error: false,
            errorMsg: undefined,
        }
        const e = (msg: string, format: boolean = true) => {
            const errorMsg = format
                ? msg +
                  ` at line:${path[0].lineNr}; path: [${[...path]
                      .reverse()
                      .map((p) => {
                          return p.type
                      })
                      .join('/')}]`
                : msg
            path.shift()
            throw new RuleCheckError(errorMsg)
        }
        const isSubRule = (): boolean => {
            for (const p of [...path.slice(1)].reverse()) {
                if (CONST.TYPE_GROUP.indexOf(p.type) != -1) {
                    return true
                }
            }
            return false
        }
        path.unshift({
            lineNr: this._rules.length + 1,
            type: rule.type,
            action: rule.action,
        })
        if (!isSubRule() && typeof rule.action == 'undefined') {
            // TODO:
            e(`Missing property 'action' of rule`)
        }
        if (CONST.TYPE_SINGLE.indexOf(rule.type) != -1) {
        } else if (CONST.TYPE_GROUP.indexOf(rule.type) != -1) {
            if (typeof rule.list == 'undefined') {
                e(`Missing property 'list' of rule group`)
            }
            if (
                rule.list.length >
                CONST.LEN_LIMIT[rule.type as CONST.TYPE_GROUP]
            ) {
                e(`Number of rules in group exceeds the limit`)
            }
            for (const r of rule.list) {
                const res = this._check(r, path)
                if (res.error) {
                    e(res.errorMsg, false)
                }
            }
        } else if (Object.keys(this._ruleFnMap).indexOf(rule.type) != -1) {
            const valType = this._ruleFnMap[rule.type as T].valType || false
            if (
                valType &&
                (valType != 'array'
                    ? typeof rule.value != valType
                    : !Array.isArray(rule.value))
            ) {
                e(
                    `Invalid rule value: <${valType}> is required but given '${
                        rule.value
                    }' as <${typeof rule.value}>`
                )
            }
        } else {
            e(`Unknown type '${rule.type}'`)
        }
        path.shift()
        return res
    }
    load(rule: Rule<A, T>, haltOnceFailed?: boolean): void
    load(rule: Rule<A, T>, haltOnceFailed?: boolean, log?: true): string[] {
        const errs: string[] = []
        try {
            this._check(rule)
        } catch (e) {
            if (e instanceof RuleCheckError) {
                if (haltOnceFailed) {
                    throw e
                }
                if (log) {
                    errs.push(e.message)
                } else {
                    println(e.message, 'error')
                }
            } else {
                throw e
            }
        }
        this._rules.push(rule)
        return errs
    }
    private _test(
        rule: Rule<A, T>,
        input: any,
        index: string[],
        matches: Matches<A>,
        actions: A[],
        show?: RuleLine<A, T>[]
    ) {
        let match: number
        let line: RuleLine<A, T>
        if (show) {
            line = new RuleLine<A, T>(
                rule.type,
                rule.action,
                index.length - 1,
                rule.value
            )
            show.push(line)
        }
        if (CONST.TYPE_RESERVED.indexOf(rule.type) != -1) {
            const update = (m: number) => {
                match = CONST.RULE_FN_MAP_RESERVED[
                    rule.type as CONST.TYPE_RESERVED
                ]?.fn({
                    lhs: match,
                    rhs: m,
                })
                    ? 1
                    : 0
            }
            if (CONST.TYPE_GROUP.indexOf(rule.type) != -1) {
                for (const i in rule['list']) {
                    const m = this._test(
                        rule['list'][i],
                        input,
                        [...index, i],
                        matches,
                        actions,
                        show
                    )
                    update(m)
                }
            } else {
                // TODO:
                update(0)
            }
        }
        if (Object.keys(this._ruleFnMap).indexOf(rule.type) != -1) {
            const ruleFn = this._ruleFnMap[rule.type as T]
            const inType = ruleFn.inputType
            if (inType && typeof inType == 'function') {
                if (!inType(input)) {
                    match = 0
                } else {
                    match = ruleFn?.fn(input, rule.value) ? 1 : 0
                }
            } else if (
                inType &&
                (inType != 'array'
                    ? typeof input != inType
                    : !Array.isArray(input))
            ) {
                match = 0
            } else {
                match = ruleFn?.fn(input, rule.value) ? 1 : 0
            }
        }
        if (match == 1) {
            const _index = [...index]
            let t = matches
            while (_index.length != 0) {
                const i = parseInt(_index.shift())
                if (typeof t[i] == 'undefined') {
                    t[i] = {
                        match: false,
                    }
                }
                t = t[i]
                if (_index.length == 0) {
                    t['match'] = true
                    if (typeof rule.action != 'undefined') {
                        t['action'] = rule.action
                        actions.push(rule.action)
                    }
                }
            }
        }
        if (show) {
            const _index = [...index]
            let t = matches
            let m: RuleLineStatus = match ? 1 : 0
            while (_index.length != 0) {
                const i = parseInt(_index.shift())
                if (typeof t[i] == 'undefined') {
                    line.update(m)
                    break
                }
                t = t[i]
                if (_index.length == 0) {
                    const sub = Object.keys(t).filter((key) => {
                        return key != 'match' && key != 'action'
                    })
                    if (sub.length == 0) {
                        line.update(m)
                        break
                    } else {
                        let matched = false
                        for (const key of sub) {
                            matched = matched || t[key]['match']
                        }
                        if (matched) {
                            line.update(m == 0 ? -1 : 2)
                        }
                    }
                }
            }
        }
        return match
    }
    exec(
        input: any,
        showPlot: boolean = false,
        lazyMatch: boolean = true
    ): {
        matches: Matches<A>
        action: A
    } {
        const rules: Rule<A, T>[] = [
            ...this._rules,
            {
                type: 'FINAL',
                action: this._final,
            },
        ]
        const matches = {} as Matches<A>
        const actions: A[] = []
        const lines: RuleLine<A, T>[] = showPlot ? [] : undefined
        if (showPlot && lazyMatch) {
            println(
                `lazyMatch will be disabled since showPlot has been enabled.`,
                'info'
            )
        }
        for (const i in rules) {
            this._test(rules[i], input, [i], matches, actions, lines)
            if (!showPlot && lazyMatch && actions.length > 0) {
                break
            }
        }
        if (showPlot) {
            println(
                lines
                    .map((line) => {
                        return line.toString()
                    })
                    .join('\n')
            )
        }
        return {
            matches,
            action: actions.shift(),
        }
    }
}

export { config }
export { Rule, RuleFn, RuleFnMap }
export { RuleEngine, RuleCheckError }
