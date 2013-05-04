function MIPS_Parser() {
	this.lexer = new MIPS_Lexer();
	this.symbolTable = new SymbolTable();

	//Events
	this.events = new EventTarget();
}

MIPS_Parser.prototype.init = function() {
	this.token = null;
	this.prevToken = null;
	this.currentSection = SECTIONS.text;	
}

MIPS_Parser.prototype.setInput = function(input) {
	this.lexer.setInput(input);
}

MIPS_Parser.prototype.parseError = function(error) {
	var err = new Error();
	err.name = "";
	err.message = error;
	err.token = this.token;
	throw (err);
}

MIPS_Parser.prototype.nextToken = function() {
	this.token = this.lexer.nextToken();
}

MIPS_Parser.prototype.getToken = function() {
	return this.token;
}

MIPS_Parser.prototype.getTokenType = function() {
	return this.token.type;
}

MIPS_Parser.prototype.getTokenValue = function() {
	return this.token.value;
}

MIPS_Parser.prototype.assemble = function(type, args) {
	this.events.fire(type, args);
}

MIPS_Parser.prototype.consume = function(expectedToken) {

	this.prevToken = {type: this.token.type, value: this.token.value, cr: this.token.cr}; //A dirty object-cloning solution (or is it?)
	
	if (typeof expectedToken !== "undefined") {
		if (this.expect(expectedToken)) {
			this.nextToken();
		}
	} else {
		this.nextToken();
	}

}

MIPS_Parser.prototype.expect = function(expectedToken, token2, errorMsg) {

	if (this.getTokenType() == expectedToken) {
		return true;
	} else {

		if (typeof token2 !== "undefined") {
			if (this.getTokenType() == token2) {
				return true;
			}
		}

		return false;
	}

}

MIPS_Parser.prototype.statement = function() {
	var self = this;
	switch (this.getTokenType()) {
		case TOKENS.tkDirective:

			this.directiveStatement();
		break;
		case TOKENS.tkLabel: 
			this.labelStatement();
		break;
		case TOKENS.tkOpcode:
			this.instructionStatement();
		break;
		case TOKENS.tkNewLine:
			this.consume(TOKENS.tkNewLine);
		break;
		default:
			this.parseError("Unexpected token");
		break;
	}

}

MIPS_Parser.prototype.parse = function() {
		
	try {
		this.init();

		this.nextToken();

		while (this.getTokenType() != TOKENS.tkEnd) {

			this.statement();

		}
	} catch (e) {
		throw (e);
	}

}

MIPS_Parser.prototype.labelStatement = function() {
	var label = this.getTokenValue();
	this.assemble('label', label);
	this.consume(TOKENS.tkLabel);


	
	/*if (this.getTokenType() == TOKENS.tkDirective) {
		this.directiveStatement();
	}*/
	
}

MIPS_Parser.prototype.directiveStatement = function() {

		var dir = this.getTokenValue();
		var prevToken = this.prevToken;
		this.consume(TOKENS.tkDirective);

		if (isSection(dir)) {
			
			this.currentSection = SECTIONS[dir];
			
			var location = this.parseDtValue(dir, true);
			this.assemble('section', {section: dir, location:location});

		} else if (isDatatype(dir)) {
			
			if (this.currentSection === SECTIONS.data) {

				//Check if labels has been assigned

				if (!isLabeledDirective(dir) || prevToken.type == TOKENS.tkLabel) {
					var val = this.parseDtValue(dir);
					this.assemble('datadef', {type: dir, value:val});
				} else {
					this.parseError("Label hasn't been assigned");
				}

			
			} else {
				this.parseError(dir+" directive cannot appear in "+this.currentSection.name+" segment");
			} 

		} else {
			this.parseError("Unknown directive "+dir);
		}
	

}

