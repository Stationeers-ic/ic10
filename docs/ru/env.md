# Инструкция по созданию YAML файла для Stationeers

## Общая структура файла

Файл должен содержать следующие основные разделы:
- `version` - версия схемы (всегда 1)
- `chips` - массив микросхем
- `devices` - массив устройств
- `networks` - массив сетей

## Подробная инструкция по разделам

### 1. Версия (version)
```yaml
version: 1
```

### 2. Микросхемы (chips)
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

**Обязательные поля**: `id`

### 3. Устройства (devices)
```yaml
devices:
  - id: 1
    PrefabName: "StructureSolarPanel"
    name: "Main Solar Panel"
    chip: 1  # Ссылается на id чипа из раздела chips
    ports:
      - port: "Power Output"
        network: "power_network_1"  # Ссылается на id сети из раздела networks
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

**Обязательные поля**: `id`, `PrefabName`

**Важные связи**:
- `chip` - ссылается на `id` микросхемы из раздела `chips`
- `ports[].network` - ссылается на `id` сети из раздела `networks`

### 4. Сети (networks)
```yaml
networks:
  - id: "data_network_1"  # На этот id ссылаются устройства в своих портах
    type: "data"
    props:
      - name: "Channel0"
        value: 100
      - name: "Channel1"
        value: 200
```

**Обязательные поля**: `id`, `type`

## Полный пример файла

```yaml
version: 1

chips:
  - id: 1  # На этот id ссылается устройство с chip: 1
    register_length: 18
    stack_length: 512
    SP: 16
    RA: 17
    registers:
      - name: "r0"
        value: 0
      - name: "r1"
        value: 100
    stack: [0, 0, 0, 0, 0]
    code: "move r0 0\nmove r1 100"
    lineNumber: 0

devices:
  - id: 1
    PrefabName: "StructureConsoleLED1x2"
    name: "Main Solar"
    chip: 1  # Ссылка на чип с id: 1 выше
    ports:
      - port: "default"
        network: "data_main"  # Ссылка на сеть с id: "power_main"
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
        network: "data_main"  # Та же сеть - устройства соединены
    props:
      - name: "Setting"
        value: 750
    slots: []
    reagents: []

networks:
  - id: "data_main"  # На этот id ссылаются устройства в ports[].network
    type: "data"
    props:
      - name: "Channel0"
        value: 150
```

## Связи между разделами

```
chips[id] ← devices[chip]
networks[id] ← devices[ports][network]
```

## Важные замечания

1. Все `id` должны быть уникальными в пределах своих категорий
2. **Ссылочные связи**:
   - `devices[].chip` ссылается на `chips[].id`
   - `devices[].ports[].network` ссылается на `networks[].id`
3. Значения `PrefabName`, `port`, `name` (в props) должны быть из предоставленных списков
4. Для многострочного кода используйте `|` или `|-`
5. Массивы можно записывать как в строчку `[a, b, c]`, так и с переносами

Проверяйте корректность YAML с помощью онлайн-валидаторов перед использованием в игре.