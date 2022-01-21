import type { PairObject } from "./types";

function sleep<T>(ms = 1000, val?: T): Promise<T | undefined> {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

function format_kv(pairs_obj: PairObject, split = " : "): string[] {
    const max_key_length = Math.max(...Object.keys(pairs_obj).map((k) => k.length));
    return Object.entries(pairs_obj).map(([key, val]) => `${key.padEnd(max_key_length)}${split}${val}`);
}

function shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function typing(text: string, delay = 1): Promise<void> {
    const once = delay > 1 ? 1 : Math.floor(1 / delay);
    for (let i = 0; i < text.length; i += once) {
        process.stdout.write(text.substring(i, i + once));
        await sleep(delay);
    }
}

// data object deep merge
function merge_object(target: { [key: string]: unknown }, source: { [key: string]: unknown }): { [key: string]: unknown } {
    const merged = JSON.parse(JSON.stringify(target));

    for (const key in source) {
        if (typeof source[key] === "object" && !Array.isArray(source[key])) {
            merged[key] = merge_object(merged[key] || {}, source[key] as { [key: string]: unknown });
        } else {
            merged[key] = source[key];
        }
    }

    return merged;
}

function clear_write(text: string): void {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(text);
}

export { sleep, format_kv, shuffle, typing, merge_object, clear_write };
