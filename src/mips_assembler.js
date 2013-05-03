var OUTPUT_TYPE = {HEX: 0, BIN: 1};

function MIPS_Assembler() {
	this.init();
	this.outputType = OUTPUT_TYPE.HEX;
}

MIPS_Assembler.prototype.setOutputType = function(type) {
	this.outputType = type;
}

MIPS_Assembler.prototype.init = function(secondPass) {
	this.lastError = "";
	this.parser = new MIPS_Parser();
	this.sections = {};
	this.currentSection;


	if ((typeof secondPass == 'undefined') && !secondPass) {
		this.pass = 1;
		this.symbolTable = new SymbolTable();
		this.intermediate = [];
	} else {
		this.pass = 2;
	}

	this.changeSection('text');

	this.initEvents();
}

MIPS_Assembler.prototype.assembleError = function(error) {

	var err = new Error();
	err.name = "AssemblyError";
	err.message = error;
	err.token = this.parser.token;
	
	throw (err);
}

MIPS_Assembler.prototype.setError = function(errCode, errMsg) {
	this.lastError = {codae: errCode, msg: errMsg};
}

MIPS_Assembler.prototype.assemble = function() {

	try {
		console.time('First Pass');
		this.parser.parse();
		console.timeEnd('First Pass');
		console.log(this.symbolTable.toString());
		this.init(true); //reset
		this.setInput(this.intermediate.join(''));
		console.time('Second Pass');
		this.parser.parse();
		console.timeEnd('Second Pass');
	} catch (e) {
		console.log(e.token.cr.line+":"+e.token.cr.col+" - "+e.message);
	} finally {
		this.init(); //reset
	}

	
}

MIPS_Assembler.prototype.setInput = function(input) {
	this.parser.setInput(input);
}

MIPS_Assembler.prototype.parseLine = function(line) {
	line = line.trim();
}

MIPS_Assembler.prototype.changeSection = function(section) {
	var sec = this.sections[section];

	if (typeof sec == 'undefined') {
		sec = SECTIONS[section];
		this.currentSection = {name: sec.name, lc: sec.address};
	} else {
		this.currentSection = sec;
	}

	this.sections[section] = this.currentSection; 
}

MIPS_Assembler.prototype.incrementLC = function(val) {
	if (typeof val == 'undefined') {
		var val = 4;
	}

	this.currentSection.lc += val;
}

MIPS_Assembler.prototype.setLC = function(val) {
	this.currentSection.lc = parseInt(val);
}

MIPS_Assembler.prototype.getLC = function(val) {
	return this.currentSection.lc.toString(16);
}

MIPS_Assembler.prototype.addSymbol = function(symbol) {
	this.symbolTable.addSymbol(symbol, this.getLC());
}


MIPS_Assembler.prototype._pushIntermediate = function(line) {
	this.intermediate.push(line+"\n ");
}

MIPS_Assembler.prototype._translateOperand = function(token) {
	switch (token.type) {
		case TOKENS.tkRegister:
			return parseInt(REGISTER_SET[token.value]);
		break;
		case TOKENS.tkNumber:
			return token.value;
		break;	
		case TOKENS.tkSymbol:
			if (!this.symbolTable.exists(token.value)) {
				this.assembleError("Label \""+token.value+"\" not in symbol table");
			}
			return parseInt('0x'+this.symbolTable.getAddress(token.value));
		break;					
	}
}

MIPS_Assembler.prototype._rebuildInstruction = function(args) {
	var instruction = args.opcode;
	var operands = '';
	for (var i = 0; i < args.operands.length; i++) {
		var token = args.operands[i];

		switch (token.type) {
			case TOKENS.tkRegister:
				var operand = '$'+token.value;

			break;
			case TOKENS.tkPointer:
				var operand = token.offset.value+"($"+token.pointer.value+")";
			break;
			default:
				var operand = token.value;
			break;
		}

		if (i > 0) {
			operands = operands+',';
		}

		operands = operands+operand;
	}

	return instruction+' '+operands;
}

