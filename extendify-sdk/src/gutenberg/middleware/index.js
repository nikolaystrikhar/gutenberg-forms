import { hasRequiredPlugins } from './hasRequiredPlugins'
import { hasPluginsActivated } from './hasPluginsActivated'
import { needsPageReload } from './needsPageReload'
import { dispatch } from '@wordpress/data'

export const Middleware = (middleware = []) => {
    return {
        hasRequiredPlugins: hasRequiredPlugins,
        hasPluginsActivated: hasPluginsActivated,
        needsPageReload: needsPageReload,
        stack: [],
        async check(template) {
            for (const m of middleware) {
                let cb = await this[`${m}`](template)
                setTimeout(() => {
                    this.stack.push(cb.pass
                        ? cb.allow
                        : cb.deny)
                }, 0)
            }
        },
        reset() {
            this.stack = []

            // This is a bit hardcoded, and should probably add a cleanup functionality to each middleware
            const { setReloadRequirements } = dispatch('extendify-templates/data')
            setReloadRequirements({
                required: 0,
            })
        },
    }
}

export async function AuthorizationCheck(pipes) {
    const middleware = MiddlewareGenerator(pipes)
    while (true) {
        const result = await middleware.next()

        // TODO: Could probably have a check for errors here
        if (result.done) {
            break
        }
    }
}
export async function* MiddlewareGenerator(middleware) {
    for (const m of middleware) {
        yield await m()
    }
}
