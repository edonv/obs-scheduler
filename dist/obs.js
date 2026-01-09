/** @typedef {import('./config.js').ConfigEvent} ConfigEvent */

/**
 * Maps a `ConfigEvent` to an OBS Websocket request.
 * @param {ConfigEvent} event 
 * @returns {import("obs-websocket-js").RequestBatchRequest[]}
 */
export function convertEventToWebsocketRequest(event) {
    const requestID = event.action == 'obs_ws' && event.ws_request?.id
        ? event.ws_request.id
        : `${event.name ? event.name + '.' : ''}${event.action}`;

    switch (event.action) {
        case "start_stream":
            return [{
                requestID,
                requestType: 'StartStream',
            }];
        case "stop_stream":
            return [{
                requestID,
                requestType: 'StopStream',
            }];
        case "start_recording":
            return [{
                requestID,
                requestType: 'StartRecord',
            }];
        case "pause_recording":
            return [{
                requestID,
                requestType: 'PauseRecord',
            }];
        case "stop_recording":
            return [{
                requestID,
                requestType: 'StopRecord',
            }];
        case "advanced_scene_switcher":
            if (event.switcher_message) {
                return [{
                    requestID,
                    requestType: 'CallVendorRequest',
                    requestData: {
                        requestData: {
                            message: event.switcher_message,
                        },
                        requestType: "AdvancedSceneSwitcherMessage",
                        vendorName: "AdvancedSceneSwitcher",
                    },
                }];
            } else {
                return [];
            }
        case "obs_ws":
            if (event.ws_request) {
                return [{
                    requestID,
                    requestType: event.ws_request.type,
                    requestData: event.ws_request.data,
                }];
            } else {
                return [];
            }
    }
}
