# Stationeers JSON File Creation Guide

## General File Structure

The file should contain the following main sections:
- `$schema` - validation schema reference (optional)
- `version` - schema version (always 1)
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
      "register_length": 10,
      "stack_length": 20,
      "SP": 0,
      "RA": 0,
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

### 3. Devices (devices)
```json
{
  "devices": [
    {
      "id": 1,
      "PrefabName": "StructureSolarPanel",
      "name": "Main Solar Panel",
      "chip": 1,
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

**Required fields**: `id`, `PrefabName`

**Important relationships**:
- `chip` - references `id` of a microchip from the `chips` section
- `ports[].network` - references `id` of a network from the `networks` section

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
      "PrefabName": "StructureConsoleLED1x2",
      "name": "Main Solar",
      "chip": 1,
      "ports": [
        {
          "port": "default",
          "network": "data_main"
        }
      ],
      "props": [
        {"name": "Setting", "value": 150}
      ],
      "slots": [],
      "reagents": []
    },
    {
      "id": 2,
      "PrefabName": "StructureConsoleLED1x2",
      "name": "Backup Battery",
      "ports": [
        {
          "port": "default",
          "network": "data_main"
        }
      ],
      "props": [
        {"name": "Setting", "value": 750}
      ],
      "slots": [],
      "reagents": []
    }
  ],
  "networks": [
    {
      "id": "data_main",
      "type": "data",
      "props": [
        {"name": "Channel0", "value": 150}
      ]
    }
  ]
}
```

## Relationships Between Sections

```
chips[id] ← devices[chip]
networks[id] ← devices[ports][network]
```

## Important Notes

1. All `id` values must be unique within their respective categories
2. **Reference relationships**:
   - `devices[].chip` references `chips[].id`
   - `devices[].ports[].network` references `networks[].id`
3. Values for `PrefabName`, `port`, `name` (in props) must be from the provided lists
4. For multi-line code, use `\n` or `\r\n` for line breaks