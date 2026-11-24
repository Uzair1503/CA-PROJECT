
/* =====================================
   MIPS R-TYPE INSTRUCTION ENCODER
   Lab 7 + Lab 8 - Member 2
   ===================================== */

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

// Function codes for R-Type instructions
const functionCodes = {
    "ADD": "100000",
    "SUB": "100010",
    "AND": "100100",
    "OR":  "100101",
    "SLT": "101010"
};

// =====================================
// LAB 8: INPUT VALIDATION
// =====================================

function validateInputs(instruction, rdName, rsName, rtName) {

    // Check empty instruction
    if (!instruction || instruction.trim() === "") {
        return "Please select an instruction.";
    }

    // Check valid instruction
    instruction = instruction.toUpperCase();

    if (!functionCodes[instruction]) {
        return "Invalid instruction selected.";
    }

    // Check empty registers
    if (!rdName || !rsName || !rtName) {
        return "Please select all three registers.";
    }

    // Check whether register names exist
    if (
        !registers.hasOwnProperty(rdName.toLowerCase()) ||
        !registers.hasOwnProperty(rsName.toLowerCase()) ||
        !registers.hasOwnProperty(rtName.toLowerCase())
    ) {
        return "Invalid register name. Please select valid registers.";
    }

    return "VALID";
}

// =====================================
// MAIN ENCODING FUNCTION
// =====================================

function encodeInstruction(instruction, rdName, rsName, rtName) {

    // Validate inputs before encoding
    const validation = validateInputs(
        instruction, rdName, rsName, rtName
    );

    if (validation !== "VALID") {
        throw new Error(validation);
    }

    instruction = instruction.toUpperCase();

    // Get register numbers
    let rd = registers[rdName.toLowerCase()];
    let rs = registers[rsName.toLowerCase()];
    let rt = registers[rtName.toLowerCase()];

    // R-Type opcode
    let opcode = "000000";

    // Convert registers into 5-bit binary
    let rsBinary = rs.toString(2).padStart(5, "0");
    let rtBinary = rt.toString(2).padStart(5, "0");
    let rdBinary = rd.toString(2).padStart(5, "0");

    // Shift amount
    let shamt = "00000";

    // Get function code
    let funct = functionCodes[instruction];

    // Combine all six fields
    let binary = opcode + rsBinary + rtBinary +
                 rdBinary + shamt + funct;

    // Convert binary into hexadecimal
    let hexadecimal = "0x" +
        parseInt(binary, 2)
        .toString(16)
        .toUpperCase()
        .padStart(8, "0");

    // Return encoding results
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

// =====================================
// LAB 8: CONNECT ENCODE BUTTON
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    const encodeButton = document.getElementById("encodeButton");

    // Check whether button exists
    if (!encodeButton) {
        console.error("Encode button not found.");
        return;
    }

    encodeButton.addEventListener("click", function () {

        // Get values from HTML
        const instruction = document.getElementById("instruction").value;
        const rs = document.getElementById("rs").value;
        const rt = document.getElementById("rt").value;
        const rd = document.getElementById("rd").value;

        try {

            // Validate and encode instruction
            const result = encodeInstruction(
                instruction, rd, rs, rt
            );

            // Display six instruction fields
            document.getElementById("opcode").textContent = result.opcode;
            document.getElementById("rsResult").textContent = result.rs;
            document.getElementById("rtResult").textContent = result.rt;
            document.getElementById("rdResult").textContent = result.rd;
            document.getElementById("shamt").textContent = result.shamt;
            document.getElementById("funct").textContent = result.funct;

            // Display binary and hexadecimal results
            document.getElementById("binaryOutput").textContent = result.binary;
            document.getElementById("hexOutput").textContent = result.hexadecimal;

        } catch (error) {

            // Display error message
            alert(error.message);

            console.log("Input Error:", error.message);
        }
    });
});

// =====================================
// LAB 7: THREE ORIGINAL TEST EXAMPLES
// =====================================

console.log("LAB 7 - ENCODING TESTS");

console.log("TEST 1 - ADD");
console.table(encodeInstruction("ADD", "$a0", "$a1", "$a2"));

console.log("TEST 2 - OR");
console.table(encodeInstruction("OR", "$t0", "$t1", "$t2"));

console.log("TEST 3 - SLT");
console.table(encodeInstruction("SLT", "$s0", "$s1", "$s2"));

// =====================================
// LAB 8: INPUT VALIDATION TESTS
// =====================================

console.log("LAB 8 - VALIDATION TESTS");

const validationTests = [
    ["Valid input", "ADD", "$a0", "$a1", "$a2"],
    ["Empty instruction", "", "$a0", "$a1", "$a2"],
    ["Invalid instruction", "XYZ", "$a0", "$a1", "$a2"],
    ["Empty RD", "SUB", "", "$t1", "$t2"],
    ["Empty RS", "AND", "$t0", "", "$t2"],
    ["Empty RT", "OR", "$t0", "$t1", ""],
    ["Invalid RD", "ADD", "$wrong", "$a1", "$a2"],
    ["Invalid RS", "SUB", "$t0", "wrong", "$t2"],
    ["Invalid RT", "SLT", "$s0", "$s1", "wrong"],
    ["Valid OR input", "OR", "$t0", "$t1", "$t2"]
];

validationTests.forEach(function (test) {

    const [name, instruction, rd, rs, rt] = test;

    console.log(
        name + ":",
        validateInputs(instruction, rd, rs, rt)
    );
});
