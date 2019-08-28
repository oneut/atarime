export function isNull<T>(item: T | null): item is T {
    return item === null;
}

export function isNotNull<T>(item: T | null): item is T {
    return item !== null;
}