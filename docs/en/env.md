# Stationeers YAML File Creation Guide

## General File Structure

The file must contain the following main sections:
- `version` - schema version (always 1)
- `chips` - array of microchips
- `devices` - array of devices
- `networks` - array of networks

## Detailed Section Instructions

### 1. Version
```yaml
version: 1
```

### 2. Chips
```yaml
chips:
  - id: 1
    register_length: 10
    stack_length: 20
    SP: 0
    RA: 0
    registers:
      - name: "r0"
        value: 0
      - name: "r1"
        value: 1
    stack: [0, 0, 0, 0]
    code: |
      move r0 0
      move r1 1
    lineNumber: 0
```

**Required fields**: `id`

### 3. Devices
```yaml
devices:
  - id: 1
    PrefabName: "StructureSolarPanel"
    name: "Main Solar Panel"
    chip: 1  # References chip id from chips section
    ports:
      - port: "Power Output"
        network: "power_network_1"  # References network id from networks section
    props:
      - name: "PowerGeneration"
        value: 150
    slots:
      - index: 0
        item: "ItemSolarPanel"
        amount: 1
    reagents:
      - name: "Silicon"
        amount: 50
```

**Required fields**: `id`, `PrefabName`

**Important references**:
- `chip` - references `id` of a chip from the `chips` section
- `ports[].network` - references `id` of a network from the `networks` section

### 4. Networks
```yaml
networks:
  - id: "data_network_1"  # This id is referenced by devices in their ports
    type: "data"
    props:
      - name: "Channel0"
        value: 100
      - name: "Channel1"
        value: 200
```

**Required fields**: `id`, `type`

## Complete File Example

```yaml
version: 1

chips:
  - id: 1  # Referenced by device with chip: 1
    register_length: 18
    stack_length: 512
    SP: 16
    RA: 17
    registers:
      - name: "r0"
        value: 100
      - name: "r1"
        value: 0
    stack: [0, 0, 0, 0, 0]
    code: "move r0 0\nmove r1 100"
    lineNumber: 0

devices:
  - id: 1
    PrefabName: "StructureConsoleLED1x2"
    name: "Main Solar"
    chip: 1  # Reference to chip with id: 1 above
    ports:
      - port: "default"
        network: "data_main"  # Reference to network with id: "power_main"
    props:
      - name: "Setting"
        value: 150
    slots: []
    reagents: []

  - id: 2
    PrefabName: "StructureConsoleLED1x2"
    name: "Backup Battery"
    ports:
      - port: "default"
        network: "data_main"  # Same network - devices are connected
    props:
      - name: "Setting"
        value: 750
    slots: []
    reagents: []

networks:
  - id: "data_main"  # This id is referenced by devices in ports[].network
    type: "data"
    props:
      - name: "Channel0"
        value: 150
```

## Cross-Section References

```
chips[id] ← devices[chip]
networks[id] ← devices[ports][network]
```

## Important Notes

1. All `id` values must be unique within their respective categories
2. **Reference relationships**:
   - `devices[].chip` references `chips[].id`
   - `devices[].ports[].network` references `networks[].id`
3. Values for `PrefabName`, `port`, `name` (in props) must come from provided lists
4. For multi-line code use `|` or `|-`
5. Arrays can be written inline `[a, b, c]` or with line breaks

Validate YAML correctness using online validators before using in-game.