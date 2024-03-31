export const allInstructions: {
	name: string
	preview: string
	description: string
	deprecated?: boolean
}[] = [
	{
		name: "l",
		preview: "l r? d? logicType",
		description: "Loads device LogicType to register by housing index value.",
	},
	{
		name: "lb",
		preview: "lb r? deviceHash logicType batchMode",
		description: "Loads LogicType from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
	},
	{
		name: "s",
		preview: "s d? logicType r?",
		description: "Stores register value to LogicType on device by housing index value.",
	},
	{
		name: "sb",
		preview: "sb deviceHash logicType r?",
		description: "Stores register value to LogicType on all output network devices with provided type hash.",
	},
	{
		name: "ls",
		preview: "ls r? d? slotIndex logicSlotType",
		description: "Loads slot LogicSlotType on device to register.",
	},
	{
		name: "lr",
		preview: "lr r? d? reagentMode int",
		description: "Loads reagent of device's ReagentMode where a hash of the reagent type to check for. ReagentMode can be either Contents (0), Required (1), Recipe (2). Can use either the word, or the number.",
	},
	{
		name: "alias",
		preview: "alias str r?|d?",
		description: "Labels register or device reference with name, device references also affect what shows on the screws on the IC base.",
	},
	{
		name: "define",
		preview: "define str num",
		description: "Creates a label that will be replaced throughout the program with the provided value.",
	},
	{
		name: "move",
		preview: "move r? a(r?|num)",
		description: "Register = provided num or register value.",
	},
	{
		name: "add",
		preview: "add r? a(r?|num) b(r?|num)",
		description: "Register = a + b.",
	},
	{
		name: "sub",
		preview: "sub r? a(r?|num) b(r?|num)",
		description: "Register = a - b.",
	},
	{
		name: "sdse",
		preview: "sdse r? d?",
		description: "Register = 1 if device is set, otherwise 0.",
	},
	{
		name: "sdns",
		preview: "sdns r? d?",
		description: "Register = 1 if device is not set, otherwise 0",
	},
	{
		name: "slt",
		preview: "slt r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a < b, otherwise 0",
	},
	{
		name: "sgt",
		preview: "sgt r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a > b, otherwise 0",
	},
	{
		name: "sle",
		preview: "sle r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a <= b, otherwise 0",
	},
	{
		name: "sge",
		preview: "sge r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a >= b, otherwise 0",
	},
	{
		name: "seq",
		preview: "seq r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a == b, otherwise 0",
	},
	{
		name: "sne",
		preview: "sne r? a(r?|num) b(r?|num)",
		description: "Register = 1 if a != b, otherwise 0",
	},
	{
		name: "sap",
		preview: "sap r? a(r?|num) b(r?|num) c(r?|num)",
		description: "Register = 1 if abs(a - b) <= max(c * max(abs(a), abs(b)), float.epsilon * 8), otherwise 0",
	},
	{
		name: "sna",
		preview: "sna r? a(r?|num) b(r?|num) c(r?|num)",
		description: "Register = 1 if abs(a - b) > max(c * max(abs(a), abs(b)), float.epsilon * 8), otherwise 0",
	},
	{
		name: "sltz",
		preview: "sltz r? a(r?|num)",
		description: "Register = 1 if a < 0, otherwise 0",
	},
	{
		name: "sgtz",
		preview: "sgtz r? a(r?|num)",
		description: "Register = 1 if a > 0, otherwise 0",
	},
	{
		name: "slez",
		preview: "slez r? a(r?|num)",
		description: "Register = 1 if a <= 0, otherwise 0",
	},
	{
		name: "sgez",
		preview: "sgez r? a(r?|num)",
		description: "Register = 1 if a >= 0, otherwise 0",
	},
	{
		name: "seqz",
		preview: "seqz r? a(r?|num)",
		description: "Register = 1 if a == 0, otherwise 0",
	},
	{
		name: "snez",
		preview: "snez r? a(r?|num)",
		description: "Register = 1 if a != 0, otherwise 0",
	},
	{
		name: "sapz",
		preview: "sapz r? a(r?|num) b(r?|num)",
		description: "Register = 1 if |a| <= float.epsilon * 8, otherwise 0",
	},
	{
		name: "snaz",
		preview: "snaz r? a(r?|num) b(r?|num)",
		description: "Register = 1 if |a| > float.epsilon, otherwise 0",
	},
	{
		name: "and",
		preview: "and r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise logical AND operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If both bits are 1, the resulting bit is set to 1. Otherwise the resulting bit is set to 0.",
	},
	{
		name: "or",
		preview: "or r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise logical OR operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If either bit is 1, the resulting bit is set to 1. If both bits are 0, the resulting bit is set to 0.",
	},
	{
		name: "xor",
		preview: "xor r? a(r?|num) b(r?|num)",
		description:
			"Performs a bitwise logical XOR (exclusive OR) operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If the bits are different (one bit is 0 and the other is 1), the resulting bit is set to 1. If the bits are the same (both 0 or both 1), the resulting bit is set to 0.",
	},
	{
		name: "nor",
		preview: "nor r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise logical NOR (NOT OR) operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If both bits are 0, the resulting bit is set to 1. Otherwise, if at least one bit is 1, the resulting bit is set to 0.",
	},
	{
		name: "mul",
		preview: "mul r? a(r?|num) b(r?|num)",
		description: "Register = a * b",
	},
	{
		name: "div",
		preview: "div r? a(r?|num) b(r?|num)",
		description: "Register = a / b",
	},
	{
		name: "mod",
		preview: "mod r? a(r?|num) b(r?|num)",
		description: "Register = a mod b (note: NOT a % b)",
	},
	{
		name: "j",
		preview: "j int",
		description: "Jump execution to line a",
	},
	{
		name: "bdse",
		preview: "bdse d? a(r?|num)",
		description: "Branch to line a if device d is set",
	},
	{
		name: "bdns",
		preview: "bdns d? a(r?|num)",
		description: "Branch to line a if device d isn't set",
	},
	{
		name: "blt",
		preview: "blt a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a < b",
	},
	{
		name: "bgt",
		preview: "bgt a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a > b",
	},
	{
		name: "ble",
		preview: "ble a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a <= b",
	},
	{
		name: "bge",
		preview: "bge a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a >= b",
	},
	{
		name: "beq",
		preview: "beq a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a == b",
	},
	{
		name: "bne",
		preview: "bne a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a != b",
	},
	{
		name: "bap",
		preview: "bap a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Branch to line d if abs(a - b) <= max(c * max(abs(a), abs(b)), float.epsilon * 8)",
	},
	{
		name: "bna",
		preview: "bna a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Branch to line d if abs(a - b) > max(c * max(abs(a), abs(b)), float.epsilon * 8)",
	},
	{
		name: "bltz",
		preview: "bltz a(r?|num) b(r?|num)",
		description: "Branch to line b if a < 0",
	},
	{
		name: "bgez",
		preview: "bgez a(r?|num) b(r?|num)",
		description: "Branch to line b if a >= 0",
	},
	{
		name: "blez",
		preview: "blez a(r?|num) b(r?|num)",
		description: "Branch to line b if a <= 0",
	},
	{
		name: "bgtz",
		preview: "bgtz a(r?|num) b(r?|num)",
		description: "Branch to line b if a > 0",
	},
	{
		name: "beqz",
		preview: "beqz a(r?|num) b(r?|num)",
		description: "Branch to line b if a == 0",
	},
	{
		name: "bnez",
		preview: "bnez a(r?|num) b(r?|num)",
		description: "branch to line b if a != 0",
	},
	{
		name: "bapz",
		preview: "bapz a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if abs(a) <= float.epsilon * 8",
	},
	{
		name: "bnaz",
		preview: "bnaz a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if abs(a) > float.epsilon * 8",
	},
	{
		name: "jr",
		preview: "jr int",
		description: "Relative jump to line a",
	},
	{
		name: "brdse",
		preview: "brdse d? a(r?|num)",
		description: "Relative jump to line a if device is set",
	},
	{
		name: "brdns",
		preview: "brdns d? a(r?|num)",
		description: "Relative jump to line a if device is not set",
	},
	{
		name: "brlt",
		preview: "brlt a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative jump to line c if a < b",
	},
	{
		name: "brgt",
		preview: "brgt a(r?|num) b(r?|num) c(r?|num)",
		description: "relative jump to line c if a > b",
	},
	{
		name: "brle",
		preview: "brle a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative jump to line c if a <= b",
	},
	{
		name: "brge",
		preview: "brge a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative jump to line c if a >= b",
	},
	{
		name: "breq",
		preview: "breq a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative branch to line c if a == b",
	},
	{
		name: "brne",
		preview: "brne a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative branch to line c if a != b",
	},
	{
		name: "brap",
		preview: "brap a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Relative branch to line d if abs(a - b) <= max(c * max(abs(a), abs(b)), float.epsilon * 8)",
	},
	{
		name: "brna",
		preview: "brna a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Relative branch to line d if abs(a - b) > max(c * max(abs(a), abs(b)), float.epsilon * 8)",
	},
	{
		name: "brltz",
		preview: "brltz a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a < 0",
	},
	{
		name: "brgez",
		preview: "brgez a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a >= 0",
	},
	{
		name: "brlez",
		preview: "brlez a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a <= 0",
	},
	{
		name: "brgtz",
		preview: "brgtz a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a > 0",
	},
	{
		name: "breqz",
		preview: "breqz a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a == 0",
	},
	{
		name: "brnez",
		preview: "brnez a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a != 0",
	},
	{
		name: "brapz",
		preview: "brapz a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative branch to line c if abs(a) <= float.epsilon * 8",
	},
	{
		name: "brnaz",
		preview: "brnaz a(r?|num) b(r?|num) c(r?|num)",
		description: "Relative branch to line c if abs(a) > float.epsilon * 8",
	},
	{
		name: "jal",
		preview: "jal int",
		description: "Jump execution to line a and store next line number in ra",
	},
	{
		name: "bdseal",
		preview: "bdseal d? a(r?|num)",
		description: "Jump execution to line a and store next line number if device is set",
	},
	{
		name: "bdnsal",
		preview: "bdnsal d? a(r?|num)",
		description: "Jump execution to line a and store next line number if device is not set",
	},
	{
		name: "bltal",
		preview: "bltal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a < b and store next line number in ra",
	},
	{
		name: "bgtal",
		preview: "bgtal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a > b and store next line number in ra",
	},
	{
		name: "bleal",
		preview: "bleal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a <= b and store next line number in ra",
	},
	{
		name: "bgeal",
		preview: "bgeal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a >= b and store next line number in ra",
	},
	{
		name: "beqal",
		preview: "beqal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a == b and store next line number in ra",
	},
	{
		name: "bneal",
		preview: "bneal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if a != b and store next line number in ra",
	},
	{
		name: "bapal",
		preview: "bapal a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Branch to line c if a != b and store next line number in ra",
	},
	{
		name: "bnaal",
		preview: "bnaal a(r?|num) b(r?|num) c(r?|num) d(r?|num)",
		description: "Branch to line d if abs(a - b) <= max(c * max(abs(a), abs(b)), float.epsilon * 8) and store next line number in ra",
	},
	{
		name: "bltzal",
		preview: "bltzal a(r?|num) b(r?|num)",
		description: "Branch to line b if a < 0 and store next line number in ra",
	},
	{
		name: "bgezal",
		preview: "bgezal a(r?|num) b(r?|num)",
		description: "Branch to line b if a >= 0 and store next line number in ra",
	},
	{
		name: "blezal",
		preview: "blezal a(r?|num) b(r?|num)",
		description: "Branch to line b if a <= 0 and store next line number in ra",
	},
	{
		name: "bgtzal",
		preview: "bgtzal a(r?|num) b(r?|num)",
		description: "Branch to line b if a > 0 and store next line number in ra",
	},
	{
		name: "beqzal",
		preview: "beqzal a(r?|num) b(r?|num)",
		description: "Branch to line b if a == 0 and store next line number in ra",
	},
	{
		name: "bnezal",
		preview: "bnezal a(r?|num) b(r?|num)",
		description: "Branch to line b if a != 0 and store next line number in ra",
	},
	{
		name: "bapzal",
		preview: "bapzal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if abs(a) <= float.epsilon * 8",
	},
	{
		name: "bnazal",
		preview: "bnazal a(r?|num) b(r?|num) c(r?|num)",
		description: "Branch to line c if abs(a) > float.epsilon * 8",
	},
	{
		name: "sqrt",
		preview: "sqrt r? a(r?|num)",
		description: "Register = square root of a",
	},
	{
		name: "round",
		preview: "round r? a(r?|num)",
		description: "Register = a rounded to nearest integer",
	},
	{
		name: "trunc",
		preview: "trunc r? a(r?|num)",
		description: "Register = a with fractional part removed",
	},
	{
		name: "ceil",
		preview: "ceil r? a(r?|num)",
		description: "Register = smallest integer greater than a",
	},
	{
		name: "floor",
		preview: "floor r? a(r?|num)",
		description: "Register = largest integer less than a",
	},
	{
		name: "max",
		preview: "max r? a(r?|num) b(r?|num)",
		description: "Register = max of a or b",
	},
	{
		name: "min",
		preview: "min r? a(r?|num) b(r?|num)",
		description: "Register = min of a or b",
	},
	{
		name: "abs",
		preview: "abs r? a(r?|num)",
		description: "Register = the absolute value of a",
	},
	{
		name: "log",
		preview: "log r? a(r?|num)",
		description: "Register = log(a)",
	},
	{
		name: "exp",
		preview: "exp r? a(r?|num)",
		description: "Register = exp(a)",
	},
	{
		name: "rand",
		preview: "rand r?",
		description: "Register = a random value x with 0 <= x < 1",
	},
	{
		name: "yield",
		preview: "yield",
		description: "Pauses execution for 1 tick",
	},
	{
		name: "label",
		preview: "",
		description: "DEPRECATED",
		deprecated: false,
	},
	{
		name: "peek",
		preview: "peek r?",
		description: "Register = the value at the top of the stack",
	},
	{
		name: "push",
		preview: "push a(r?|num)",
		description: "Pushes the value of a to the stack at sp and increments sp",
	},
	{
		name: "pop",
		preview: "pop r?",
		description: "Register = the value at the top of the stack and decrements sp",
	},
	{
		name: "hcf",
		preview: "hcf",
		description: "Halt and catch fire",
	},
	{
		name: "select",
		preview: "select r? a(r?|num) b(r?|num) c(r?|num)",
		description: "Register = b if a is non-zero, otherwise c",
	},
	{
		name: "sleep",
		preview: "sleep a(r?|num)",
		description: "Pauses execution on the IC for a seconds",
	},
	{
		name: "sin",
		preview: "sin r? a(r?|num)",
		description: "Returns the sine of the specified angle (radians)",
	},
	{
		name: "cos",
		preview: "cos r? a(r?|num)",
		description: "Returns the cosine of the specified angle (radians)",
	},
	{
		name: "tan",
		preview: "tan r? a(r?|num)",
		description: "Returns the tan of the specified angle (radians) ",
	},
	{
		name: "asin",
		preview: "asin r? a(r?|num)",
		description: "Returns the angle (radians) whos sine is the specified value",
	},
	{
		name: "acos",
		preview: "acos r? a(r?|num)",
		description: "Returns the cosine of the specified angle (radians)",
	},
	{
		name: "atan",
		preview: "atan r? a(r?|num)",
		description: "Returns the angle (radians) whos tan is the specified value",
	},
	{
		name: "atan2",
		preview: "atan2 r? a(r?|num) b(r?|num)",
		description: "Returns the angle (radians) whose tangent is the quotient of two specified values: a (y) and b (x)",
	},
	{
		name: "ld",
		preview: "ld r? id(r?|num) logicType",
		description: "Loads device LogicType to register by direct ID reference.",
	},
	{
		name: "lbn",
		preview: "lbn r? deviceHash nameHash logicType batchMode",
		description: "Loads LogicType from all output network devices with provided type and name hashes using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
	},
	{
		name: "lbs",
		preview: "lbs r? deviceHash slotIndex logicSlotType batchMode",
		description: "Loads LogicSlotType from slotIndex from all output network devices with provided type hash using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
	},
	{
		name: "lbns",
		preview: "lbns r? deviceHash nameHash slotIndex logicSlotType batchMode",
		description: "Loads LogicSlotType from slotIndex from all output network devices with provided type and name hashes using the provide batch mode. Average (0), Sum (1), Minimum (2), Maximum (3). Can use either the word, or the number.",
	},
	{
		name: "sd",
		preview: "sd id(r?|num) logicType r?",
		description: "Stores register value to LogicType on device by direct ID reference.",
	},
	{
		name: "ss",
		preview: "ss d? slotIndex logicSlotType r?",
		description: "Stores register value to device stored in a slot LogicSlotType on device.",
	},
	{
		name: "sbs",
		preview: "sbs deviceHash slotIndex logicSlotType r?",
		description: "Stores register value to LogicSlotType on all output network devices with provided type hash in the provided slot.",
	},
	{
		name: "snan",
		preview: "snan r? a(r?|num)",
		description: "Register = 1 if a is NaN, otherwise 0",
	},
	{
		name: "snanz",
		preview: "snanz r? a(r?|num)",
		description: "Register = 0 if a is NaN, otherwise 1",
	},
	{
		name: "bnan",
		preview: "bnan a(r?|num) b(r?|num)",
		description: "Branch to line b if a is not a number (NaN)",
	},
	{
		name: "brnan",
		preview: "brnan a(r?|num) b(r?|num)",
		description: "Relative branch to line b if a is not a number (NaN)",
	},
	{
		name: "get",
		preview: "get r? d? address(r?|num)",
		description: "Using the provided device, attempts to read the stack value at the provided address, and places it in the register.",
	},
	{
		name: "getd",
		preview: "getd r? id(r?|num) address(r?|num)",
		description: "Seeks directly for the provided device id, attempts to read the stack value at the provided address, and places it in the register.",
	},
	{
		name: "not",
		preview: "not r? a(r?|num)",
		description: "Performs a bitwise logical NOT operation flipping each bit of the input value, resulting in a binary complement. If a bit is 1, it becomes 0, and if a bit is 0, it becomes 1.",
	},
	{
		name: "poke",
		preview: "poke address(r?|num) value(r?|num)",
		description: "Stores the provided value at the provided address in the stack.",
	},
	{
		name: "put",
		preview: "put d? address(r?|num) value(r?|num)",
		description: "Using the provided device, attempts to write the provided value to the stack at the provided address.",
	},
	{
		name: "putd",
		preview: "putd id(r?|num) address(r?|num) value(r?|num)",
		description: "Seeks directly for the provided device id, attempts to write the provided value to the stack at the provided address.",
	},
	{
		name: "sbn",
		preview: "sbn deviceHash nameHash logicType r?",
		description: "Stores register value to LogicType on all output network devices with provided type hash and name.",
	},
	{
		name: "sla",
		preview: "sla r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise arithmetic left shift operation on the binary representation of a value. It shifts the bits to the left and fills the vacated rightmost bits with a copy of the sign bit (the most significant bit).",
	},
	{
		name: "sll",
		preview: "sll r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise logical left shift operation on the binary representation of a value. It shifts the bits to the left and fills the vacated rightmost bits with zeros.",
	},
	{
		name: "sra",
		preview: "sra r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise arithmetic right shift operation on the binary representation of a value. It shifts the bits to the right and fills the vacated leftmost bits with a copy of the sign bit (the most significant bit).",
	},
	{
		name: "srl",
		preview: "srl r? a(r?|num) b(r?|num)",
		description: "Performs a bitwise logical right shift operation on the binary representation of a value. It shifts the bits to the right and fills the vacated leftmost bits with zeros",
	},
]

export default allInstructions
