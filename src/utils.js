function sleep(ms = 1000, val = undefined) {
    return new Promise((resolve) => setTimeout(() => resolve(val), ms));
}

module.exports = { sleep };
