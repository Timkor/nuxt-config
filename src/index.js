
import path from 'path';

const defaultOptions = {
    dir: '/config'
};

export default function (moduleOptions) {

    // Merge options:
    const options = {
        defaultOptions,
        ...this.options.polyfill,
        ...moduleOptions
    }
}