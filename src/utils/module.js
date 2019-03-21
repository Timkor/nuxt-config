

export function normalizeModuleOptions(moduleOptions) {
    if (typeof moduleOptions === 'object') {
        return {
            src: moduleOptions.src,
            options: moduleOptions.options
        };
    } else if (typeof moduleOptions === 'string') {
        return {
            src: moduleOptions,
            options: {}
        };
    } else if (Array.isArray(moduleOptions)) {
        const [src, options] = moduleOptions;
        return {
            src,
            options
        };
    }

    throw new Error('Incorrect module specification ' + moduleOptions);
}