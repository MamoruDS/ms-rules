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
let action

action = rule.exec({
    id: '1234567890',
    message: 'something contains word_2',
}).action
console.log(action) // HIDE

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
