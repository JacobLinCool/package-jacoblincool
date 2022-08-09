#!/usr/bin/env node
import { readFileSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";
import { program, Command } from "commander";
import about from "./about";
import create_project from "./tools/new";

const package_json = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf8"));

program.version(chalk`Version: {yellowBright ${package_json.version}}`, "-V, -v", "output the current version");

const commands: {
    [key: string]: Command;
} = {};

program
    .command("new")
    .argument("[type]", "type of project")
    .description("setup a project")
    .action(async (type?: string) => {
        await create_project(type);
    });

commands.about = program
    .command("about")
    .option("-s, --speed <speed>", chalk`print speed {yellowBright 0.1} ~ {yellowBright 100000}`, "100")
    .description("Print informations about me.")
    .action(async () => {
        let delay = 100 / parseInt(commands.about.opts().speed);
        if (delay < 0) {
            delay = 0.001;
        }
        if (delay > 1000) {
            delay = 1000;
        }
        await about(delay);
    });

program.parse();
