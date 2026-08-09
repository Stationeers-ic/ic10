# IC10 Language Support for VS Code

Extension for Stationeers IC10 programming language.

## Features

- **Syntax Highlighting** - Full IC10 grammar support
- **Linting** - Real-time error diagnostics
- **Autocompletion** - Instructions, registers, devices, constants
- **Debugging** - Breakpoints, step-through, variable inspection
- **Snippets** - Common patterns and templates

## Usage

1. Install the extension
2. Open any `.ic10` file
3. Use F5 to debug, or Ctrl+Shift+P for commands

## Snippets

Type prefix and press Tab:

- `loop` - Main loop template
- `device` - Device setup
- `set` - Set device property
- `hash` - Hash a string
- `compare` - Compare and store

## Debugging

1. Set breakpoints by clicking the gutter
2. Press F5 to start debugging
3. Use stepping controls to navigate

## Commands

- `IC10: Validate File` - Validate current file

## Development

```bash
# Install dependencies
npm install

# Compile
npm run compile

# Watch mode
npm run watch

# Package extension
npx vsce package
```

## Requirements

- VS Code 1.85.0 or newer
- Node.js 18 or newer
