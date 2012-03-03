function isWhitespaceChar(chr) {
	return WHITESPACE.indexOf(chr, 0) != -1;
}

function isCommentChar(chr) {
	return chr == COMMENT;
}

function isEndofLine(chr) {
	return chr == EOL;
}

function isEndofFile(chr) {
	return chr == EOF;
}

function isOperandSeperator(chr) {
	return chr == OPERAND_SEPERATOR;
}

function isRegisterStartChar(chr) {
	return chr == REGISTER_START_CHAR;
}

function isRegisterChar(chr) {
	return REGISTER_CHARS.indexOf(chr, 0) != -1;
}

function isDirectiveChar(chr) {
	return chr == DIRECTIVE_START_CHAR;
}

function isHexChar(chr) {
	return chr == HEX_START_CHAR;
}

function isStringChar(chr) {
	return chr == STRING_CHAR;
}

function isPointerStartChar(chr) {
	return chr == POINTER_START;
}

function isPointerEndChar(chr) {
	return chr == POINTER_END;
}

function isIdentifierChar(chr) {
	return IDENTIFIERS.indexOf(chr, 0) != -1;
}

function isLabelChar(chr) {
	return chr == LABEL_END_CHAR;
}

function isIdentifier(chr) {
	return IDENTIFIERS.indexOf(chr, 0) != -1;
}

function isSection(token) {
	return typeof SECTIONS[token]!="undefined";
}

function isDatatype(token) {
	return typeof DATATYPES[token]!="undefined";
}

function isDirective(token) {
	return (typeof DATATYPES[token]!="undefined") || (typeof SECTIONS[token]!="undefined");
}

function isOpcode(token) {
	return opcode_translator.contains(token);
}

function isNumber(chr) {
	return NUMBERS.indexOf(chr, 0) != -1;
}

function isHex(chr) {
	return HEX.indexOf(chr.toLowerCase(), 0) != -1;
}

function getDirectiveDTLength(dir) {
	return DATATYPES[dir][1];
}

function getDirectiveDT(dir) {
	return DATATYPES[dir][0];
}






function decToBin(val, nBits) {

	 var res = (parseInt(val)).toString(2);

     if (typeof nBits != 'undefined') {
     	if (res.length < nBits) {
     			var left = nBits - res.length;
     			for (var i = 0; i < left; i++) {
     				res = '0'+res;
     			} 
     	}
     }

     return res;
}

function binToDec(val) {
	var res = 0;
	for (var i = val.length - 1, b = 0; i >= 0; i--, b++) {
		res += (Math.pow(2,b) * val[i]); 
	}

	return res;
}

function binToHex(val) {
	var res = '';
	for (var i = 0; i < val.length; i = i + 4) {
		var fbits = val.substr(i, 4);
		res = res+parseInt(binToDec(fbits)).toString(16);
	}

	return res;
}