#!/usr/bin/env node


import { program, Command } from "commander";

program
    .name('obs-scheduler')
    .option('-c, --config <file-path>', 'config file path')
    .option('-i, --ip-address <address:port>', 'OBS Websocket IP address and port', undefined)
    .option('-p, --password [password]', 'OBS Websocket password')

await program.parseAsync(process.argv);
