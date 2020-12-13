import { config as CONF } from './main'

const println = (message: string = '', type?: 'info' | 'error') => {
    if (!CONF.silentMode) {
        const prefix =
            type == 'info'
                ? '[\x1b[37mINF\x1b[0m]'
                : type == 'error'
                ? '[\x1b[31mERR\x1b[0m]'
                : ''
        console.log(`${prefix} ${message}`)
    }
}

export { println }
