var INSTRUCTION_CODE = {iError: -1, rType : 0, iType : 1, jType : 2, coProc : 3};
var INSTRUCTION_FIELD = {ifRS: 0, ifRT: 1, ifRD: 2, ifSA: 3, ifImmediate: 4, ifImmediatePointer:5, ifLabel: 6};

var TOKENS = {
	tkComment : 0,
	tkOpcode : 1,
	tkSymbol : 2,
	tkString : 3,
	tkNumber: 4,
	tkHex: 5,
	tkPointerStart: 6,
	tkPointerEnd: 7,
	tkOffset: 8,
	tkRegister : 9,
	tkLabel: 10,
	tkOpSeperator: 11,
	tkDirective: 12,
	tkUnknown: 13,
	tkEnd: 14,
	tkSpace: 15,
	tkTab: 16,
	tkNewLine: 17,
	tkWhitespace: 18,
	tkPointer: 19
};

COMMENT = "#";
WHITESPACE = " \t";
EOF = 'EOF';
EOL = 'EOL';
OPERAND_SEPERATOR = ',';
ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';
NUMERALS = '0123456789';
NUMBERS = NUMERALS+'+-'
HEX_START_CHAR = 'x';
HEX = NUMBERS+'abcdef';
IDENTIFIERS = ALPHABETS+NUMERALS+"._$";

LABEL_END_CHAR = ':';
STRING_CHAR = '"';
DIRECTIVE_START_CHAR = '.';
POINTER_START = '(';
POINTER_END = ')';

REGISTER_START_CHAR = '$';
REGISTER_CHARS = ALPHABETS+NUMBERS;


var REGISTER_SET = {
	"zero": 0,
	"at": 1,
	"v0": 2,
	"v1": 3,
	"a0": 4,
	"a1": 5,
	"a2": 6,
	"a3": 7,
	"t0": 8,
	"t1": 9,
	"t2": 10,
	"t3": 11,
	"t4": 12,
	"t5": 13,
	"t6": 14,
	"t7": 15,
	"s0": 16,
	"s1": 17,
	"s2": 18,
	"s3": 19,
	"s4": 20,
	"s5": 21,
	"s6": 22,
	"s7": 23,
	"t8": 24,
	"t9": 25,
	"k0": 26,
	"k1": 27,
	"gp": 28,
	"sp": 29,
	"fp": 30,
	"ra": 31
}




var DATATYPES_VALUES = {
	dtString: 0, 
	dtHex: 1, 
	dtDouble: 3, 
	dtFloat: 4, 
	dtByte: 5, 
	dtHalfWord: 6, 
	dtWord: 7, 
	dtSymbol: 8
};


// Datatype : [type: [array of datatype_values], length: number of arguments allowed (0 is infinite), labeled: true/false whether a label is required]
var DATATYPES = {
	"align"   : {types: [DATATYPES_VALUES.dtHex],      length: 1, labeled: true},
	"ascii"   : {types: [DATATYPES_VALUES.dtString],   length: 1, labeled: true},
	"asciiz"  : {types: [DATATYPES_VALUES.dtString],   length: 1, labeled: true},
	"byte"    : {types: [DATATYPES_VALUES.dtByte],     length: 0, labeled: true},
	"double"  : {types: [DATATYPES_VALUES.dtDouble],   length: 0, labeled: true},
	"float"   : {types: [DATATYPES_VALUES.dtFloat],    length: 0, labeled: true},
	"global"  : {types: [DATATYPES_VALUES.dtSymbol],   length: 1, labeled: false},
	"half"    : {types: [DATATYPES_VALUES.dtHalfWord], length: 0, labeled: true},
	"word"    : {types: [DATATYPES_VALUES.dtWord],     length: 0, labeled: true},
	"space"   : {types: [DATATYPES_VALUES.dtByte],     length: 1, labeled: true},
	"extern"  : {types: [DATATYPES_VALUES.dtSymbol, DATATYPES_VALUES.dtByte], length: 2, labeled: true}
}

var SECTIONS = {
	text   : {name: 'text',   address: 0x00400000},
	data   : {name: 'data',   address: 0x10010000},
	extern : {name: 'extern', address: 0x10000000},
	heap   : {name: 'heap',    address: 0x10040000},
	kdata  : {name: 'kdata',  address: 0x90000000},
	mmio   : {name: 'MMIO',    address: 0xffff0000}
	//	rdata: "rdata",
	//	lit8: "lit8",
	//	lit4: "lit4",
	//	sdata: "sdata",
	//	sbss: "sbss",
	//	bss: "bss"
}

