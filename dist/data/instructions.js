export const allInstructions = [
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
        description: "Performs a bitwise logical XOR (exclusive OR) operation on the binary representation of two values. Each bit of the result is determined by evaluating the corresponding bits of the input values. If the bits are different (one bit is 0 and the other is 1), the resulting bit is set to 1. If the bits are the same (both 0 or both 1), the resulting bit is set to 0.",
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
];
export default allInstructions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdHJ1Y3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2RhdGEvaW5zdHJ1Y3Rpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxNQUFNLGVBQWUsR0FLdEI7SUFDTDtRQUNDLElBQUksRUFBRSxHQUFHO1FBQ1QsT0FBTyxFQUFFLG1CQUFtQjtRQUM1QixXQUFXLEVBQUUsNERBQTREO0tBQ3pFO0lBQ0Q7UUFDQyxJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRSxzQ0FBc0M7UUFDL0MsV0FBVyxFQUNWLCtMQUErTDtLQUNoTTtJQUNEO1FBQ0MsSUFBSSxFQUFFLEdBQUc7UUFDVCxPQUFPLEVBQUUsbUJBQW1CO1FBQzVCLFdBQVcsRUFBRSxzRUFBc0U7S0FDbkY7SUFDRDtRQUNDLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLDRCQUE0QjtRQUNyQyxXQUFXLEVBQUUsMkZBQTJGO0tBQ3hHO0lBQ0Q7UUFDQyxJQUFJLEVBQUUsSUFBSTtRQUNWLE9BQU8sRUFBRSxrQ0FBa0M7UUFDM0MsV0FBVyxFQUFFLGlEQUFpRDtLQUM5RDtJQUNEO1FBQ0MsSUFBSSxFQUFFLElBQUk7UUFDVixPQUFPLEVBQUUsMEJBQTBCO1FBQ25DLFdBQVcsRUFDVixnTUFBZ007S0FDak07SUFDRDtRQUNDLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLGlCQUFpQjtRQUMxQixXQUFXLEVBQ1YsdUhBQXVIO0tBQ3hIO0lBQ0Q7UUFDQyxJQUFJLEVBQUUsUUFBUTtRQUNkLE9BQU8sRUFBRSxnQkFBZ0I7UUFDekIsV0FBVyxFQUFFLHVGQUF1RjtLQUNwRztJQUNEO1FBQ0MsSUFBSSxFQUFFLE1BQU07UUFDWixPQUFPLEVBQUUsbUJBQW1CO1FBQzVCLFdBQVcsRUFBRSw0Q0FBNEM7S0FDekQ7SUFDRDtRQUNDLElBQUksRUFBRSxLQUFLO1FBQ1gsT0FBTyxFQUFFLDRCQUE0QjtRQUNyQyxXQUFXLEVBQUUs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