

export function mergeOptions(options, key, data) {
    console.log('Merge ' + key)
    if (typeof options[key] !== 'object') {
        options[key] = data;
    } else {
        Object.assign(options[key], data);    
    }
} 