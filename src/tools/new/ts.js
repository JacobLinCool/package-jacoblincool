const { execSync } = require("child_process");
const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { resolve } = require("path");

function update_package_json() {
    const package_json = JSON.parse(readFileSync(resolve(process.cwd(), "package.json")));
    package_json.main = "lib/index.js";
    package_json.types = "lib/index.d.ts";
    package_json.files = ["lib"];
    package_json.scripts = {
        prepare: "npm run build && npm run docs",
        dev: "tsup --watch",
        build: "npm run format && tsup",
        docs: "typedoc ./src/",
        format: 'prettier --write "src/**/*.ts"',
        lint: "eslint .",
        test: "jest --coverage",
    };
    writeFileSync(resolve(process.cwd(), "package.json"), JSON.stringify(package_json, null, 4));
}

function add_ts_config() {
    writeFileSync(
        resolve(process.cwd(), "tsconfig.json"),
        JSON.stringify(
            {
                exclude: ["lib", "src/_tests", "tsup.config.ts"],
                compilerOptions: {
                    target: "es2020",
                    lib: ["es2020"],
                    module: "commonjs",
                    moduleResolution: "node",

                    rootDir: "./src",
                    outDir: "./lib",
                    declaration: true,

                    resolveJsonModule: true,
                    removeComments: true,
                    noEmitOnError: true,
                    esModuleInterop: true,
                    forceConsistentCasingInFileNames: true,
                    strict: true,
                    skipLibCheck: true,
                },
            },
            null,
            4
        )
    );
}

function add_tsup_config() {
    writeFileSync(
        resolve(process.cwd(), "tsup.config.js"),
        `
import { defineConfig } from "tsup";

export default defineConfig((options) => ({
    entry: ["src/index.ts"],
    outDir: "lib",
    target: "node14",
    format: ["cjs", "esm"],
    clean: true,
    splitting: false,
    // sourcemap: !options.watch,
    minify: !options.watch,
    dts: !options.watch,
}));`
    );
}

function add_jest_config() {
    writeFileSync(
        resolve(process.cwd(), "jest.config.js"),
        `
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
};`
    );
}

function add_prettier_config() {
    writeFileSync(
        resolve(process.cwd(), ".prettierrc"),
        JSON.stringify(
            {
                printWidth: 160,
                tabWidth: 4,
                useTabs: false,
                trailingComma: "all",
                semi: true,
                singleQuote: false,
            },
            null,
            4
        )
    );
}

function add_eslint_config() {
    writeFileSync(
        resolve(process.cwd(), ".eslintrc.js"),
        `
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
    rules: {
        "@typescript-eslint/explicit-module-boundary-types": ["error", { allowArgumentsExplicitlyTypedAsAny: true }],
    },
};`
    );

    writeFileSync(
        resolve(process.cwd(), ".eslintignore"),
        `
# don't lint node_modules
node_modules

# don't lint build output
lib

# ignore docs
docs

# ignore config files
.eslintrc.js
jest.config.js
# tsup.config.ts`
    );
}

function add_files() {
    mkdirSync(resolve(process.cwd(), "src", "_tests"), { recursive: true });
    writeFileSync(resolve(process.cwd(), "src", "index.ts"), "");
    writeFileSync(resolve(process.cwd(), "src", "_tests", "index.ts"), "");
}

function create_ts_project() {
    if (!existsSync(resolve(process.cwd(), "package.json"))) {
        // init
        execSync(`pnpm init -y`);

        // edit package.json
        update_package_json();
    }

    if (!existsSync(resolve(process.cwd(), "tsconfig.json"))) {
        // add tsconfig.json
        add_ts_config();
    }

    if (!existsSync(resolve(process.cwd(), "tsup.config.js"))) {
        // add tsup.config.js
        add_tsup_config();
    }

    if (!existsSync(resolve(process.cwd(), "jest.config.js"))) {
        // add jest.config.js
        add_jest_config();
    }

    if (!existsSync(resolve(process.cwd(), ".prettierrc"))) {
        // add .prettierrc
        add_prettier_config();
    }

    if (!existsSync(resolve(process.cwd(), ".eslintrc.js"))) {
        // add .eslintrc.js & .eslintignore
        add_eslint_config();
    }

    if (!existsSync(resolve(process.cwd(), "src"))) {
        // add files
        add_files();
    }

    // install dev dependencies
    execSync(
        `pnpm i -D typescript tsup typedoc prettier jest ts-jest eslint eslint-config-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin @types/node @types/jest`,
        { stdio: "inherit" }
    );

    // run prepare
    execSync(`pnpm run prepare`, { stdio: "inherit" });
}

module.exports = create_ts_project;
