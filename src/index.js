

import path from 'path';
import { listFiles } from './utils/files';

const defaultOptions = {
    configDir: 'config'
};

export default function (moduleOptions) {

    // Merge options:
    const options = {
        ...defaultOptions,
        ...this.options.config,
        ...moduleOptions
    };

    const configDir = path.resolve(this.options.srcDir, options.configDir);

    return listFiles(configDir)
        
        .then((files) => {
            
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
            
            console.log(promises);
            // Await promises:
            Promise.all(promises)
                .then(entries => {

                    console.log(entries);

                    return entries;
                });
        })
        .catch(error => {
            console.warn(error);
        })
}