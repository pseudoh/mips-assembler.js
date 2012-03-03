var MIPS_ERROR = { 

	lastError: {},
	setError: function(errMsg, errCode) {
		this.lastError = {msg: errMsg, code: errCode};
	},

	getError: function() {
		return this.lastError;
	}

}