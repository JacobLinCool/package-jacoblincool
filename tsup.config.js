import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/jacob.ts"],
    outDir: "lib",
    target: "node14",
    format: ["cjs", "esm"],
    clean: true,
    splitting: false,
    // sourcemap: !options.watch,
    minify: !options.watch,
    dts: !options.watch,
}));