/**
** Parses the value of a datatype
**/
MIPS_Parser.prototype.parseDtValue = function(dir, isSection) { 

	var self = this;

	function checkValue(type) {
		switch (type) {
			case DATATYPES_VALUES.dtString:
				return self.expect(TOKENS.tkString);
			break;
			case DATATYPES_VALUES.dtHex:
				return self.expect(TOKENS.tkHex);
			break;
			case DATATYPES_VALUES.dtSymbol:
				return self.expect(TOKENS.tkSymbol);
			break;
		}

		return false;
	}

	if (typeof isSection != "undefined" && isSection) {
		if (this.expect(TOKENS.tkHex)) {
			var hexLocation = this.getTokenValue();
			this.consume(TOKENS.tkHex);
			return hexLocation;
		}
	} else {

		var valCount = getDirectiveDTLength(dir);
		var valTypes = getDirectiveDT(dir);
		var val = [];
		if (valCount == 0) {
			var valType = valTypes[0];
			while (!this.expect(TOKENS.tkNewLine) && !this.expect(TOKENS.tkEnd)) {
				if (checkValue(valType)) {
					val.push(this.getTokenValue());
					this.consume();
				} else {
					self.parseError("Unexpected Value");
				}
			}
		} else {
		
			for (var i = 0; i < valCount; i++) {
				var valType = valTypes[i];
				if (checkValue(valType)) {
					val.push(this.getTokenValue());
					this.consume();
				} else {
					self.parseError("Unexpected Value");
				}
			}
		}
		return val;
	}

}

MIPS_Parser.prototype.instructionStatement = function() {
	var self = this;
	function checkTextSection() {
		if (self.currentSection.name == 'text') {
			return true;
		} else {
			self.parseError("instruction can't be in "+SECTIONS[self.currentSection]+" section, move to text section");
		}
	}

	//Check whether instruction is in correct section
	checkTextSection();

	var opcode = this.getTokenValue();
	var operands = [];   
    var instructionType = opcode_translator.getInstructionTypeByName(opcode);

    this.consume(TOKENS.tkOpcode);

	switch (instructionType) {

		case INSTRUCTION_CODE.rType: 
			operands = this.rInstructionStatement(opcode);
		break;

		case INSTRUCTION_CODE.iType: 
			operands = this.iInstructionStatement(opcode);
		break;

		case INSTRUCTION_CODE.jType: 
			operands = this.jInstructionStatement(opcode);
		break;				
	}

	

	if (this.expect(TOKENS.tkNewLine) || this.expect(TOKENS.tkEnd)) {
		this.consume();
	} else {
		self.parseError("Expected New Line");
	}

	this.assemble('opcode', {opcode: opcode, operands: operands})
	
}



MIPS_Parser.prototype._expectOperandSeperator = function() {
	if (this.expect(TOKENS.tkOpSeperator)) {
		this.consume(TOKENS.tkOpSeperator);
	}
}

MIPS_Parser.prototype._validRegister = function(register) {
	if (typeof REGISTER_SET[register.value] == 'undefined') {
		this.parseError("invalid register specified ");
	}
}

MIPS_Parser.prototype.rInstructionStatement = function(opcode) {
	var instruction = opcode_translator.translate(opcode);
	var operands = [];

	if (instruction != INSTRUCTION_CODE.iError) {
		var	fieldCount = instruction[2].length || 0;
		

		for (var regIndex = 0; regIndex < fieldCount; regIndex++) {

			var fieldType = instruction[2][regIndex];

			if ((fieldType == INSTRUCTION_FIELD.ifRT) || (fieldType == INSTRUCTION_FIELD.ifRS) || (fieldType == INSTRUCTION_FIELD.ifRD)) {
				if (this.expect(TOKENS.tkRegister)) {
					this._validRegister(this.getToken());
					operands.push(this.getToken());
					this.consume(TOKENS.tkRegister);
				} else {
					this.parseError("operand is of incorrect type. Register expected");
				}

			} else if (fieldType == INSTRUCTION_FIELD.ifSA) {

				if (this.expect(TOKENS.tkNumber)) {
					operands.push(this.getToken());
					this.consume(TOKENS.tkNumber);
				} else {
					this.parseError("operand is of incorrect type. Expected number value");
				}		

			} 

			this._expectOperandSeperator();

		}
	} else {

		this.parseError("Unknown Instruction");
	}

	return operands;

}

