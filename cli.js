#!/usr/bin/env node

import { run } from "./dist/index.js";

import { program } from "commander";

program
    .name('obs-scheduler')
    .version('0.0.0')
    .option('-c, --config <file-path>', 'config file path')
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
    .action(run);

await program.parseAsync(process.argv);
