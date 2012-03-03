function SymbolTable() {

	this.entries = {};

}

SymbolTable.prototype.addPredefined = function() {
	//Add Register Set
	for (register in REGISTER_SET) {
		this.entries[register] = REGISTER_SET[register]; 
	}
}

SymbolTable.prototype.addSymbol = function(symbol, address) {
	if (typeof this.entries[symbol] == "undefined") {
		this.entries[symbol] = address;
		
		return true;
	} else {
		return false;
	}
}

SymbolTable.prototype.getAddress = function(symbol) {
	return this.entries[symbol];
}

SymbolTable.prototype.exists = function(symbol) {
	return typeof this.entries !== "undefined";
}

SymbolTable.prototype.toString = function(delimiter) {
	var res = '';
	var delimiter = delimiter || "\n";
	for (var symbol in this.entries) {
		var res =  res+"Symbol: "+symbol+", Address: "+this.entries[symbol]+delimiter;
	}

	return res;
}