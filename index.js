#!/usr/bin/env node

const readline = require("readline");
var fs = require('fs');
const utils = require('util');
const ncp = require('ncp').ncp;
const glob = require('glob');
const { exec } = require("child_process");
const ncu = require('npm-check-updates');
const process = require('process');

ncp.limit = 16;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = str =>
  new Promise(resolve => {
    rl.question(`${str}: `, (answer) => {resolve(answer)});
  });

const readFile = utils.promisify(fs.readFile);
const writeFile = utils.promisify(fs.writeFile);
const copyDir = utils.promisify(ncp);
const getFiles = utils.promisify(glob);
const run = utils.promisify(exec);

async function askQuestions(libName) {
    const library = libName || await question("Library name?");
    const description = await question("Description? ['']") || '';
    const author = await question("Author? ['']") || '';

    return { library, description, author, year: new Date().getFullYear() };
}

async function getTempalteFiles(answers) {
    return await getFiles(`./${answers.library}/**`, { nodir: true });
}

async function writeToTemplate(answers, files) {
    for (f of files) {
        const data = await readFile(f, 'utf8');
        let result = data;
        for ([name, value] of Object.entries(answers)) {
            result = result.replace(new RegExp(`\{${name}\}`, 'g'), value);
        }

        await writeFile(f, result, 'utf8');
    }
}

async function main(libName) {
    try {
        const answers = await askQuestions(libName);
        if (!answers.library) {
            console.error("Must provide library name");
            rl.close();
            return;
        }

        await copyDir(`${__dirname}/templates`, answers.library);
        await writeToTemplate(answers, await getTempalteFiles(answers));
        process.chdir(answers.library);

        const upgraded = await ncu.run({
            jsonUpgraded: true,
            packageManager: 'npm',
            silent: true,
            upgrade: true
        });

        console.log('dependencies upgraded to:', upgraded);
        await run (`git init`);
        console.log("Running npm install ...")
        await run (`npm install`);
        console.log(`Done! library created: ${answers.library}`)
    } catch(e) {
        console.log("unexpected Error!");
        console.log(e);
    } finally {
        rl.close();
    }
}

main(process.argv[2]);
