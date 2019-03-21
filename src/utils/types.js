export function typeEquals(type, ...objects) {
    return objects.every(object => typeof object === type);
}