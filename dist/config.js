import { DateTime } from "luxon";

/** @typedef {'date'|'recurring'} ConfigEventType */

/**
 * @typedef {'start_stream'|'stop_stream'|'start_recording'|'pause_recording'|'stop_recording'|'advanced_scene_switcher'|'obs_ws'} ConfigEventAction
 */

/**
 * @typedef {Object} OBSWSRequest
 * @property {string} type
 * @property {Object} data
 */

/**
 * @typedef {Object} ConfigEvent
 * @property {string} [name]
 * @property {boolean} [enabled=true]
 * @property {ConfigEventType} schedule_type
 * @property {string} [date] Only present if `schedule_type` is `'date'`.
 * @property {string} [schedule] Only present if `schedule_type` is `'recurring'`.
 * @property {ConfigEventAction} action
 * @property {string} [switcher_message] Only present if `action` is `'advanced_scene_switcher'`.
 * @property {OBSWSRequest} [ws_request] Only present if `action` is `'obs_ws'`.
 */

/**
 * @typedef {Object} Config
 * @property {ConfigEvent[]} events
 */

/**
 * 
 * @param {DateTime} date 
 * @param {ConfigEvent} event 
 * @returns {boolean}
 */
export function checkEventSchedule(date, event) {
    // Ignore a disabled event
    if (event.enabled == false) {
        return false;
    }

    if (event.date) { // If event has the `date` field
        // Parse event's date string to `DateTime`
        const eventDate = DateTime.fromISO(event.date);
        // Compare parsed date (rounded to the previous second) to the current `date`
        return eventDate.startOf('second').toMillis() == date.toMillis();
    } else if (event.schedule) { // If event has the `schedule` field
        return false;
    } else {
        return false;
    }
}
