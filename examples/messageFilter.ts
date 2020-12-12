import { RuleEngine } from '../src/main'
// import { RuleEngine } from 'ms-rules'
import { RuleFnMap } from '../src/main'
// import { RuleFnMap } from 'ms-rules'

type RuleType = 'id' | 'keyword'
type RuleAction = 'HIDE' | 'PUSH'

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

// ## Load your rules
rule.load({
    type: 'AND',
    action: 'HIDE',
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
            ],
        },
    ],
})

// ## Test your rules
let res
res = rule.exec({
    id: '1234567890',
    message: 'something contains word_2',
})
console.log(res) // HIDE

res = rule.exec({
    id: '1234567890',
    message: 'bonjour',
})
console.log(res) // PUSH

res = rule.exec({
    id: '0987654321',
    message: 'something contains word_3',
})
console.log(res) // PUSH
