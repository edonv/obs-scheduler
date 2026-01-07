# obs-scheduler

A CLI for scheduling actions in OBS.

## Install

```shell
npm install -g obs-scheduler
```

## Usage

```shell
Usage: obs-scheduler [options]

Options:
  -V, --version                    output the version number
  -c, --config <file-path>         config file path
  -i, --ip-address [address:port]  OBS Websocket IP address and port
  -p, --password [password]        OBS Websocket password
  -h, --help                       display help for command
```

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
