import { RuleEngine } from '../src/main'
// import { RuleEngine } from 'ms-rules'
import { RuleFnMap } from '../src/main'
// import { RuleFnMap } from 'ms-rules'

const actions = ['PUSH', 'DISCARD'] as const

type RuleType = 'id' | 'keyword'
type RuleAction = typeof actions[number]

const _: RuleAction = 'PUSH'

// ## Define your function map
const fnMap: RuleFnMap<RuleType> = {
    id: {
        fn: (input: { id: string }, value: string) => {
            return input?.id == value
        },
    },
    keyword: {
        fn: (input: { message: string }, value: string) => {
            return (input?.message ?? '').indexOf(value) != -1
        },
    },
}

// ## Declare your rule engine
const rule = new RuleEngine<RuleAction, RuleType>(fnMap, 'PUSH')
rule.actions = [...actions]

// ## Load your rules
rule.load({
    type: 'AND',
    action: 'DISCARD',
    list: [
        {
            type: 'id',
            value: '1234567890',
        },
        {
            type: 'OR',
            list: [
                {
                    type: 'keyword',
                    value: 'word_1',
                },
                {
                    type: 'keyword',
                    value: 'word_2',
                },
                {
                    type: 'keyword',
                    value: 'word_3',
                },
                {
                    type: 'NOT',
                    list: [
                        {
                            type: 'keyword',
                            value: 'blocked_word',
                        },
                    ],
                },
            ],
        },
    ],
})

// ## Test your rules
let action: string

action = rule.exec({
    id: '1234567890',
    message: 'something contains word_2',
}).action
console.log(action) // DISCARD

action = rule.exec({
    id: '1234567890',
    message: 'bonjour',
}).action
console.log(action) // PUSH

action = rule.exec(
    {
        id: '0987654321',
        message: 'something contains word_3',
    },
    false // disable lazyMatch (optional)
).action
console.log(action) // PUSH

// ### Show match plot in terminal
rule.exec(
    {
        id: '12345671890',
        message: 'something contains word_2',
    },
    true,
    false
)
