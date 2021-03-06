# ms-rules

> Simple rule engine written in TS

[![npm](https://img.shields.io/npm/v/ms-rules.svg?style=flat-square)](https://www.npmjs.com/package/ms-rules) [![](https://img.shields.io/npm/v/ms-rules/beta?style=flat-square)](https://www.npmjs.com/package/ms-rules)

## Installation

```shell
npm i ms-rules
```

## Example

You can find full examples from [examples folder](https://github.com/MamoruDS/ms-rules/tree/main/examples).

### declare new rule engine

-   JS

    ```javascript
    const RuleEngine = require('ms-rules').RuleEngine

    const ACTIONS = ['ACTION_1', 'ACTION_2']

    // Define your function map
    const fnMap = {
        type1: {
            fn: (input, value) => {
                if (/* some conditions */) {
                    return true
                }
                return false
            },
        },
        type2: {
            fn: (input, value) => {
                if (/* some conditions */) {
                    return true
                }
                return false
            },
            valType: 'string', // optional value type check
            inputType: (input) => {
                // optional input type check
                return (/* some conditions */)
            }
        },
    }

    // Declare your rule engine
    const rule = new RuleEngine(fnMap, 'FINAL_ACTION')
    rule.actions = ACTIONS // optional action name checking
    ```

-   TS

    ```typescript
    import { RuleEngine } from 'ms-rules'

    const ACTIONS = ['ACTION_1', 'ACTION_2'] as const

    type RuleType = 'type1' | 'type2'
    type RuleAction = typeof ACTIONS[number]
    // type RuleAction = 'ACTION_1' | 'ACTION_2' // alternaitve

    // Define your function map
    const fnMap: RuleFnMap<RuleType> = {
        type1: {
            fn: (input: number, value: number) => {
                return input == (value || 0)
            },
        },
        type2: {
            fn: (input: { message: string }) => {
                return false
            },
            valType: 'string', // optional value type check
            inputType: (input) => {
                // optional input type check
                return (
                    typeof input == 'object' &&
                    typeof input['message'] == 'string'
                )
            },
        },
    }

    // Declare your rule engine
    const rule = new RuleEngine<RuleAction, RuleType>(fnMap, 'ACTION_2')
    rule.actions = ACTIONS // optional action name checking
    ```

### rule register

```javascript
rule.load({
    type: 'OR',
    action: 'ACTION_1',
    list: [
        {
            type: 'type1',
            value: -1,
        },
        {
            type: 'AND',
            list: [
                {
                    type: 'type2',
                    value: 'foo',
                },
                {
                    type: 'type2',
                    value: 'bar',
                },
            ],
        },
        {
            type: 'NOT',
            list: [
                {
                    type: 'type2',
                    value: 'something',
                },
            ],
        },
    ],
})
```

### test your rules

```javascript
rule.exec({
    message: 'something contains word_2',
})

rule.exec(500)
```

### Show plot in terminal

```javascript
rule.exec(
    {
        id: '12345671890',
        message: 'something contains word_2',
    },
    true,
    false
)
```

<p align="center">
  <img width="550px" src="https://raw.githubusercontent.com/MamoruDS/ms-rules/dev/static/Screen%20Shot%202020-12-13%20at%2011.43.22%20AM.png">
</p>

## Changelog

[link](https://github.com/MamoruDS/ms-rules/blob/main/CHANGELOG.md) of changelogs.

## License

MIT © MamoruDS
