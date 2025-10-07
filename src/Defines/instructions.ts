export const INSTRUCTIONS = {
	abs: {
		description: "Register = the absolute value of a",
		example: "abs r? a(r?|num)",
		name: "abs",
	},
	acos: {
		description: "Returns the cosine of the specified angle (radians)",
		example: "acos r? a(r?|num)",
		name: "acos",
	},
	add: {
		description: "Register = a + b.",
		example: "add r? a(r?|num) b(r?|num)",
		name: "add",
	},
	alias: {
		description:
			"Labels register or device reference with name, device references also affect what shows on the screws on the IC base.",
		example: "alias str r?|d?",
		name: "alias",
	},
	and: {
		description:
			"Performs a bitwise logical AND operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If both bits are 1, the resulting bit is set to 1. Otherwise the resulting bit is set to 0.",
		example: "and r? a(r?|num) b(r?|num)",
		name: "and",
	},
	asin: {
		description: "Returns the angle (radians) whos sine is the specified value",
		example: "asin r? a(r?|num)",
		name: "asin",
	},
	atan: {
		description: "Returns the angle (radians) whos tan is the specified value",
		example: "atan r? a(r?|num)",
		name: "atan",
	},
	atan2: {
		description: "Returns the angle (radians) whose tangent is the quotient of two specified values: a (y) and b (x)",
		example: "atan2 r? a(r?|num) b(r?|num)",
		name: "atan2",
	},
	bap: {
		description: "Branch to line d if abs(a - b) &lt;= max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8)",
		example: "bap a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "bap",
	},
	bapal: {
		description: "Branch to line c if a != b and store next line number in ra",
		example: "bapal a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "bapal",
	},
	bapz: {
		description: "Branch to line c if abs(a) &lt;= float.epsilon \\* 8",
		example: "bapz a(r?|num) b(r?|num) c(r?|num)",
		name: "bapz",
	},
	bapzal: {
		description: "Branch to line c if abs(a) &lt;= float.epsilon \\* 8",
		example: "bapzal a(r?|num) b(r?|num) c(r?|num)",
		name: "bapzal",
	},
	bdns: {
		description: "Branch to line a if device d isn't set",
		example: "bdns device(d?|r?|id) a(r?|num)",
		name: "bdns",
	},
	bdnsal: {
		description: "Jump execution to line a and store next line number if device is not set",
		example: "bdnsal device(d?|r?|id) a(r?|num)",
		name: "bdnsal",
	},
	bdnvl: {
		description:
			"Will branch to line a if the provided device not valid for a load instruction for the provided logic type.",
		example: "bdnvl device(d?|r?|id) logicType a(r?|num)",
		name: "bdnvl",
	},
	bdnvs: {
		description:
			"Will branch to line a if the provided device not valid for a store instruction for the provided logic type.",
		example: "bdnvs device(d?|r?|id) logicType a(r?|num)",
		name: "bdnvs",
	},
	bdse: {
		description: "Branch to line a if device d is set",
		example: "bdse device(d?|r?|id) a(r?|num)",
		name: "bdse",
	},
	bdseal: {
		description: "Jump execution to line a and store next line number if device is set",
		example: "bdseal device(d?|r?|id) a(r?|num)",
		name: "bdseal",
	},
	beq: {
		description: "Branch to line c if a == b",
		example: "beq a(r?|num) b(r?|num) c(r?|num)",
		name: "beq",
	},
	beqal: {
		description: "Branch to line c if a == b and store next line number in ra",
		example: "beqal a(r?|num) b(r?|num) c(r?|num)",
		name: "beqal",
	},
	beqz: {
		description: "Branch to line b if a == 0",
		example: "beqz a(r?|num) b(r?|num)",
		name: "beqz",
	},
	beqzal: {
		description: "Branch to line b if a == 0 and store next line number in ra",
		example: "beqzal a(r?|num) b(r?|num)",
		name: "beqzal",
	},
	bge: {
		description: "Branch to line c if a &gt;= b",
		example: "bge a(r?|num) b(r?|num) c(r?|num)",
		name: "bge",
	},
	bgeal: {
		description: "Branch to line c if a &gt;= b and store next line number in ra",
		example: "bgeal a(r?|num) b(r?|num) c(r?|num)",
		name: "bgeal",
	},
	bgez: {
		description: "Branch to line b if a &gt;= 0",
		example: "bgez a(r?|num) b(r?|num)",
		name: "bgez",
	},
	bgezal: {
		description: "Branch to line b if a &gt;= 0 and store next line number in ra",
		example: "bgezal a(r?|num) b(r?|num)",
		name: "bgezal",
	},
	bgt: {
		description: "Branch to line c if a &gt; b",
		example: "bgt a(r?|num) b(r?|num) c(r?|num)",
		name: "bgt",
	},
	bgtal: {
		description: "Branch to line c if a &gt; b and store next line number in ra",
		example: "bgtal a(r?|num) b(r?|num) c(r?|num)",
		name: "bgtal",
	},
	bgtz: {
		description: "Branch to line b if a &gt; 0",
		example: "bgtz a(r?|num) b(r?|num)",
		name: "bgtz",
	},
	bgtzal: {
		description: "Branch to line b if a &gt; 0 and store next line number in ra",
		example: "bgtzal a(r?|num) b(r?|num)",
		name: "bgtzal",
	},
	ble: {
		description: "Branch to line c if a &lt;= b",
		example: "ble a(r?|num) b(r?|num) c(r?|num)",
		name: "ble",
	},
	bleal: {
		description: "Branch to line c if a &lt;= b and store next line number in ra",
		example: "bleal a(r?|num) b(r?|num) c(r?|num)",
		name: "bleal",
	},
	blez: {
		description: "Branch to line b if a &lt;= 0",
		example: "blez a(r?|num) b(r?|num)",
		name: "blez",
	},
	blezal: {
		description: "Branch to line b if a &lt;= 0 and store next line number in ra",
		example: "blezal a(r?|num) b(r?|num)",
		name: "blezal",
	},
	blt: {
		description: "Branch to line c if a &lt; b",
		example: "blt a(r?|num) b(r?|num) c(r?|num)",
		name: "blt",
	},
	bltal: {
		description: "Branch to line c if a &lt; b and store next line number in ra",
		example: "bltal a(r?|num) b(r?|num) c(r?|num)",
		name: "bltal",
	},
	bltz: {
		description: "Branch to line b if a &lt; 0",
		example: "bltz a(r?|num) b(r?|num)",
		name: "bltz",
	},
	bltzal: {
		description: "Branch to line b if a &lt; 0 and store next line number in ra",
		example: "bltzal a(r?|num) b(r?|num)",
		name: "bltzal",
	},
	bna: {
		description: "Branch to line d if abs(a - b) &gt; max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8)",
		example: "bna a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "bna",
	},
	bnaal: {
		description:
			"Branch to line d if abs(a - b) &lt;= max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8) and store next line number in ra",
		example: "bnaal a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "bnaal",
	},
	bnan: {
		description: "Branch to line b if a is not a number (NaN)",
		example: "bnan a(r?|num) b(r?|num)",
		name: "bnan",
	},
	bnaz: {
		description: "Branch to line c if abs(a) &gt; float.epsilon \\* 8",
		example: "bnaz a(r?|num) b(r?|num) c(r?|num)",
		name: "bnaz",
	},
	bnazal: {
		description: "Branch to line c if abs(a) &gt; float.epsilon \\* 8",
		example: "bnazal a(r?|num) b(r?|num) c(r?|num)",
		name: "bnazal",
	},
	bne: {
		description: "Branch to line c if a != b",
		example: "bne a(r?|num) b(r?|num) c(r?|num)",
		name: "bne",
	},
	bneal: {
		description: "Branch to line c if a != b and store next line number in ra",
		example: "bneal a(r?|num) b(r?|num) c(r?|num)",
		name: "bneal",
	},
	bnez: {
		description: "branch to line b if a != 0",
		example: "bnez a(r?|num) b(r?|num)",
		name: "bnez",
	},
	bnezal: {
		description: "Branch to line b if a != 0 and store next line number in ra",
		example: "bnezal a(r?|num) b(r?|num)",
		name: "bnezal",
	},
	brap: {
		description: "Relative branch to line d if abs(a - b) &lt;= max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8)",
		example: "brap a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "brap",
	},
	brapz: {
		description: "Relative branch to line c if abs(a) &lt;= float.epsilon \\* 8",
		example: "brapz a(r?|num) b(r?|num) c(r?|num)",
		name: "brapz",
	},
	brdns: {
		description: "Relative jump to line a if device is not set",
		example: "brdns device(d?|r?|id) a(r?|num)",
		name: "brdns",
	},
	brdse: {
		description: "Relative jump to line a if device is set",
		example: "brdse device(d?|r?|id) a(r?|num)",
		name: "brdse",
	},
	breq: {
		description: "Relative branch to line c if a == b",
		example: "breq a(r?|num) b(r?|num) c(r?|num)",
		name: "breq",
	},
	breqz: {
		description: "Relative branch to line b if a == 0",
		example: "breqz a(r?|num) b(r?|num)",
		name: "breqz",
	},
	brge: {
		description: "Relative jump to line c if a &gt;= b",
		example: "brge a(r?|num) b(r?|num) c(r?|num)",
		name: "brge",
	},
	brgez: {
		description: "Relative branch to line b if a &gt;= 0",
		example: "brgez a(r?|num) b(r?|num)",
		name: "brgez",
	},
	brgt: {
		description: "relative jump to line c if a &gt; b",
		example: "brgt a(r?|num) b(r?|num) c(r?|num)",
		name: "brgt",
	},
	brgtz: {
		description: "Relative branch to line b if a &gt; 0",
		example: "brgtz a(r?|num) b(r?|num)",
		name: "brgtz",
	},
	brle: {
		description: "Relative jump to line c if a &lt;= b",
		example: "brle a(r?|num) b(r?|num) c(r?|num)",
		name: "brle",
	},
	brlez: {
		description: "Relative branch to line b if a &lt;= 0",
		example: "brlez a(r?|num) b(r?|num)",
		name: "brlez",
	},
	brlt: {
		description: "Relative jump to line c if a &lt; b",
		example: "brlt a(r?|num) b(r?|num) c(r?|num)",
		name: "brlt",
	},
	brltz: {
		description: "Relative branch to line b if a &lt; 0",
		example: "brltz a(r?|num) b(r?|num)",
		name: "brltz",
	},
	brna: {
		description: "Relative branch to line d if abs(a - b) &gt; max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8)",
		example: "brna a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		name: "brna",
	},
	brnan: {
		description: "Relative branch to line b if a is not a number (NaN)",
		example: "brnan a(r?|num) b(r?|num)",
		name: "brnan",
	},
	brnaz: {
		description: "Relative branch to line c if abs(a) &gt; float.epsilon \\* 8",
		example: "brnaz a(r?|num) b(r?|num) c(r?|num)",
		name: "brnaz",
	},
	brne: {
		description: "Relative branch to line c if a != b",
		example: "brne a(r?|num) b(r?|num) c(r?|num)",
		name: "brne",
	},
	brnez: {
		description: "Relative branch to line b if a != 0",
		example: "brnez a(r?|num) b(r?|num)",
		name: "brnez",
	},
	ceil: {
		description: "Register = smallest integer greater than a",
		example: "ceil r? a(r?|num)",
		name: "ceil",
	},
	clr: {
		description: "Clears the stack memory for the provided device.",
		example: "clr d?",
		name: "clr",
	},
	clrd: {
		description: "Seeks directly for the provided device id and clears the stack memory of that device",
		example: "clrd id(r?|num)",
		name: "clrd",
	},
	cos: {
		description: "Returns the cosine of the specified angle (radians)",
		example: "cos r? a(r?|num)",
		name: "cos",
	},
	define: {
		description: "Creates a label that will be replaced throughout the program with the provided value.",
		example: "define str num",
		name: "define",
	},
	div: {
		description: "Register = a / b",
		example: "div r? a(r?|num) b(r?|num)",
		name: "div",
	},
	exp: {
		description: "Register = exp(a)",
		example: "exp r? a(r?|num)",
		name: "exp",
	},
	ext: {
		description:
			"Extracts a bit field from a, beginning at b for c length and placed in the provided register. Payload cannot exceed 53 bits in final length.",
		example: "ext r? a(r?|num) b(r?|num) c(r?|num)",
		name: "ext",
	},
	floor: {
		description: "Register = largest integer less than a",
		example: "floor r? a(r?|num)",
		name: "floor",
	},
	get: {
		description:
			"Using the provided device, attempts to read the stack value at the provided address, and places it in the register.",
		example: "get r? device(d?|r?|id) address(r?|num)",
		name: "get",
	},
	getd: {
		description:
			"Seeks directly for the provided device id, attempts to read the stack value at the provided address, and places it in the register.",
		example: "getd r? id(r?|id) address(r?|num)",
		name: "getd",
	},
	hcf: {
		description: "Halt and catch fire",
		example: "hcf",
		name: "hcf",
	},
	ins: {
		description:
			"Inserts a bit field of a into the provided register, beginning at b for c length. Payload cannot exceed 53 bits in final length.",
		example: "ins r? a(r?|num) b(r?|num) c(r?|num)",
		name: "ins",
	},
	j: {
		description: "Jump execution to line a",
		example: "j int",
		name: "j",
	},
	jal: {
		description: "Jump execution to line a and store next line number in ra",
		example: "jal int",
		name: "jal",
	},
	jr: {
		description: "Relative jump to line a",
		example: "jr int",
		name: "jr",
	},
	l: {
		description: "Loads device LogicType to register by housing index value.",
		example: "l r? device(d?|r?|id) logicType",
		name: "l",
	},
	label: {
		description: "DEPRECATED",
		example: "label d? str",
		name: "label",
	},
	lb: {
		description:
			"Loads LogicType from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
		example: "lb r? deviceHash logicType batchMode",
		name: "lb",
	},
	lbn: {
		description:
			"Loads LogicType from all output network devices with provided type and name hashes using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
		example: "lbn r? deviceHash nameHash logicType batchMode",
		name: "lbn",
	},
	lbns: {
		description:
			"Loads LogicSlotType from slotIndex from all output network devices with provided type and name hashes using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
		example: "lbns r? deviceHash nameHash slotIndex logicSlotType batchMode",
		name: "lbns",
	},
	lbs: {
		description:
			"Loads LogicSlotType from slotIndex from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
		example: "lbs r? deviceHash slotIndex logicSlotType batchMode",
		name: "lbs",
	},
	ld: {
		description: "Loads device LogicType to register by direct ID reference.",
		example: "ld r? id(r?|id) logicType",
		name: "ld",
	},
	lerp: {
		description:
			"Linearly interpolates between a and b by the ratio c, and places the result in the register provided. The ratio c will be clamped between 0 and 1.",
		example: "lerp r? a(r?|num) b(r?|num) c(r?|num)",
		name: "lerp",
	},
	log: {
		description: "Register = log(a)",
		example: "log r? a(r?|num)",
		name: "log",
	},
	lr: {
		description:
			"Loads reagent of device's ReagentMode where a hash of the reagent type to check for. ReagentMode can be either Contents (0), Required (1), Recipe (2). Can use either the word, or the number.",
		example: "lr r? device(d?|r?|id) reagentMode int",
		name: "lr",
	},
	ls: {
		description: "Loads slot LogicSlotType on device to register.",
		example: "ls r? device(d?|r?|id) slotIndex logicSlotType",
		name: "ls",
	},
	max: {
		description: "Register = max of a or b",
		example: "max r? a(r?|num) b(r?|num)",
		name: "max",
	},
	min: {
		description: "Register = min of a or b",
		example: "min r? a(r?|num) b(r?|num)",
		name: "min",
	},
	mod: {
		description: "Register = a mod b (note: NOT a % b)",
		example: "mod r? a(r?|num) b(r?|num)",
		name: "mod",
	},
	move: {
		description: "Register = provided num or register value.",
		example: "move r? a(r?|num)",
		name: "move",
	},
	mul: {
		description: "Register = a \\* b",
		example: "mul r? a(r?|num) b(r?|num)",
		name: "mul",
	},
	nor: {
		description:
			"Performs a bitwise logical NOR (NOT OR) operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If both bits are 0, the resulting bit is set to 1. Otherwise, if at least one bit is 1, the resulting bit is set to 0.",
		example: "nor r? a(r?|num) b(r?|num)",
		name: "nor",
	},
	not: {
		description:
			"Performs a bitwise logical NOT operation flipping each bit of the input value, resulting in a binary complement. If a bit is 1, it becomes 0, and if a bit is 0, it becomes 1.",
		example: "not r? a(r?|num)",
		name: "not",
	},
	or: {
		description:
			"Performs a bitwise logical OR operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If either bit is 1, the resulting bit is set to 1. If both bits are 0, the resulting bit is set to 0.",
		example: "or r? a(r?|num) b(r?|num)",
		name: "or",
	},
	peek: {
		description: "Register = the value at the top of the stack",
		example: "peek r?",
		name: "peek",
	},
	poke: {
		description: "Stores the provided value at the provided address in the stack.",
		example: "poke address(r?|num) value(r?|num)",
		name: "poke",
	},
	pop: {
		description: "Register = the value at the top of the stack and decrements sp",
		example: "pop r?",
		name: "pop",
	},
	pow: {
		description:
			"Stores the result of raising a to the power of b in the register. Follows IEEE-754 standard for floating point arithmetic.",
		example: "pow r? a(r?|num) b(r?|num)",
		name: "pow",
	},
	push: {
		description: "Pushes the value of a to the stack at sp and increments sp",
		example: "push a(r?|num)",
		name: "push",
	},
	put: {
		description:
			"Using the provided device, attempts to write the provided value to the stack at the provided address.",
		example: "put device(d?|r?|id) address(r?|num) value(r?|num)",
		name: "put",
	},
	putd: {
		description:
			"Seeks directly for the provided device id, attempts to write the provided value to the stack at the provided address.",
		example: "putd id(r?|id) address(r?|num) value(r?|num)",
		name: "putd",
	},
	rand: {
		description: "Register = a random value x with 0 &lt;= x &lt; 1",
		example: "rand r?",
		name: "rand",
	},
	rmap: {
		description:
			"Given a reagent hash, store the corresponding prefab hash that the device expects to fulfill the reagent requirement. For example, on an autolathe, the hash for Iron will store the hash for ItemIronIngot.",
		example: "rmap r? d? reagentHash(r?|num)",
		name: "rmap",
	},
	round: {
		description: "Register = a rounded to nearest integer",
		example: "round r? a(r?|num)",
		name: "round",
	},
	s: {
		description: "Stores register value to LogicType on device by housing index value.",
		example: "s device(d?|r?|id) logicType r?",
		name: "s",
	},
	sap: {
		description: "Register = 1 if abs(a - b) &lt;= max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8), otherwise 0",
		example: "sap r? a(r?|num) b(r?|num) c(r?|num)",
		name: "sap",
	},
	sapz: {
		description: "Register = 1 if |a| &lt;= float.epsilon \\* 8, otherwise 0",
		example: "sapz r? a(r?|num) b(r?|num)",
		name: "sapz",
	},
	sb: {
		description: "Stores register value to LogicType on all output network devices with provided type hash.",
		example: "sb deviceHash logicType r?",
		name: "sb",
	},
	sbn: {
		description: "Stores register value to LogicType on all output network devices with provided type hash and name.",
		example: "sbn deviceHash nameHash logicType r?",
		name: "sbn",
	},
	sbs: {
		description:
			"Stores register value to LogicSlotType on all output network devices with provided type hash in the provided slot.",
		example: "sbs deviceHash slotIndex logicSlotType r?",
		name: "sbs",
	},
	sd: {
		description: "Stores register value to LogicType on device by direct ID reference.",
		example: "sd id(r?|id) logicType r?",
		name: "sd",
	},
	sdns: {
		description: "Register = 1 if device is not set, otherwise 0",
		example: "sdns r? device(d?|r?|id)",
		name: "sdns",
	},
	sdse: {
		description: "Register = 1 if device is set, otherwise 0.",
		example: "sdse r? device(d?|r?|id)",
		name: "sdse",
	},
	select: {
		description: "Register = b if a is non-zero, otherwise c",
		example: "select r? a(r?|num) b(r?|num) c(r?|num)",
		name: "select",
	},
	seq: {
		description: "Register = 1 if a == b, otherwise 0",
		example: "seq r? a(r?|num) b(r?|num)",
		name: "seq",
	},
	seqz: {
		description: "Register = 1 if a == 0, otherwise 0",
		example: "seqz r? a(r?|num)",
		name: "seqz",
	},
	sge: {
		description: "Register = 1 if a &gt;= b, otherwise 0",
		example: "sge r? a(r?|num) b(r?|num)",
		name: "sge",
	},
	sgez: {
		description: "Register = 1 if a &gt;= 0, otherwise 0",
		example: "sgez r? a(r?|num)",
		name: "sgez",
	},
	sgt: {
		description: "Register = 1 if a &gt; b, otherwise 0",
		example: "sgt r? a(r?|num) b(r?|num)",
		name: "sgt",
	},
	sgtz: {
		description: "Register = 1 if a &gt; 0, otherwise 0",
		example: "sgtz r? a(r?|num)",
		name: "sgtz",
	},
	sin: {
		description: "Returns the sine of the specified angle (radians)",
		example: "sin r? a(r?|num)",
		name: "sin",
	},
	sla: {
		description:
			"Performs a bitwise arithmetic left shift operation on the binary representation of a value. It shifts the bits to the left and fills the vacated rightmost bits with a copy of the sign bit (the most significant bit).",
		example: "sla r? a(r?|num) b(r?|num)",
		name: "sla",
	},
	sle: {
		description: "Register = 1 if a &lt;= b, otherwise 0",
		example: "sle r? a(r?|num) b(r?|num)",
		name: "sle",
	},
	sleep: {
		description: "Pauses execution on the IC for a seconds",
		example: "sleep a(r?|num)",
		name: "sleep",
	},
	slez: {
		description: "Register = 1 if a &lt;= 0, otherwise 0",
		example: "slez r? a(r?|num)",
		name: "slez",
	},
	sll: {
		description:
			"Performs a bitwise logical left shift operation on the binary representation of a value. It shifts the bits to the left and fills the vacated rightmost bits with zeros.",
		example: "sll r? a(r?|num) b(r?|num)",
		name: "sll",
	},
	slt: {
		description: "Register = 1 if a &lt; b, otherwise 0",
		example: "slt r? a(r?|num) b(r?|num)",
		name: "slt",
	},
	sltz: {
		description: "Register = 1 if a &lt; 0, otherwise 0",
		example: "sltz r? a(r?|num)",
		name: "sltz",
	},
	sna: {
		description: "Register = 1 if abs(a - b) &gt; max(c \\* max(abs(a), abs(b)), float.epsilon \\* 8), otherwise 0",
		example: "sna r? a(r?|num) b(r?|num) c(r?|num)",
		name: "sna",
	},
	snan: {
		description: "Register = 1 if a is NaN, otherwise 0",
		example: "snan r? a(r?|num)",
		name: "snan",
	},
	snanz: {
		description: "Register = 0 if a is NaN, otherwise 1",
		example: "snanz r? a(r?|num)",
		name: "snanz",
	},
	snaz: {
		description: "Register = 1 if |a| &gt; float.epsilon, otherwise 0",
		example: "snaz r? a(r?|num) b(r?|num)",
		name: "snaz",
	},
	sne: {
		description: "Register = 1 if a != b, otherwise 0",
		example: "sne r? a(r?|num) b(r?|num)",
		name: "sne",
	},
	snez: {
		description: "Register = 1 if a != 0, otherwise 0",
		example: "snez r? a(r?|num)",
		name: "snez",
	},
	sqrt: {
		description: "Register = square root of a",
		example: "sqrt r? a(r?|num)",
		name: "sqrt",
	},
	sra: {
		description:
			"Performs a bitwise arithmetic right shift operation on the binary representation of a value. It shifts the bits to the right and fills the vacated leftmost bits with a copy of the sign bit (the most significant bit).",
		example: "sra r? a(r?|num) b(r?|num)",
		name: "sra",
	},
	srl: {
		description:
			"Performs a bitwise logical right shift operation on the binary representation of a value. It shifts the bits to the right and fills the vacated leftmost bits with zeros",
		example: "srl r? a(r?|num) b(r?|num)",
		name: "srl",
	},
	ss: {
		description: "Stores register value to device stored in a slot LogicSlotType on device.",
		example: "ss device(d?|r?|id) slotIndex logicSlotType r?",
		name: "ss",
	},
	sub: {
		description: "Register = a - b.",
		example: "sub r? a(r?|num) b(r?|num)",
		name: "sub",
	},
	tan: {
		description: "Returns the tan of the specified angle (radians)",
		example: "tan r? a(r?|num)",
		name: "tan",
	},
	trunc: {
		description: "Register = a with fractional part removed",
		example: "trunc r? a(r?|num)",
		name: "trunc",
	},
	xor: {
		description:
			"Performs a bitwise logical XOR (exclusive OR) operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If the bits are different (one bit is 0 and the other is 1), the resulting bit is set to 1. If the bits are the same (both 0 or both 1), the resulting bit is set to 0.",
		example: "xor r? a(r?|num) b(r?|num)",
		name: "xor",
	},
	yield: {
		description: "Pauses execution for 1 tick",
		example: "yield",
		name: "yield",
	},
} as const;
export default INSTRUCTIONS;
