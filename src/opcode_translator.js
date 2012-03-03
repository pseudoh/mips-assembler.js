var opcode_translator = {


	//R-Type: [type, opcode, function, registers[]]
	//I-Type: [type, opcode, function, [[used, type, default_value]], rt_default_value=(-1 for no default)]
	opcodes  : { //R-Type Instructions
			   "add"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x20], 
			   "addu"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x21], 
			   "and"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x24],
			   "break"    : [INSTRUCTION_CODE.rType, 0x00, [], 0x0D],
			   "div"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x0D],
			   "divu"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x1B],
			   "jalr"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS], 0x09],
			   "jr"       : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS], 0x08],
			   "mfhi"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD], 0x10],
			   "mflo"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD], 0x12],
			   "mthi"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS], 0x11],
			   "mtlo"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS], 0x13],
			   "mult"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x18],
			   "multu"    : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x19],
			   "move"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS], 0x19],
			   "nor"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x27],
			   "or"       : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x25],
			   "sll"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifSA], 0x00],
			   "sllv"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS], 0x04],
			   "slt"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x2A],
			   "sltu"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x2B],
			   "sra"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifSA], 0x03],
			   "srav"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS], 0x07],
			   "srl"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifSA], 0x02],
			   "srlv"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS], 0x06],
			   "sub"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x22],
			   "subu"     : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x22],
			   "syscall"  : [INSTRUCTION_CODE.rType, 0x00, [], 0x0C],
			   "xor"      : [INSTRUCTION_CODE.rType, 0x00, [INSTRUCTION_FIELD.ifRD, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT], 0x26],
			   //I-Type Instructions
			   "addi"     : [INSTRUCTION_CODE.iType, 0x08, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "addiu"    : [INSTRUCTION_CODE.iType, 0x09, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "andi"     : [INSTRUCTION_CODE.iType, 0x0C, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "beq"      : [INSTRUCTION_CODE.iType, 0x04, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifLabel]],
			   "bgez"     : [INSTRUCTION_CODE.iType, 0x01, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifLabel], 1],
			   "bgtz"     : [INSTRUCTION_CODE.iType, 0x07, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifLabel], 0],
			   "blez"     : [INSTRUCTION_CODE.iType, 0x06, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifLabel], 0],
			   "bltz"     : [INSTRUCTION_CODE.iType, 0x01, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifLabel], 0],
			   "bne"      : [INSTRUCTION_CODE.iType, 0x05, [INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifLabel]],
			   "lb"       : [INSTRUCTION_CODE.iType, 0x20, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "lbu"      : [INSTRUCTION_CODE.iType, 0x24, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "lh"       : [INSTRUCTION_CODE.iType, 0x21, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "lhu"      : [INSTRUCTION_CODE.iType, 0x25, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "lui"      : [INSTRUCTION_CODE.iType, 0x0F, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediate]],
			   "li"       : [INSTRUCTION_CODE.iType, 0x0F, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediate]],
			   "lw"       : [INSTRUCTION_CODE.iType, 0x23, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "lwcl"     : [INSTRUCTION_CODE.iType, 0x31, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "ori"      : [INSTRUCTION_CODE.iType, 0x0D, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "sb"       : [INSTRUCTION_CODE.iType, 0x28, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "slti"     : [INSTRUCTION_CODE.iType, 0x09, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "sltiu"    : [INSTRUCTION_CODE.iType, 0x0B, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   "sh"       : [INSTRUCTION_CODE.iType, 0x29, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "sw"       : [INSTRUCTION_CODE.iType, 0x2B, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "swcl"     : [INSTRUCTION_CODE.iType, 0x39, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifImmediatePointer]],
			   "xori"     : [INSTRUCTION_CODE.iType, 0x0E, [INSTRUCTION_FIELD.ifRT, INSTRUCTION_FIELD.ifRS, INSTRUCTION_FIELD.ifImmediate]],
			   //J-Type Instructions
			   "j"        : [INSTRUCTION_CODE.jType, 0x02, [INSTRUCTION_FIELD.ifLabel]],
			   "jal"      : [INSTRUCTION_CODE.jType, 0x03, [INSTRUCTION_FIELD.ifLabel]]
			   //Coprocessor Instructions
			   
			},

			translate: function(instruction) {
				var opcode = this.opcodes[instruction];
		
				if (typeof opcode == "undefined") {
					return [INSTRUCTION_CODE.iError];
				} else {
					return opcode;
				}
			},

			getInstructionType: function(opcode) {
				switch (opcode) {
					case 0x00:
						return INSTRUCTION_CODE.rType;
					break;
					case 0x02:
						return INSTRUCTION_CODE.jType;
					break;
					case 0x03:
						return INSTRUCTION_CODE.jType;
					break;
					case 0x11:
						return INSTRUCTION_CODE.coProc;
					break;
					default:
						return INSTRUCTION_CODE.iType;
					break;
				}
				
			},

			getInstructionTypeByName: function(instruction) {
				var inst = this.translate(instruction);
				return this.getInstructionType(inst[1]);
				
			},

			contains: function(opcode) {
				return typeof this.opcodes[opcode]!="undefined"
			},

			translateHex: function(opcode, func) {
				for (instruction in this.opcodes) {
					var vl = this.opcodes[instruction];
					switch (this.getInstructionType(opcode)) {
						case INSTRUCTION_CODE.rType: 
							if ((vl[1] == opcode) && (vl[2] == func)) {
								return {token: instruction, data: vl};
							}
						break;

						case INSTRUCTION_CODE.iType:
							if (vl[1] == opcode) {
								return {token: instruction, data: vl};
							}
						break;

						case INSTRUCTION_CODE.jType:
							if (vl[1] == opcode) {
								return {token: instruction, data: vl};
							}
						break;

						default:
							return {token: "invalid"};
						break;

					}
					
				}
			}
}