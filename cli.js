#!/usr/bin/env node

import { run } from "./dist/index.js";

import { program } from "commander";

program
    .name('obs-scheduler')
    .option(
        '-i, --ip-address [address:port]',
        'OBS Websocket IP address and port',
        undefined,
    )
    .option(
        '-p, --password [password]',
        'OBS Websocket password',
        undefined,
    )
    .option('-c, --config <file-path>', 'config file path')
    .version('0.1.2')
    .action(run);

await program.parseAsync(process.argv);
