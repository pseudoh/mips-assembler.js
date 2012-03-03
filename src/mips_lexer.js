function MIPS_Lexer() {
	this.scanner = new MIPS_Scanner();
	this.prevToken = TOKENS.tkUnknown;
	this.cr = null;
	this.lastChar = '';
}

MIPS_Lexer.prototype.newToken = function(tokenType, tokenValue) {
	var cr = this.cr;
	var tokenValue = tokenValue || '';
	var col = (cr.col) - tokenValue.length; //Set column number to beginning of token
	var cr = {line: cr.line, col:col};

	var token =  {type: tokenType, value: tokenValue, cr: cr};
	this.prevToken = token;
	return token;
}

MIPS_Lexer.prototype.setInput = function(input) {
	this.scanner.setInput(input);
}

MIPS_Lexer.prototype.isReady = function() {
	if (this.scanner.isReady()) {
		return true;
	} else {
		MIPS_ERROR.setError("Scanner Not Read: No input specified");
		return false;
	}
}

MIPS_Lexer.prototype.nextToken = function() {
	var self = this;
	var chr = '';
    
	function nextChar() {
		var scan = self.scanner.readChar();
		self.cr = {line: scan.lineNum, col: scan.colNum};
		chr = scan.chr;
	}
	function prevChar() {
		var scan = self.scanner.prevChar();
	}


	nextChar();

	while (isWhitespaceChar(chr)) {
		nextChar();
	}

	//Check if comment character and consume all characters until end of line
	if (isCommentChar(chr)) {
		while (!isEndofLine(chr)) {
			nextChar();
		}
	}

	//Check whether a new line has been reached
	if (isEndofLine(chr)) {
		nextChar();
		return this.newToken(TOKENS.tkNewLine);
	}

	//Generate token tkEnd if end of stream is reached
	if (isEndofFile(chr)) {
		return this.newToken(TOKENS.tkEnd);
	}

	//Check for operator seperator character and create token
	if (isOperandSeperator(chr)) {
		return this.newToken(TOKENS.tkOpSeperator);
	}


	//Scan for registers
	if (isRegisterStartChar(chr)) {
		nextChar();
		var tokenVal = '';
		while (isRegisterChar(chr)) {
			tokenVal += chr;
			nextChar();
		}
		prevChar(); //Go back one character
		return this.newToken(TOKENS.tkRegister, tokenVal);
	}


	//Scan for directives
	if (isDirectiveChar(chr)) {
		nextChar();
		var tokenVal = '';
		while (isIdentifier(chr)) {
			tokenVal += chr;
			nextChar();
		}
		prevChar();
		return this.newToken(TOKENS.tkDirective, tokenVal);
	}

	//Scan for numbers, including hex
	if (isNumber(chr)) {
		var tokenType = TOKENS.tkNumber; //Set initital token type to Number. Change in case of Hex
		var tokenVal = chr;
		nextChar();
		if (isHexChar(chr)) {
			tokenVal = '';
			tokenType = TOKENS.tkHex;
			nextChar();
			while (isHex(chr)) {
				tokenVal += chr;
				nextChar();
			}
		} else {
			
			while (isNumber(chr)) {
				tokenVal += chr;
				nextChar();
			} 
		}

		prevChar();
		return this.newToken(tokenType, tokenVal);
	}

	if (isPointerStartChar(chr)) {
		return this.newToken(TOKENS.tkPointerStart, POINTER_START);
	}

	if (isPointerEndChar(chr)) {
		return this.newToken(TOKENS.tkPointerEnd, POINTER_END);
	}

	if (isStringChar(chr)) {
		var tokenVal = '';
		nextChar();

		while (!isStringChar(chr)) { //If End of string is not reached. End of string is the character "

			tokenVal += chr;
			nextChar();

			if (isEndofFile(chr)) {
				return this.newToken(TOKENS.tkEnd);
			}

			if (isEndofLine(chr)) {
				return this.newToken(TOKENS.tkNewLine);
			}

		}

		return this.newToken(TOKENS.tkString, tokenVal);

	}

	if (isIdentifierChar(chr)) {
		var tokenVal = '';
		var tokenType = TOKENS.tkSymbol;

		while (isIdentifier(chr)) {
			tokenVal += chr;
			nextChar();
			if (isLabelChar(chr)) {
				tokenType = TOKENS.tkLabel;
			}
		}

		if ((tokenType !== TOKENS.tkLabel) && (isOpcode(tokenVal))) {
			tokenType = TOKENS.tkOpcode, tokenVal;
		} 

		if (tokenType == TOKENS.tkSymbol) {
			prevChar();
		}
		
		return this.newToken(tokenType, tokenVal);
		
	}


	return  this.newToken(TOKENS.tkUnknown, tokenVal);



}