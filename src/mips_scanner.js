function MIPS_Character(chr, lineNum, colNum) {
	return {chr: chr, lineNum: lineNum, colNum: colNum};
}

function MIPS_Scanner() {
	this.input = "";
	this.resetStats();
}

MIPS_Scanner.prototype.resetStats = function() {
	this.lineIndex = 0;
	this.colIndex = -1;
	this.sourceIndex = 1;
	this.lastIndex = this.input.length - 1;
}

MIPS_Scanner.prototype.setInput = function(input) {
	this.input = input;
	this.resetStats();
}

MIPS_Scanner.prototype.isReady = function() {
	return this.input.length != 0;
}

MIPS_Scanner.prototype.prevChar = function() {
	this.sourceIndex--;

	if (endOfLine) {
		endOfLine = false;
	}

	this.colIndex--;


}



MIPS_Scanner.prototype.readChar = function() {
	
	
	endOfLine = false;

	var chr = this.input[this.sourceIndex - 1];


	//Check for new line
	if (this.sourceIndex > 0) {
		if (chr == "\n" || chr == "\r\n") {
			this.lineIndex++;
			this.colIndex = -1;
			this.sourceIndex++;
			endOfLine = true;
			return new MIPS_Character(EOL, this.lineIndex, this.colIndex);
		}
	}

	this.colIndex++; //Increase column number
	
	//return end token if end of input has been reached
	if (this.sourceIndex > this.lastIndex) {
		return new MIPS_Character(EOF, this.lineIndex, this.colIndex);
	} 

	
	this.sourceIndex++;
	
	//Else return character
	return new MIPS_Character(chr, this.lineIndex, this.colIndex);

}