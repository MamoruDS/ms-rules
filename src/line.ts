import * as CONST from './constant'
import { RuleLineStatus } from './types'

class RuleLine<A extends string, T extends string> {
    private type: T | CONST.TYPE_RESERVED
    private action: A
    private value: any
    private indent: number
    private size: number = 4
    private status: RuleLineStatus = 0
    constructor(
        type: T | CONST.TYPE_RESERVED,
        action: A,
        indent: number,
        value?: any
    ) {
        this.type = type
        this.value = value
        this.action = action
        this.indent = indent
    }
    private _prefix(): string {
        return ' '.repeat(this.size).repeat(this.indent)
    }
    private _type(): string {
        const { cs, cp } = this._color()
        return this._highlight(` ${this.type} `, cp, cs)
    }
    private _action(): string {
        const { cs, cp, tint } = this._color()
        return this.action
            ? this._highlight(` ${this.action}`, undefined, tint, '1')
            : ''
    }
    private _value(): string {
        const { cs, cp } = this._color()
        return this.value
            ? this._highlight(` ${this.value} `, '0', undefined, undefined)
            : ''
    }
    private _highlight(
        input: string,
        bg?: string,
        fg?: string,
        style?: string
    ) {
        return `${bg ? `\x1b[4${bg}m` : ''}${fg ? `\x1b[3${fg}m` : ''}${
            style ? `\x1b[${style}m` : ''
        }${input}\x1b[0m`
    }
    private _color() {
        const s = this.status
        return {
            cp:
                s == -1
                    ? '1' // -1
                    : s == 0
                    ? undefined // 0
                    : s == 1
                    ? '4' // 1
                    : undefined, //2
            cs:
                s == -1
                    ? undefined // -1
                    : s == 0
                    ? undefined // 0
                    : s == 1
                    ? undefined // 1
                    : '4', // 2
            tint:
                s == -1
                    ? '1' // -1
                    : s == 0
                    ? undefined // 0
                    : s == 1
                    ? '4' // 1
                    : '4', // 2
        }
    }
    update(status: RuleLineStatus): void {
        this.status = status
    }
    toString(): string {
        return `${this._prefix()}${this._type()}${this._value()}${this._action()}`
    }
}

export { RuleLine }
