"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRM = exports.isBM = exports.isChannel = exports.isConst = exports.isFunction = exports.isDeviceParameter = exports.isSlotParameter = void 0;
const valuesSlotParameter = ['ChargeRatio', 'Class', 'Damage', 'Efficiency', 'Growth', 'Health', 'Mature', 'MaxQuantity', 'OccupantHash', 'Occupied', 'Seeding', 'SortingClass'];
const isSlotParameter = (val) => valuesSlotParameter.includes(val);
exports.isSlotParameter = isSlotParameter;
const valuesDeviceParameter = ['Activate', 'AirRelease', 'Bpm', 'Charge', 'ClearMemory', 'CollectableGoods', 'Color', 'Combustion', 'CombustionInput', 'CombustionLimiter', 'CombustionOutput', 'CombustionOutput2', 'CompletionRatio', 'ElevatorLevel', 'ElevatorSpeed', 'Error', 'ExportCount', 'Filtration', 'Flush', 'ForceWrite', 'Fuel', 'HASH("name")', 'Harvest', 'Horizontal', 'Idle', 'ImportCount', 'InterrogationProgress', 'LineNumber', 'Lock', 'Maximum', 'MineablesInQueue', 'MineablesInVicinity', 'Minimum', 'MinimumWattsToContact', 'Mode', 'NextWeatherEventTime', 'On', 'Open', 'Output', 'Plant', 'PositionX', 'PositionY', 'PositionZ', 'Power', 'PowerActual', 'PowerGeneration', 'PowerPotential', 'PowerRequired', 'PrefabHash', 'Pressure', 'PressureAir', 'PressureExternal', 'PressureInput', 'PressureInternal', 'PressureOutput', 'PressureOutput2', 'PressureSetting', 'PressureWaste', 'Quantity', 'Ratio', 'RatioCarbonDioxide', 'RatioCarbonDioxideInput', 'RatioCarbonDioxideOutput', 'RatioCarbonDioxideOutput2', 'RatioNitrogen', 'RatioNitrogenInput', 'RatioNitrogenOutput', 'RatioNitrogenOutput2', 'RatioNitrousOxide', 'RatioNitrousOxideInput', 'RatioNitrousOxideOutput', 'RatioNitrousOxideOutput2', 'RatioOxygen', 'RatioOxygenInput', 'RatioOxygenOutput', 'RatioOxygenOutput2', 'RatioPollutant', 'RatioPollutantInput', 'RatioPollutantOutput', 'RatioPollutantOutput2', 'RatioVolatiles', 'RatioVolatilesInput', 'RatioVolatilesOutput', 'RatioVolatilesOutput2', 'RatioWater', 'RatioWaterInput', 'RatioWaterOutput', 'RatioWaterOutput2', 'Reagents', 'RecipeHash', 'RequiredPower', 'ReturnFuelCost', 'Rpm', 'Setting', 'SignalID', 'SignalStrength', 'SizeX', 'SizeZ', 'SolarAngle', 'SolarIrradiance', 'SoundAlert', 'Stress', 'TargetPadIndex', 'TargetX', 'TargetY', 'TargetZ', 'Temperature', 'TemperatureExternal', 'TemperatureInput', 'TemperatureOutput', 'TemperatureOutput2', 'TemperatureSetting', 'Throttle', 'Time', 'TotalMoles', 'TotalMolesInput', 'TotalMolesOutput', 'TotalMolesOutput2', 'VelocityMagnitude', 'VelocityRelativeX', 'VelocityRelativeY', 'VelocityRelativeZ', 'Vertical', 'Volume', 'WattsReachingContact'];
const isDeviceParameter = (val) => valuesDeviceParameter.includes(val);
exports.isDeviceParameter = isDeviceParameter;
const valuesFunction = ['abs', 'acos', 'add', 'alias', 'and', 'asin', 'atan', 'atan2', 'bap', 'bapal', 'bapz', 'bapzal', 'bdns', 'bdnsal', 'bdse', 'bdseal', 'beq', 'beqal', 'beqz', 'beqzal', 'bge', 'bgeal', 'bgez', 'bgezal', 'bgt', 'bgtal', 'bgtz', 'bgtzal', 'ble', 'bleal', 'blez', 'blezal', 'blt', 'bltal', 'bltz', 'bltzal', 'bna', 'bnaal', 'bnan', 'bnaz', 'bnazal', 'bne', 'bneal', 'bnez', 'bnezal', 'brap', 'brapz', 'brdns', 'brdse', 'breq', 'breqz', 'brge', 'brgez', 'brgt', 'brgtz', 'brle', 'brlez', 'brlt', 'brltz', 'brna', 'brnan', 'brnaz', 'brne', 'brnez', 'ceil', 'cos', 'debug', 'define', 'div', 'exp', 'floor', 'hcf', 'j', 'jal', 'jr', 'l', 'lb', 'lbn', 'lbns', 'lbs', 'log', 'lr', 'ls', 'max', 'min', 'mod', 'move', 'mul', 'nor', 'or', 'peek', 'pop', 'push', 'rand', 'return', 'round', 's', 'sap', 'sapz', 'sb', 'sbn', 'sbs', 'sdns', 'sdse', 'select', 'seq', 'seqz', 'sge', 'sgez', 'sgt', 'sgtz', 'sin', 'sle', 'sleep', 'slez', 'slt', 'sltz', 'sna', 'snan', 'snanz', 'snaz', 'sne', 'snez', 'sqrt', 'ss', 'stack', 'sub', 'tan', 'trunc', 'xor', 'yield'];
const isFunction = (val) => valuesFunction.includes(val);
exports.isFunction = isFunction;
const valuesConst = ['deg2rad', 'nan', 'ninf', 'pi', 'pinf', 'rad2deg'];
const isConst = (val) => valuesConst.includes(val);
exports.isConst = isConst;
const valuesChannel = ['Channel0', 'Channel1', 'Channel2', 'Channel3', 'Channel4', 'Channel5', 'Channel6', 'Channel7'];
const isChannel = (val) => valuesChannel.includes(val);
exports.isChannel = isChannel;
const valuesBM = ['Average', 'Maximum', 'Minimum', 'Sum'];
const isBM = (val) => valuesBM.includes(val);
exports.isBM = isBM;
const valuesRM = ['Contents', 'Recipe', 'Required'];
const isRM = (val) => valuesRM.includes(val);
exports.isRM = isRM;
//# sourceMappingURL=icTypes.js.map