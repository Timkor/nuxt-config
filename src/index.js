
import fs from 'fs';
import path from 'path';

const defaultOptions = {
    dir: 'config'
};

function getAllFiles (dir) {

    return fs.readdirSync(dir).reduce((files, file) => {
        const name = path.join(dir, file);
        const isDirectory = fs.statSync(name).isDirectory();
        return isDirectory ? [...files, ...getAllFiles(name)] : [...files, name];
    }, []);
}

export default function (moduleOptions) {

    // Merge options:
    const options = {
        defaultOptions,
        ...this.options.config,
        ...moduleOptions
    };

    console.log(this.srcDir);
}