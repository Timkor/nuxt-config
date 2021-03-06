import path from 'path';

import { listFiles } from './utils/files';
import { normalizeModuleOptions } from './utils/module';
import { createProxyInterceptor } from './utils/proxy';
import { mergeArray, mergeObject } from './utils/merge';
import { typeEquals } from './utils/types';

const defaultOptions = {
    configDir: 'config'
};

export default async function (moduleOptions) {
    
    // Save a copy of the initial modules array for later:
    const initialModules = Array.from(this.options.modules).map(normalizeModuleOptions);

    // Merge options:
    const options = {
        ...defaultOptions,
        ...this.options.config,
        ...moduleOptions
    };

    const configDir = path.resolve(this.options.srcDir, options.configDir);

    // Get all files in the config folder:
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
    
    const optionsProxy = createProxyInterceptor(this.options, key => {

        // This function is called whenever a property is accessed from the nuxt configuration.

        
        // Check if there is a config file for this key:
        const entry = entries.find(entry => entry.key === key)
        
        if (entry) {
            
            // Early load required config:
            loadConfig(entry);
        }
    });

    // Keep track of the load stack, so that we can detect circulair dependencies:
    const loadStack = [];

    const loadConfig = (entry) => {

        if (!entry.isLoaded) {

            if (loadStack.includes(entry.key)) {
                console.warn(`Can not early load '${entry.path}' because of a circulair dependency`);
                return;
            }

            // Keep track of callstack of load:
            loadStack.push(entry.key);

            var data =  entry.exports.default;

            if (typeof data === 'function') {
                data = data.call(null, optionsProxy);
            }
            
            // Apply merge strategies:
            if (Array.isArray(this.options[entry.key]) && Array.isArray(data)) {
                
                this.options[entry.key] = mergeArray(this.options[entry.key], data);
            
            } else if (typeEquals('object', this.options[entry.key], data)) {
                
                this.options[entry.key] = mergeObject(this.options[entry.key], data);

            } else {
                // No merge strategy, so just assign: 
                this.options[entry.key] = data;
            }

            entry.isLoaded = true;

            // Keep track of callstack of load:
            loadStack.pop();
        }
    };

    entries.forEach(entry => loadConfig(entry));

    // Require newly added modules:
    const mergedModules = Array.from(this.options.modules).map(normalizeModuleOptions); 

    const newModules = mergedModules.filter(mergedModule => typeof initialModules.find(initialModule => initialModule.src === mergedModule.src) === 'undefined'); 
    
    await Promise.all(newModules.map(module => this.requireModule(module)));
}