# Instruction for Creating Environment Files for Stationeers-ic10

## General File Structure

The file should contain the following main sections:
- `$schema` - validation schema reference (optional)
- `version` - schema version (currently 1)
- `chips` - array of microchips
- `devices` - array of devices
- `networks` - array of networks

## Detailed Section Instructions

### 1. Schema and Version ($schema and version)
```json
{
  "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
  "version": 1
}
```

### 2. Microchips (chips)
```json
{
  "chips": [
    {
      "id": 1,
      "register_length": 18,
      "stack_length": 512, 
      "SP": 16, 
      "RA": 17, 
      "registers": [
        {"name": "r0", "value": 0},
        {"name": "r1", "value": 1}
      ],
      "stack": [0, 0, 0, 0],
      "code": "move r0 0\nmove r1 1",
      "lineNumber": 0
    }
  ]
}
```

**Required fields**: `id`

**Optional fields**:
- `register_length` - number of registers (minimum value: 0) (for mod support)
- `stack_length` - stack size (minimum value: 0) (for mod support)
- `SP` - stack pointer (for mod support)
- `RA` - return address register (for mod support)
- `registers` - array of registers (format: `r0`, `r1`, ..., `rN`)
- `stack` - array of stack values
- `code` - program code (multiline, use `\n`)
- `lineNumber` - current execution line (minimum value: 0)

### 3. Devices (devices)

#### Device Types:

**Regular Devices (DeviceSchema)**:
```json
{
  "devices": [
    {
      "id": 1,
      "PrefabName": "StructureSolarPanel",
      "name": "Main Solar Panel",
      "ports": [
        {
          "port": "Power Output",
          "network": "power_network_1"
        }
      ],
      "props": [
        {"name": "PowerGeneration", "value": 150}
      ],
      "slots": [
        {
          "index": 0,
          "item": "ItemSolarPanel",
          "amount": 1
        }
      ],
      "reagents": [
        {
          "name": "Silicon",
          "amount": 50
        }
      ]
    }
  ]
}
```

**Devices with Microchips (HousingSchema)**:
```json
{
  "devices": [
    {
      "id": 2,
      "PrefabName": "StructureConsoleLED1x2",
      "name": "Control Panel",
      "chip": 1,
      "pins": [
        {
          "pin": "d0",
          "device": 1
        }
      ],
      "ports": [
        {
          "port": "default",
          "network": "data_network_1"
        }
      ],
      "props": [
        {"name": "Setting", "value": 150}
      ]
    }
  ]
}
```

**Required fields**: `id`, `PrefabName`

**For Housing devices required**: `chip`

**Valid port types**:
- `"default"`, `"Chute Input"`, `"Chute Output"`, `"Chute Output 2"`
- `"Connection"`, `"Data Input"`, `"Data Output"`
- `"Landing Pad Input"`, `"Pipe Input"`, `"Pipe Input 2"`
- `"Pipe Liquid Input"`, `"Pipe Liquid Input 2"`, `"Pipe Liquid Output"`, `"Pipe Liquid Output 2"`
- `"Pipe Output"`, `"Pipe Output 2"`, `"Pipe Waste"`
- `"Power Input"`, `"Power Output"`
- `"Power and Data Input"`, `"Power and Data Output"`

**Pin format**: `"d0"`, `"d1"`, ..., or `"dN"` for arbitrary numbers

### 4. Networks (networks)
```json
{
  "networks": [
    {
      "id": "data_network_1",
      "type": "data",
      "props": [
        {"name": "Channel0", "value": 100},
        {"name": "Channel1", "value": 200}
      ]
    }
  ]
}
```

**Required fields**: `id`, `type`

**Valid network types**: `"data"`, `"power"`, `"chute"`, `"pipe"`, `"wireless"`, `"landing"`

**Channel properties**: names must start with `"Channel"` (Channel0, Channel1, etc.)

## Complete File Example

```json
{
  "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
  "version": 1,
  "chips": [
    {
      "id": 1,
      "register_length": 18,
      "stack_length": 512,
      "SP": 16,
      "RA": 17,
      "registers": [
        {"name": "r0", "value": 100},
        {"name": "r1", "value": 0}
      ],
      "stack": [0, 0, 0, 0, 0],
      "code": "move r0 0\nmove r1 100",
      "lineNumber": 0
    }
  ],
  "devices": [
    {
      "id": 1,
      "PrefabName": "StructureSolarPanel",
      "name": "Main Solar Panel",
      "ports": [
        {
          "port": "Power Output",
          "network": "power_main"
        }
      ],
      "props": [
        {"name": "PowerGeneration", "value": 150}
      ],
      "slots": [
        {
          "index": 0,
          "item": "ItemSolarPanel",
          "amount": 1
        }
      ],
      "reagents": [
        {
          "name": "Silicon",
          "amount": 50
        }
      ]
    },
    {
      "id": 2,
      "PrefabName": "StructureCircuitHousingCompact",
      "name": "Housing",
      "chip": 1,
      "pins": [
        {
          "pin": "d0",
          "device": 1
        }
      ],
      "ports": [
        {
          "port": "default",
          "network": "data_main"
        }
      ],
      "props": [
        {"name": "Setting", "value": 750}
      ]
    }
  ],
  "networks": [
    {
      "id": "data_main",
      "type": "data",
      "props": [
        {"name": "Channel0", "value": 150}
      ]
    },
    {
      "id": "power_main",
      "type": "power"
    }
  ]
}
```

## Inter-Section Relationships

```
chips[id] ← devices[chip] (only for Housing devices)
networks[id] ← devices[ports][network]
devices[id] ← devices[pins][device] (only for Housing devices)
```

## Important Notes

1. **Identifier Uniqueness**:
   - All `id` in `chips` must be unique
   - All `id` in `devices` must be unique
   - All `id` in `networks` must be unique

2. **Reference Relationships**:
   - `devices[].chip` references `chips[].id` (only for Housing)
   - `devices[].ports[].network` references `networks[].id`
   - `devices[].pins[].device` references `devices[].id` (only for Housing)

3. **Value Validation**:
   - All numeric IDs must be ≥ 0
   - Item counts in slots must be ≥ 1
   - Reagent amounts must be ≥ 1
   - Register names must follow format `r0`, `r1`, etc.

4. **Supported Values**:
   - `PrefabName` must be from list of valid prefabs
   - `item` in slots must be from list of valid items
   - `name` in reagents must be from list of valid reagents
   - `port` must be from list of valid port types

5. **Code Formatting**: For multiline code in chips, use `\n` characters for line breaks
