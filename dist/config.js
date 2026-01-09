import CronExpressionParser from "cron-parser";
import { DateTime } from "luxon";

/** @typedef {'date'|'recurring'} ConfigEventType */

/**
 * @typedef {'start_stream'|'stop_stream'|'start_recording'|'pause_recording'|'stop_recording'|'advanced_scene_switcher'|'obs_ws'} ConfigEventAction
 */

/**
 * @typedef {Object} OBSWSRequest
 * @property {string} [id]
 * @property {string} type
 * @property {Object} data
 */

/**
 * @typedef {Object} ConfigEvent
 * @property {string} [name]
 * @property {boolean} [enabled=true]
 * @property {ConfigEventType} schedule_type
 * @property {string|string[]} [date] Only present if `schedule_type` is `'date'`.
 * @property {string|string[]} [schedule] Only present if `schedule_type` is `'recurring'`.
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
        /** @type {string[]} */
        let datesToCompare = new Array();
        if (typeof event.date == 'string') {
            datesToCompare.push(event.date);
        } else {
            datesToCompare.push(...event.date);
        }
        
        return datesToCompare.some((eventDate) => {
            // Parse event's date string to `DateTime`
            const eventDateTime = DateTime.fromISO(eventDate);
            // console.log(eventDate.getTime(), date.getTime())
            // Compare parsed date (rounded to the previous second) to the current `date`
            return eventDateTime.startOf('second').toMillis() == date.toMillis();
        });
    } else if (event.schedule) { // If event has the `schedule` field
        /** @type {string[]} */
        let schedulesToCompare = new Array();
        if (typeof event.schedule == 'string') {
            schedulesToCompare.push(event.schedule);
        } else {
            schedulesToCompare.push(...event.schedule);
        }

        return schedulesToCompare.some((eventSchedule) => {
            try {
                // Parse crontab string
                const schedule = CronExpressionParser.parse(eventSchedule);
                // Return if the parsed schedule includes the current `date`
                return schedule.includesDate(date.toJSDate());
            } catch (error) {
                // If parse fails, return `false`
                return false;
            }
        });
    } else {
        return false;
    }
}
