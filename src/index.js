import path from 'path';

import { listFiles } from './utils/files';
import { mergeOptions } from './utils/merge';

const defaultOptions = {
    configDir: 'config'
};

function mergeObject(...objects) {
    return Object.assign({}, ...objects);
}

function mergeArray(...arrays) {
    return [].concat.apply([], arrays);
}

function typeEquals(type, ...objects) {
    return objects.every(object => typeof object === type);
}

export default async function (moduleOptions) {

    // Merge options:
    const options = {
        ...defaultOptions,
        ...this.options.config,
        ...moduleOptions
    };

    const configDir = path.resolve(this.options.srcDir, options.configDir);

    
    const files = await listFiles(configDir);
        
            
    const promises = files
                
        // Filter JavaScript files:
        .filter(file => path.extname(file) === '.js')

        // Get key and path info:
        .map(file => {
            return {
                key: path.basename(file, '.js'),
                path: '~/' + path.relative(this.options.srcDir, file).replace(/\\/g, '/'),
                file
            }
        })

        // Create promises of import results:
        .map(entry => {
            return import(entry.file).then(exports => {
                return {
                    ...entry,
                    exports
                };
            })
        })
    ;
    
    // Await promises:
    const entries = await Promise.all(promises);
    
    console.log(entries);

    const optionsProxy = new Proxy(this.options, {
        get(target, key) {
            console.log('access ' + key)
            // Early load required config:
            const entry = entries.find(entry => entry.key === key)
            
            if (entry) {
                loadConfig(entry);
            }

            return target[key];
        }
    });

    const loadStack = [];
    const loadConfig = (entry) => {

        if (!entry.isLoaded) {

            if (loadStack.includes(entry.key)) {
                console.warn(`Can not early load ${entry.key} because of a circulair dependency`);
                return;
            }

            loadStack.push(entry.key);
            console.log('Load ' + entry.path);

            var data =  entry.exports.default;

            if (typeof data === 'function') {
                data = data.call(null, optionsProxy);
            }
            
            // Apply merge strategies:
            if (typeEquals('object', this.options[entry.key], data)) {
                
                this.options[entry.key] = mergeObject(this.options[entry.key], data);

            } else if (typeEquals('array', this.options[entry.key], data)) {
                
                this.options[entry.key] = mergeArray(this.options[entry.key], data);
            
            } else {
                // No merge strategy, so just assign: 
                this.options[entry.key] = data;
            }

            entry.isLoaded = true;

            loadStack.pop();
        }
    };

    entries.forEach(entry => loadConfig(entry));
}