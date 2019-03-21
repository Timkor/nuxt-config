



export function createProxyInterceptor(object, callback) {
    
    return new Proxy(object, {
        get(target, key) {
            
            callback(key);

            return target[key];
        }
    });
}