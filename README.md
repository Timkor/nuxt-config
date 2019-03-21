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
```javascript
export default (config) => {
    
    // Read bar
    const bar = config.bar; // This will trigger to import ~/config/bar.js
}
```


`~/config/bar.js`:
```javascript
export default (config) => {
    
    // Read foo
    const foo = config.foo; // This will trigger to import ~/config/foo.js
}
```

This is not possible. So what happens now is:
 - `~/config/bar.js` is executed
   - `config.foo` is read
   - This triggers `~/config/foo.js`
     - `config.bar` is read
     - Circulair dependency is detected and a warning is thrown.
     - `foo` continues and `config.bar` is still undefined
   - `config.foo` is equal to the result of `~/config/foo.js`
   - `~/config/bar.js` is continued.
   
## What needs to be done:
The circulair dependency warning is now:
```
Can not early load '~/config/foo.js' because of a circulair dependency
```

It would be nice to have a descriptive warning which tells:
 - what is wrong
 - how it can be fixed
 
This can be achieved by implementing a dependency tree.
