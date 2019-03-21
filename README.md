# nuxt-config
Nuxt Module for splitting your nuxt.config.js into multiple files.

## Features
 - File based Nuxt configuration.
 - Support for exported Object, Array or Function (accepting current config).
 - Dynamic ordering of executing exported functions using a Proxy.
 - Modules in `~/config/modules.js` will be added to Nuxt dynamically.
 
## Examples:

`~/config/env.js`:
```javascript

// Support for object
export default (config) => {
    return {
        quickBuild: true,
        sentryDSN: '...'
    }
}
```

`~/config/build.js`:
```javascript

// Support for function:
// Because of {env} this module will first import ~/config/env.js
export default ({env}) => {
    
    
    return {
        
        hardSource: env.quickBuild,

        extend(config, ctx) {
            
        }
    }
}
```

`~/config/plugins.js`:
```javascript
export default [
  '~/plugins/google-analytics.js'
]
```

## Known issues
There is still one problem: circulair dependencies. If you would have two config functions:

`~/config/foo.js`:
export default (config) => {
    
    // Read bar
    const bar = config.bar; // This will trigger to import ~/config/bar.js
}


`~/config/bar.js`:
export default (config) => {
    
    // Read foo
    const foo = config.foo; // This will trigger to import ~/config/foo.js
}