//Events Handlers
MIPS_Assembler.prototype.initEvents = function() {

	var self = this;
	var eh = this.parser.events;


	eh.addListener('section', function(args) {
			self.changeSection(args.section);
			if (typeof args.location != 'undefined') {
				self.setLC('0x'+args.location);
			}
	});

	
	if (this.pass == 1) {
		eh.addListener('label', function(label) {
			self.addSymbol(label);
			self.incrementLC(0x4);
		});

		eh.addListener('opcode', function(args) {
			self._pushIntermediate(self._rebuildInstruction(args));
			self.incrementLC(0x4);
		});	

		eh.addListener('datadef', function(args) {
			//var charArray = args.value[0].match(/.{1,4}/g); //split into 4 characters (4 bytes)
			
			//parse text
			// TODO: asciiz null terminator
			if (args.type == "asciiz") {
					var byteCount = 0;
					var data = [];
					var text = args.value[0];
					var EOF = false;
					var charIndex = 0;

					while (!EOF) {
						if (charIndex >= text.length)
							EOF = true;

						chrs = text.substr(charIndex, 4);

						chr = "";

						charIndex += 4;


						var escapeCount = 0;
						for (var i = 0; i < chrs.length; i++) {
							if (chrs[i] == '\\') {
								chr = chrs[i]+chrs[i+1];
								i++;
								escapeCount++;
							} else {
								chr += chrs[i];
							}
						}
						
						for (var i = 0; i < escapeCount; i++) {
							chr += text[charIndex++];
						}

						if (chr != "")
							data.push(chr);

						
					}

			}
		});
	}  else {

		eh.addListener('opcode', function(args) {
			var binArray = [];

			function pushBin(val, nBits) {
				binArray.push(decToBin(val, nBits));
			}

			function getRawOperands(operands) {

				var rs = 0x00;
				var rt = 0x00;
				var rd = 0x00;
				var shamt = 0x00;
				var label = 0x00;
				var immediate = 0x00;

				for (var i = 0; i < operands.length; i++) {	
					var operand = self._translateOperand(operands[i]);	
					switch (inst[2][i]) {
						case INSTRUCTION_FIELD.ifRD:
							rd = operand;
						break;
						case INSTRUCTION_FIELD.ifRT:
							rt = operand;
						break;
						case INSTRUCTION_FIELD.ifRS:
							rs = operand;
						break
						case INSTRUCTION_FIELD.ifSA:
							shamt = operand;
						break;		
						case INSTRUCTION_FIELD.ifLabel:
							label = (operand / 4) & 0x03ffffff;
						break;		
						case INSTRUCTION_FIELD.ifImmediate:
							immediate = operand;
						break;		

					}							
					
				}

				return {rd: rd, rt: rt, rs: rs, shamt: shamt, label: label, immediate: immediate};
			}

			
			var inst = opcode_translator.translate(args.opcode);
			var operands = getRawOperands(args.operands);
			
			switch (inst[0]) {
				case INSTRUCTION_CODE.rType:
					pushBin(inst[1], 6); //opcode
					pushBin(operands.rs, 5); //rs
					pushBin(operands.rt, 5); //rt
					pushBin(operands.rd, 5); //rd
					pushBin(operands.shamt, 5); //shamt
					pushBin(inst[3], 6); //func
				break;
				case INSTRUCTION_CODE.iType:
					pushBin(inst[1], 6); //opcode
					pushBin(operands.rs, 5); //rs
					pushBin(operands.rt, 5); //rt
					pushBin(operands.immediate, 16); //value
				break;				
				case INSTRUCTION_CODE.jType:
					pushBin(inst[1], 6); //opcode
					pushBin(operands.label, 26); //label
				break;		
			}

			if (self.outputType == OUTPUT_TYPE.HEX) {
				write_out(binToHex(binArray.join('')));
			} else {
				write_out(binArray.join(''));
			}
			



			self.incrementLC(binArray);
		});
	}

}
