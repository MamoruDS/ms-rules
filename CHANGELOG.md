# Changelog

## 1.0.1

### Added

-   export `RuleCheckError`
-   added global config `silentMode`
-   show rule match plot in terminal
    ![](https://raw.githubusercontent.com/MamoruDS/ms-rules/dev/static/Screen%20Shot%202020-12-13%20at%2011.43.22%20AM.png)

### Changed

-   new parameters `haltOnceFailed` and `log` to method `RuleEngine.load`
-   new parameters `lazyMatch` and `showPlot` to method `RuleEngine.exec`
-   modified return of method `RuleEngine.load` from `void` to `errMsgs as string[]`
-   modified return of method `RuleEngine.exec` from `Action as string` to
    ```typescript
    {
        matches: {
            [key in MatchKey]: key extends 'match'
                ? boolean
                : key extends 'action'
                ? A
                : Matches<A>
        }
        action: A // final action, also origin return of method `RuleEngine.exec`
    }
    // example:
    {
        '0': {
            '0': { match: true },
            '1': {
                '1': {
                    match: true,
                },
                match: true,
            },
            match: true,
            action: 'ACTION_0A',
        },
        '1': { match: true, action: 'ACTION_00' },
    }
    ```

## 1.0.0
