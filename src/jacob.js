#!/usr/bin/env node
const fs = require("fs");
const { resolve } = require("path");
const chalk = require("chalk");
const { program } = require("commander");

program.version(`Version: ${chalk.yellowBright(require("../package.json").version)}`, "-V, -v", "output the current version");

program
    .command("new <type>")
    .description("setup a project")
    .addHelpText("after", chalk`\nAvailable types: {blueBright ts}`)
    .action((type) => {
        if (fs.existsSync(resolve(__dirname, "tools", "new", type + ".js"))) {
            require(resolve(__dirname, "tools", "new", type + ".js"))();
        } else {
            console.error(`unknown project type: ${type}`);
        }
    });

program
    .command("about")
    .description("about me")
    .action(() => {
        require(resolve(__dirname, "about", "index.js"))();
    });

program.parse();
