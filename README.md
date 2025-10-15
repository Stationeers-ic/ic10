# IC10 Emulator & Development Toolkit

[![npm version](https://img.shields.io/npm/v/ic10.svg)](https://www.npmjs.com/package/ic10)
[![npm downloads](https://img.shields.io/npm/dm/ic10.svg)](https://www.npmjs.com/package/ic10)
[![npm bundle size](https://badgen.net/bundlephobia/min/ic10)](https://www.npmjs.com/package/ic10)
[![GitHub stars](https://img.shields.io/github/stars/Stationeers-ic/ic10.svg)](https://github.com/Stationeers-ic/ic10/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Stationeers-ic/ic10.svg)](https://github.com/Stationeers-ic/ic10/network/members)
[![GitHub issues](https://img.shields.io/github/issues/Stationeers-ic/ic10.svg)](https://github.com/Stationeers-ic/ic10/issues)
[![GitHub license](https://img.shields.io/github/license/Stationeers-ic/ic10.svg)](https://github.com/Stationeers-ic/ic10/blob/master/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Stationeers-ic/ic10/publish.yml)](https://github.com/Stationeers-ic/ic10/actions)
<!-- [![Coverage](https://img.shields.io/codecov/c/github/Stationeers-ic/ic10.svg)](https://codecov.io/gh/Stationeers-ic/ic10) -->
[![Last Commit](https://img.shields.io/github/last-commit/Stationeers-ic/ic10.svg)](https://github.com/Stationeers-ic/ic10/commits/main)
[![Translation status](https://weblate.traineratwot.site/widget/ic10/ic10-lib/svg-badge.svg)](https://weblate.traineratwot.site/engage/ic10/)
[![Stationeers](https://img.shields.io/badge/Stationeers-IC10-blue.svg)](https://store.steampowered.com/app/544550/Stationeers/)
[![Bun](https://img.shields.io/badge/runtime-Bun-000.svg)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/lang-TypeScript-blue.svg)](https://www.typescriptlang.org/)


This project is an IC10 emulator (programming language for the game Stationeers) with a complete toolkit for development, testing, and code generation.

## 🚀 Features

- **Full IC10 Emulation** - Execute IC10 code with support for all instructions
- **TypeScript Type Generation** - Automatic generation of types for devices, instructions, and constants
- **Device System** - Typed classes for all in-game devices
- **Development Tools** - Automatic code generation, index files, and configurations
- **Testing** - Comprehensive test system with VSCode support
- **Watch Mode** - Automatic rebuild on source code changes

## 🏗️ Project Structure

```tree
src/
├── Core/                 # Base classes (Device, Housing, Network, Slot, Stack)
├── Defines/             # Generated constants and definitions
├── Devices/             # Auto-generated device classes
├── Ic10/                # IC10 emulator core
│   ├── Context/         # Execution contexts (Real, Sandbox)
│   ├── Instruction/     # IC10 instruction implementations
│   ├── Lines/           # Code line processing
│   └── SandBox.ts       # Execution sandbox
tests/                   # Tests
tools/                   # Generation scripts and utilities
samples/                 # IC10 code examples
```

## 🛠️ Installation & Setup

### Prerequisites
- [Bun](https://bun.sh) (required)
- IDE with TypeScript support (VSCode recommended)

### Installation
```bash
git clone <repository-url>
cd ic10
bun install
```

### Development
```bash
# Run in development mode with file watching
bun run dev

# Run tests
bun test

# Full project rebuild
bun run upgrade
```

## 📋 package.json Scripts

### Main Commands
- `dev` - Development mode with file watching
- `build` - Full project build
- `test` - Run tests
- `upgrade` - Full data update and regeneration

### Code Generation
- `download` - Download latest data from server
- `generate-device` - Generate device classes
- `generate:index` - Update index files
- `generate-intruction-index` - Generate instruction index
- `generate-vscode` - Update VSCode configuration

### Code Quality
- `lint` - Code checking with Biome
- `fix` - Automatic problem fixing
- `format` - Code formatting

## 🔧 Development Process

### 1. Project Initialization
```bash
bun run upgrade
```

This script performs:
- Downloading current device, instruction, and constant data
- Generating TypeScript types and classes
- Creating index files
- Updating VSCode configuration

### 2. Development Mode
```bash
bun run dev
```

The `whatch.ts` script monitors changes and automatically:
- Regenerates index files when sources change
- Updates devices when definitions change
- Rebuilds instruction index when instruction classes change

### 3. Creating a New Instruction

1. Create a class in `src/Ic10/Instruction/`
2. Inherit from the base Instruction class
3. Implement the `tests()` method for testing
4. The system will automatically detect and add the instruction

### 4. Testing
```bash
# Run all tests
bun test

# Run specific test
bun test tests/ic10/main.test.ts

# Show executed tests
bun run show
```

## 🎯 Using the Emulator
comming soon

## 🔄 Code Generation System

### Device Generation (`generate-devices.ts`)
- Analyzes device data from API
- Creates typed TypeScript classes
- Groups devices by base types (Housing, Structure, Item)
- Generates index files for export

### Instruction Generation (`generate-intruction-index.ts`)
- Automatically discovers instruction classes
- Creates instruction map for quick access
- Generates TypeScript types for instruction names

### VSCode Update (`generate-vscode.ts`)
- Collects instruction test information
- Updates launch.json for debugging
- Provides autocompletion for instruction names

## 📊 Change Monitoring

The `whatch.ts` system provides:
- **Debounce mechanism** - Prevents multiple rebuilds
- **Selective regeneration** - Only necessary parts on change
- **Template support** - Different scripts for different file types
- **Unnecessary file ignoring** - Prevents cyclic rebuilds

## 🧪 Testing

The project uses a comprehensive testing system:
- Unit tests for individual components
- Integration tests for the IC10 emulator
- Instruction tests with automatic discovery
- JUnit format report generation

## 🔧 Configuration

### VSCode
- Autocompletion for IC10 instructions
- Debug configuration for tests
- Biome integration for linting

### Biome
- Code formatting
- TypeScript linting
- Automatic problem fixing

### Vite
- Library building
- TypeScript type generation
- ESM and CommonJS support

## 🏛 Used Libraries

### exact-ic10-math (by Aidan647)
- Porting mathematical and bitwise functions from the Game (C#) to Typescript
- **Acknowledgments**: Aidan647 for creating the exact math library that provides full calculation compatibility with Stationeers game

### Other Key Libraries
- **crc-32** - Checksum calculation for device operations
- **uuid** - Unique identifier generation for emulator entities
- **axios** - HTTP client for data downloading
- **vite** - Modern project build system
- **biome** - Code formatting and linting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes
4. Add tests
5. Ensure all tests pass
6. Create a Pull Request

### Code Standards
- Use `bun run fix` before commit
- Follow Biome code style
- Add tests for new functionality
- Update documentation when necessary

## 📝 Useful Commands

```bash
# Quick project check
bun run fix

# Formatting only
bun run format

# Formatting check
bun run format:check

# Run specific generation script
bun run generate-device
```

<!-- ## 📄 License

Project distributed under [license specified in package.json]. -->