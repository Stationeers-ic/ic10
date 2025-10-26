# Инструкция по созданию файла Окружения для Stationeers-ic10

## Общая структура файла

Файл должен содержать следующие основные разделы:
- `$schema` - ссылка на схему валидации (опционально)
- `version` - версия схемы (пока что 1)
- `chips` - массив микросхем
- `devices` - массив устройств
- `networks` - массив сетей

## Подробная инструкция по разделам

### 1. Схема и версия ($schema и version)
```json
{
  "$schema": "https://raw.githubusercontent.com/Stationeers-ic/ic10/refs/heads/main/src/Schemas/env.schema.json",
  "version": 1
}
```

### 2. Микросхемы (chips)
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

**Обязательные поля**: `id`

**Опциональные поля**:
- `register_length` - количество регистров (минимальное значение: 0)  (для поддержки модов)
- `stack_length` - размер стека (минимальное значение: 0)  (для поддержки модов)
- `SP` - указатель стека (для поддержки модов)
- `RA` - регистр возврата (для поддержки модов)
- `registers` - массив регистров (формат: `r0`, `r1`, ..., `rN`)
- `stack` - массив значений стека
- `code` - код программы (многострочный, используйте `\n`)
- `lineNumber` - текущая строка выполнения (минимальное значение: 0)

### 3. Устройства (devices)

#### Типы устройств:

**Обычные устройства (DeviceSchema)**:
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

**Устройства с микросхемой (HousingSchema)**:
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

**Обязательные поля**: `id`, `PrefabName`

**Для Housing устройств обязательно**: `chip`

**Допустимые типы портов**:
- `"default"`, `"Chute Input"`, `"Chute Output"`, `"Chute Output 2"`
- `"Connection"`, `"Data Input"`, `"Data Output"`
- `"Landing Pad Input"`, `"Pipe Input"`, `"Pipe Input 2"`
- `"Pipe Liquid Input"`, `"Pipe Liquid Input 2"`, `"Pipe Liquid Output"`, `"Pipe Liquid Output 2"`
- `"Pipe Output"`, `"Pipe Output 2"`, `"Pipe Waste"`
- `"Power Input"`, `"Power Output"`
- `"Power and Data Input"`, `"Power and Data Output"`

**Формат пинов**: `"d0"`, `"d1"`, ..., или `"dN"` для произвольных номеров

### 4. Сети (networks)
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

**Обязательные поля**: `id`, `type`

**Допустимые типы сетей**: `"data"`, `"power"`, `"chute"`, `"pipe"`, `"wireless"`, `"landing"`

**Свойства каналов**: имена должны начинаться с `"Channel"` (Channel0, Channel1, etc.)

## Полный пример файла

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

## Связи между разделами

```
chips[id] ← devices[chip] (только для Housing устройств)
networks[id] ← devices[ports][network]
devices[id] ← devices[pins][device] (только для Housing устройств)
```

## Важные замечания

1. **Уникальность идентификаторов**:
   - Все `id` в `chips` должны быть уникальными
   - Все `id` в `devices` должны быть уникальными
   - Все `id` в `networks` должны быть уникальными

2. **Ссылочные связи**:
   - `devices[].chip` ссылается на `chips[].id` (только для Housing)
   - `devices[].ports[].network` ссылается на `networks[].id`
   - `devices[].pins[].device` ссылается на `devices[].id` (только для Housing)

3. **Валидация значений**:
   - Все числовые ID должны быть ≥ 0
   - Количество предметов в слотах ≥ 1
   - Количество реагентов ≥ 1
   - Имена регистров должны соответствовать формату `r0`, `r1`, etc.

4. **Поддерживаемые значения**:
   - `PrefabName` должен быть из списка допустимых префабов
   - `item` в слотах должен быть из списка допустимых предметов
   - `name` в реагентах должен быть из списка допустимых реагентов
   - `port` должен быть из списка допустимых типов портов

5. **Форматирование кода**: Для многострочного кода в микросхемах используйте символы `\n` для переносов строк
