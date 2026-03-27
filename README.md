# Deimos Stop Button

Adds a **Stop Agent** button to the Agent Zero chat input toolbar, allowing users to immediately terminate running agent tasks.

**Plugin ID:** `deimos_stop_button`
**License:** Apache 2.0

## Features

- One-click agent termination from the chat interface
- Injects into the chat input bottom actions bar (before the nudge button)
- Resets pause state after stopping
- Toast notifications for stop status
- Confirm dialog before stopping to prevent accidental termination

## Installation

1. Place in `usr/plugins/deimos_stop_button/`
2. Enable in the Plugin List (`⊞ extension` icon in sidebar)
3. Hard-refresh the page

## File Structure

```text
deimos_stop_button/
├── plugin.yaml                                          # Plugin manifest
├── plugin.json                                          # Legacy manifest (kept for compatibility)
├── LICENSE                                              # Apache 2.0
├── README.md
├── api/
│   └── stop.py                                          # POST /api/plugins/deimos_stop_button/stop
├── extensions/
│   └── webui/
│       └── chat-input-bottom-actions-start/
│           └── stop-button.html                         # UI button injection
└── webui/
    └── stop-store.js                                    # Alpine store for stop logic
```

## API Endpoint

`POST /api/plugins/deimos_stop_button/stop`

**Request:**
```json
{ "context": "<context_id>" }
```

**Response:**
```json
{
  "message": "Agent stopped successfully.",
  "was_running": true,
  "stopped": true
}
```

## How It Works

1. HTML extension injects a stop button into the chat input actions bar (positioned before the nudge button via `x-move-before="#nudges_window"`)
2. Button click triggers a confirm dialog, then the Alpine store's `stopAgent()` method
3. Store sends `POST` to `/api/plugins/deimos_stop_button/stop`
4. API handler kills the agent process and resets pause state
5. Toast notification confirms the stop

## Failure Modes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Button not appearing in toolbar | Plugin disabled or extension point not rendering | Enable plugin in Plugin List, hard-refresh |
| Click has no effect / 404 in console | API route mismatch (old `stop-button` vs `deimos_stop_button`) | Verify `stop-store.js` uses `/api/plugins/deimos_stop_button/stop` |
| JS module import error in console | Import path references old `stop-button` name | Verify `stop-button.html` imports from `/plugins/deimos_stop_button/webui/stop-store.js` |
| Button appears but agent keeps running | `kill_process()` called but task completes before kill lands | This is a race condition on very short tasks — expected behaviour |
| Pause state not reset after stop | Alpine `chatInput` store not available at stop time | Non-critical — page refresh clears state |
| `$store.stopButton` undefined | Store module not loaded (import failed) | Check browser console for module load errors; verify JS import path |

## Gotchas

- **Name mismatch:** The plugin directory is `deimos_stop_button` (underscore). The original external repo used `stop-button` (hyphen). All internal references (import paths, API routes, plugin.yaml, plugin.json) must use `deimos_stop_button`.
- **Confirm dialog:** The stop button uses `$confirmClick` which requires the confirm dialog extension to be loaded. If the dialog does not appear, stop fires immediately — this is safe but may be unexpected.
- **x-move-before:** The button is positioned using `x-move-before="#nudges_window"`. If the nudge button is removed from the toolbar in a future framework update, the stop button will fall back to its natural position in the extension slot.

## Requirements

- Agent Zero v2.x

## License

Apache 2.0 — see [LICENSE](LICENSE)
