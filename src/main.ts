import * as CONST from './constant'
import { Rule, RuleFn, RuleFnMap, Path, RuleCheckError } from './types'

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
                  ` at line:${path[0].lineNr}\n\tpath: ${[...path]
                      .reverse()
                      .map((p) => {
                          return p.type
                      })
                      .join('/')}`
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
            e(`[ERR] Missing property 'action' of rule`)
        }
        if (CONST.TYPE_SINGLE.indexOf(rule.type) != -1) {
        } else if (CONST.TYPE_GROUP.indexOf(rule.type) != -1) {
            if (typeof rule.list == 'undefined') {
                e(`[ERR] Missing property 'list' of rule group`)
            }
            if (
                rule.list.length >
                CONST.LEN_LIMIT[rule.type as CONST.TYPE_GROUP]
            ) {
                e(`[ERR] Number of rules in group exceeds the limit`)
            }
            for (const r of rule.list) {
                const res = this._check(r, path)
                if (res.error) {
                    e(res.errorMsg, false)
                }
            }
        } else if (Object.keys(this._ruleFnMap).indexOf(rule.type) != -1) {
            // TODO: check value
        } else {
            e(`[ERR] Unknown type '${rule.type}'`)
        }
        path.shift()
        return res
    }
    load(rule: Rule<A, T>): void {
        try {
            this._check(rule)
        } catch (e) {
            if (e instanceof RuleCheckError) {
                console.error(e.message)
                return
            } else {
                throw e
            }
        }
        this._rules.push(rule)
    }
    private _test(
        rule: Rule<A, T>,
        input: any,
        index: string[],
        matches: object,
        actions: A[]
    ) {
        let match: number
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
                        actions
                    )
                    update(m)
                }
            } else {
                // TODO:
                update(0)
            }
        }
        if (Object.keys(this._ruleFnMap).indexOf(rule.type) != -1) {
            match = this._ruleFnMap[rule.type as T]?.fn(input, rule.value)
                ? 1
                : 0
        }
        if (match == 1) {
            const _index = [...index]
            let t = matches
            while (_index.length != 0) {
                const i = _index.shift()
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
        return match
    }
    exec(input: any): A {
        const rules: Rule<A, T>[] = [
            ...this._rules,
            {
                type: 'FINAL',
                action: this._final,
            },
        ]
        const matches = {}
        const actions: A[] = []
        for (const i in rules) {
            this._test(rules[i], input, [i], matches, actions)
        }
        return actions.shift()
    }
}

export { Rule, RuleFn, RuleFnMap }
export { RuleEngine }
