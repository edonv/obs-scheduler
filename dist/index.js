import * as fs from 'node:fs';
import { setInterval } from 'node:timers/promises';

import { checkEventSchedule } from './config.js';
import { convertEventToWebsocketRequest } from './obs.js';

import { OBSWebSocket } from "obs-websocket-js";
import { DateTime } from 'luxon';

/** @typedef {import('./config.js').Config} Config */

/**
 * @this {import("commander").Command}
 */
export async function run() {
    const {
        ipAddress,
        password,
        config: configPath
    } = this.opts();

    // Connect to OBS-WS
    const obs = new OBSWebSocket();

    try {
        await obs.connect(
            ipAddress ? `ws://${ipAddress}` : undefined,
            password,
        );
    } catch (error) {
        console.error('Failed to connect to OBS.', error.code, error.message);
        process.exit(1);
    }

    /** @type {Config} */
    let config = {};

    function updateConfigFromFile() {
        const fileContents = fs.readFileSync(configPath, "utf8")
            .replace(/^[ \t]*\/\/.+$\n/gm, '');
        config = JSON.parse(fileContents);
    }

    // Read config file for initial value
    updateConfigFromFile();

    // Watch config file for changes
    fs.watchFile(configPath, { interval: 1000 }, updateConfigFromFile);

    // Forever, every second, check if current time matches an event in the config
    for await (const start of setInterval(1000, Date.now())) {
        const date = DateTime.now().startOf('second');

        const matchingEvents = config.events
            .filter(e => checkEventSchedule(date, e));

        const wsRequests = matchingEvents
            .flatMap(convertEventToWebsocketRequest);

        await obs.callBatch(wsRequests, {
            haltOnFailure: false,
        });
    }
}
