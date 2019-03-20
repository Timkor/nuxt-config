import fs from 'fs';
import path from 'path';

export function listFiles(dir) {

    return new Promise((resolve, reject) => {

        try {
            const files = fs.readdirSync(dir).reduce((files, file) => {
                const name = path.join(dir, file);
                const isDirectory = fs.statSync(name).isDirectory();
                return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
            }, []);

            resolve(files);
        } catch (e) {
            reject(e);
        }
    });
}