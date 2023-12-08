import {Hardsuit} from "../src/devices/Hardsuit";
import {findDevice, hashStr} from "../src/Utils";
import {interpreterIc10, m, run} from "./utils";
import {DebugDevice} from "../src/devices/Device";
import {IcHousing} from "../src/devices/IcHousing";
import {keywordErrorMsg} from "../src/Ic10Error";
import InterpreterIc10 from "../src/main";

describe('general', () => {
    test('example code', () => {
        run({ device: new Hardsuit() })`
            alias velocityRelativeX r0
            alias velocityRelativeZ r1
            alias heading r2
            alias Suit db
            l velocityRelativeX Suit VelocityRelativeX
            l velocityRelativeZ Suit VelocityRelativeZ
            move heading 0
            atan2 heading velocityRelativeX velocityRelativeZ
            div heading heading 3.14
            mul heading heading 180
        `
    })

    test('float', () => {
        run({ connectedDevices: {
            d0: new DebugDevice(0, { Activate: 1 })
        } })`
            move r0 0
            move r1 0
            move r2 0.1
            l r3 d0 Activate
        `

        expect(m.reg("r0").value).toBe(0)
        expect(m.reg("r1").value).toBe(0)
        expect(m.reg("r2").value).toBe(0.1)
        expect(m.reg("r3").value).toBe(1)
    })

    test('alias and const', () => {
        run`
            define TEST 100
            alias reg r0
            move reg TEST
        `
        expect(interpreterIc10.memory.getRegister('r0').value).toBe(100)

    })

    test('example2', () => {
        run({
            connectedDevices: { d0: new DebugDevice(0, { Setting: 0, Vertical: 0 }) },
            breakWhen: s => s !== true,
            maxLines: 100
        })`
                move r0 5
                slt r15 r0 5
                beqz r15 if0exit
                s d0 Setting 0
            if0exit:
                move r15 80
                move r14 15
                jal update
                move r13 r0
                move r12 0
                jal update2
                jr 13
            update:
                alias b r15
                alias a r14
                s d0 Setting b
                s d0 Vertical a
                j ra
            update2:
                alias b r13
                alias c r12
                s d0 Setting b
                s d0 Vertical a
                j ra
        `

        expect(m.dev("d0").properties.Setting).toBe(5)
    })

    test('hash', () => {
        run({ device: new IcHousing() })`
            s db Setting HASH("sorter 1")
        `

        expect(m.dev("db").get("Setting")).toBe(hashStr("sorter 1"))
    })

    test('chanel', () => {
        run`
            s db:4 Channel0 HASH("test")
            l r0 db:4 Channel0
        `

        expect(m.reg("r0").value).toBe(hashStr("test"))
    })

    test('define error', () => {
        expect(() => {
            run`
                define pi 4
            `

        }).toThrow(keywordErrorMsg('constant'))
    })

    test('log system', () => {
        run`
            move r0 4
            #log r0
        `

        expect(interpreterIc10.output.log.length > 0).toBe(true)
    })

    test('findDevice', () => {
        const a = findDevice('StructureSmallSatelliteDish')
        const b = findDevice(-2138748650)
        expect(a.PrefabHash).toBe(b.PrefabHash)
    })

    test('const', () => {
        run`
            move r0 pi
            define pia 3.14
        `
        expect(m.reg("r0").value).toBe(3.14159265358979)
        expect(m.val("pia")).toBe(3.14)
    })

    test('connectDevice', () => {
        const ic10 = new InterpreterIc10()
        ic10.connectDevice('d0',hashStr("StructureAdvancedPackagingMachine"),2,{},{reagents:{
            Contents:{
                Copper:5
            }
            }})
        expect(ic10.memory.getDevice("d0").properties.PrefabHash).toBe(hashStr("StructureAdvancedPackagingMachine"))
        expect(ic10.memory.getDevice("d0").name).toBe("StructureAdvancedPackagingMachine")
    })
    test('macro hash', () => {
        run({ device: new Hardsuit() })`
            move r0 HASH("bar")
        `
        expect(m.reg("r0").value).toBe(hashStr('bar'))

        run({ device: new Hardsuit() })`
            define test HASH("bar")
        `
        expect(m.findValue("test")).toBe(hashStr('bar'))
    })
})
