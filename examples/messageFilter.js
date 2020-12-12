const RuleEngine = require('../dist/main').RuleEngine
// const RuleEngine = require('ms-rules').RuleEngine

// ## Define your function map
const fnMap = {
    id: {
        fn: (input, value) => {
            if (typeof input == 'object' && !Array.isArray(input)) {
                return input['id'] == value
            }
            return false
        },
    },
    keyword: {
        fn: (input, value) => {
            if (
                typeof input == 'object' &&
                typeof input['message'] == 'string'
            ) {
                return input['message'].indexOf(value) != -1
            }
            return false
        },
    },
}

// ## Declare your rule engine
const rule = new RuleEngine(fnMap, 'PUSH')

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
