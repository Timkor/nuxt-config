

export function mergeObject(...objects) {
    return Object.assign({}, ...objects);
}

export function mergeArray(...arrays) {
    return [].concat.apply([], arrays);
}