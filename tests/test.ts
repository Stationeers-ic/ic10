import InterpreterIc10 from "../src/main";

const interpreterIc10 = new InterpreterIc10();

describe('test', () => {

	test('alias and move', () => {
		const code = `
alias heading r2
move heading 10
`
		interpreterIc10.init(code)
		while (interpreterIc10.prepareLine() === true){}

		expect(interpreterIc10.memory.cell('heading')).toBe(10)
	});

	test('example code', () => {
		const code = `
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
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
	});

	test('stack', () => {
		const code = `
move r0 1
move r1 2
push r0
push r1
push 7
push 32
push r17
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
	});

	test('rr1', () => {
		const code = `
move r0 2
move r2 4
move rr0 10
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
		expect(interpreterIc10.memory.cell('r2')).toBe(10)
	});

	test('write into device', () => {
		const code = `
s d0 Setting 8
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
		expect(interpreterIc10.memory.getCell('d0').get('Setting')).toBe(8)
	});

	test('read from device', () => {
		const code = `
s d0 Setting 15
l r1 d0 Setting
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
		expect(interpreterIc10.memory.cell('r1')).toBe(15)
	});

	test('read from device', () => {
		const code = `
s d0 Setting 15
l r1 d0 Setting
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
		expect(interpreterIc10.memory.cell('r1')).toBe(15)
	});

	test('float', () => {
		const code = `
move r0 0
move r1 0
move r2 0.1
l r3 d0 Activate
`
		interpreterIc10.init(code)
		for (let i = 0; i < code.split("\n").length; i++) {
			interpreterIc10.prepareLine()
		}
	});

	test('example2',  () => {
		const code = `
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
		interpreterIc10.init(code)
		while (interpreterIc10.prepareLine() === true){}
		expect(interpreterIc10.memory.environ.d0.properties.Setting).toBe(5)
	});

	test('HASH',  () => {
		const code = `
s d0 Setting 0
s d0 Setting HASH("H1")
`
		interpreterIc10.init(code)
		while (interpreterIc10.prepareLine() === true){}
		expect(interpreterIc10.memory.environ.d0.properties.Setting).toBe(-1)
	});
});
