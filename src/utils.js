function sleep(ms = 1000, val = undefined) {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

function format_kv(pairs_obj, split = " : ") {
    const max_key_length = Math.max(...Object.keys(pairs_obj).map((k) => k.length));
    return Object.entries(pairs_obj).map(([key, val]) => `${key.padEnd(max_key_length)}${split}${val}`);
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function typing(text, delay = 1) {
    for (const char of text) {
        process.stdout.write(char);
        await sleep(delay);
    }
}

module.exports = { sleep, format_kv, shuffle, typing };
