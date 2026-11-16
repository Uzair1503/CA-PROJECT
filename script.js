

// Register names and their numbers
const registers = {
    "$zero": 0,
    "$at": 1,
    "$v0": 2, "$v1": 3,
    "$a0": 4, "$a1": 5, "$a2": 6, "$a3": 7,
    "$t0": 8, "$t1": 9, "$t2": 10, "$t3": 11,
    "$t4": 12, "$t5": 13, "$t6": 14, "$t7": 15,
    "$s0": 16, "$s1": 17, "$s2": 18, "$s3": 19,
    "$s4": 20, "$s5": 21, "$s6": 22, "$s7": 23,
    "$t8": 24, "$t9": 25,
    "$k0": 26, "$k1": 27,
    "$gp": 28, "$sp": 29, "$fp": 30, "$ra": 31
};

// Function code for each instruction
const functionCodes = {
    "ADD": "100000",
    "SUB": "100010",
    "AND": "100100",
    "OR":  "100101",
    "SLT": "101010"
};

// Main encoding function
function encodeInstruction(instruction, rdName, rsName, rtName) {

    // Convert instruction to uppercase
    instruction = instruction.toUpperCase();

    // Check whether the instruction is supported
    if (!functionCodes[instruction]) {
        throw new Error("Invalid instruction: " + instruction);
    }

    // Get register numbers
    let rd = registers[rdName.toLowerCase()];
    let rs = registers[rsName.toLowerCase()];
    let rt = registers[rtName.toLowerCase()];

    // Check whether registers exist
    if (rd === undefined || rs === undefined || rt === undefined) {
        throw new Error("Invalid register name");
    }

    // Set the opcode for R-Type instructions
    let opcode = "000000";

    // Convert register numbers into 5-bit binary
    let rsBinary = rs.toString(2).padStart(5, "0");
    let rtBinary = rt.toString(2).padStart(5, "0");
    let rdBinary = rd.toString(2).padStart(5, "0");

    // Shift amount is zero for these instructions
    let shamt = "00000";

    // Get the function code
    let funct = functionCodes[instruction];

    // Combine all six fields in the correct order
    let binary = opcode + rsBinary + rtBinary +
                 rdBinary + shamt + funct;

    // Convert binary into 8-digit hexadecimal
    let hexadecimal = "0x" +
        parseInt(binary, 2).toString(16).toUpperCase().padStart(8, "0");

    // Return all calculated values
    return {
        instruction: instruction,
        opcode: opcode,
        rs: rsBinary,
        rt: rtBinary,
        rd: rdBinary,
        shamt: shamt,
        funct: funct,
        binary: binary,
        hexadecimal: hexadecimal
    };
}

// TEST 1: ADD $a0, $a1, $a2
let test1 = encodeInstruction("ADD", "$a0", "$a1", "$a2");
console.log("TEST 1 - ADD");
console.table(test1);

// TEST 2: OR $t0, $t1, $t2
let test2 = encodeInstruction("OR", "$t0", "$t1", "$t2");
console.log("TEST 2 - OR");
console.table(test2);

// TEST 3: SLT $s0, $s1, $s2
let test3 = encodeInstruction("SLT", "$s0", "$s1", "$s2");
console.log("TEST 3 - SLT");
console.table(test3);
