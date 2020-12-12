# ms-rules

> Simple rule engine written in TS

![npm](https://img.shields.io/npm/v/ms-rules.svg?style=flat-square)

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
    ```

-   TS

    ```typescript
    import { RuleEngine } from 'ms-rules'

    type RuleType = 'type1' | 'type2'
    type RuleAction = 'ACTION_1' | 'ACTION_2'

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

## License

MIT © MamoruDS
