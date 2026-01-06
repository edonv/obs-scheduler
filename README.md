# obs-scheduler

A CLI for scheduling actions in OBS.

## Examples

### Configuration File

```json
{
  "events": [
    {
      "name": "Example Event",
      "schedule_type": "date",
      "date": "2026-01-06T10:00",
      "action": "start_recording"
    }
  ]
}
```

## Notes

`config-schema.json` takes advantage of options and syntax from [`json-editor`](https://github.com/json-editor/json-editor) to allow for easy integration into a visual editor.