MIPS_Parser.prototype.iInstructionStatement = function(opcode) {


	var instruction = opcode_translator.translate(opcode);
	var operands = [];

	if (instruction != INSTRUCTION_CODE.iError) {
		var	fieldCount = instruction[2].length;
		
		for (var fieldIndex = 0; fieldIndex < fieldCount; fieldIndex++) {

			var fieldType = instruction[2][fieldIndex];



			if ((fieldType == INSTRUCTION_FIELD.ifRT) || (fieldType == INSTRUCTION_FIELD.ifRS)) {

				if (this.expect(TOKENS.tkRegister)) {
					this._validRegister(this.getToken());
					operands.push(this.getToken());
					this.consume(TOKENS.tkRegister);
				} else {
					this.parseError("operand is of incorrect type. Register expected");
				}

			} else if (fieldType == INSTRUCTION_FIELD.ifSA) {

				if (this.expect(TOKENS.tkNumber)) {
					operands.push(this.getToken());
					this.consume(TOKENS.tkNumber);
				} else {
					this.parseError("operand is of incorrect type. Expected number value");
				}		

			} else if(fieldType == INSTRUCTION_FIELD.ifImmediate) {
				
				if (this.expect(TOKENS.tkNumber, TOKENS.tkHex)) {
					operands.push(this.getToken());
					this.consume();
				} else {
					this.parseError("operand is of incorrect type. Expected immediate value");
				}

			} else if(fieldType == INSTRUCTION_FIELD.ifLabel) {

				if (this.expect(TOKENS.tkSymbol)) {
					operands.push(this.getToken());
					this.consume(TOKENS.tkSymbol);
				} else {
					this.parseError("operand is of incorrect type. label expected");
				}

			} else if(fieldType == INSTRUCTION_FIELD.ifImmediatePointer) {
					
					var operandVal = {type: TOKENS.tkPointer, offset: {}, pointer: {}};
					
					if (this.expect(TOKENS.tkNumber) || this.expect(TOKENS.tkSymbol)) {
						operandVal.offset = this.getToken();
						this.consume();
					}


				
					if (this.expect(TOKENS.tkPointerStart)) {
						this.consume(TOKENS.tkPointerStart);
						if (this.expect(TOKENS.tkRegister)) {
							this._validRegister(this.getToken());
							operandVal.pointer = this.getToken();
							this.consume(TOKENS.tkRegister);
							if (this.expect(TOKENS.tkPointerEnd)) {
								this.consume(TOKENS.tkPointerEnd);
							} else {
								this.parseError("operand is of incorrect type. Expected Close Brackets");
							}
						} else {
							this.parseError("operand is of incorrect type. Expected Register");
						}
					} else {
						this.parseError("operand is of incorrect type. Expected Open Brackets");
					}
				operands.push(operandVal);
			}



			this._expectOperandSeperator();
			
		}
	} else {
		this.parseError("Unknown Instruction");
	}

	return operands;
}

MIPS_Parser.prototype.jInstructionStatement = function(opcode) {
	var instruction = opcode_translator.translate(opcode);
	var operands = [];

	if (instruction != INSTRUCTION_CODE.iError) {
		var	fieldCount = instruction[2].length;

		for (var regIndex = 0; regIndex < fieldCount; regIndex++) {

			if (this.expect(TOKENS.tkSymbol)) {
				operands.push(this.getToken());
				this.consume(TOKENS.tkSymbol);
			}
		}
	} else {
		this.parseError("Unknown Instruction");
	}

	return operands;
}