/*
var start = new Point(150,100);
var through = new Point(150,150);
var to = new Point(400,150);
var path = new Path.Arc(start,through,to);
path.strokeColor="black";
*/

var books = setupBooks();

//console.log("books.length=" + books.length);

var r = 250
var start, end;

var numBooks = 66;
var buffer = 1.2; // degree buffer per each end of each book
var bkSize = (360 - (buffer * numBooks)) / 66;
var totalChapterCount = 1189;

var degPerChapter = (360 - (buffer * numBooks))/totalChapterCount;
console.log("degPerChapter = " + degPerChapter);

var lastStart = 0;
var bkNum = 0;
var chpNum = 0;

for (var bkNum = 0; bkNum < books.length; bkNum++) {
	chpNum += books[bkNum].numChapters;
	var bkSize = degPerChapter * books[bkNum].numChapters;

	//drawArcs(r, toRad(lastStart), toRad( lastStart + bkSize ));
	drawArcs(r, toRad(lastStart), toRad( lastStart + bkSize ), getColor(books[bkNum]));
	console.log("Processing book: " + books[bkNum].bkName + "; numChapters: " + bkSize + "; lastStart: " + lastStart);
	lastStart += bkSize + buffer;
}

console.log("chpNum = " + chpNum);

var pRect = new Path.Rectangle(new Rectangle(new Point(0,0), new Size(600,600)));
pRect.strokeColor = "blue";

function toRad(deg) {
	return(deg * (2 * Math.PI/360));
}

function getColor(book) {
	if(book.bkAbbrev.substring(0,2)=="OT") {
		return("green");
	} else {
		return("blue");
	}
}
		
function drawArcs(r, a1, a2, color) {
	var startA, endB;
	var startB, endB;
	var pLine, pColor;
	
	pColor = color;
	
	drawArc(r, a1, a2);
	startA = start; endA = end;

	drawArc(r+20, a1, a2);
	startB = start; endB = end;

	pLine = new Path.Line(startA, startB);
	pLine.strokeColor = pColor;

	pLine = new Path.Line(endA, endB);
	pLine.strokeColor = pColor;
	
}

function drawArc(r, a1, a2) {

	var fixr = 300;

	var a1b = (Math.min(a1,a2) + (Math.abs(a1-a2)/2));

	var ax = fixr + ( r * (Math.cos(a1)));
	var ay = fixr + ( r * (Math.sin(a1)));
	var bx = fixr + ( r * (Math.cos(a1b)));
	var by = fixr + ( r * (Math.sin(a1b)));
	var cx = fixr + ( r * (Math.cos(a2)));
	var cy = fixr + ( r * (Math.sin(a2)));

	//alert(a1 + " -> " + a1b + " -> " + a2 + "\n\n" + ax + "," + ay + ";\n" + bx + "," + by + ";\n" + cx + "," + cy);

	var begin = new Point(ax,ay);
	var through = new Point(bx,by);
	var to = new Point(cx,cy);
	var path = new Path.Arc(begin,through,to);
	path.strokeColor="green";

	// var p1 = new Path.Line(new Point(fixr,fixr), new Point(ax, ay));
	// p1.strokeColor = "orange";

	// var p2 = new Path.Line(new Point(fixr,fixr), new Point(bx, by));
	// p2.strokeColor = "red";

	// var p3 = new Path.Line(new Point(fixr,fixr), new Point(cx, cy));
	// p3.strokeColor = "blue";

	start = begin;
	end   = to;
}

function setupBooks() {
	var books = [];
	books.length=0;
	books.push({ "bkAbbrev": "OTGen", "bkName":"Gen", "numChapters":50 });
	books.push({ "bkAbbrev": "OTExo", "bkName":"Exo", "numChapters":40 });
	books.push({ "bkAbbrev": "OTLev", "bkName":"Lev", "numChapters":27 });
	books.push({ "bkAbbrev": "OTNum", "bkName":"Num", "numChapters":36 });
	books.push({ "bkAbbrev": "OTDeu", "bkName":"Deu", "numChapters":34 });
	books.push({ "bkAbbrev": "OTJos", "bkName":"Jos", "numChapters":24 });
	books.push({ "bkAbbrev": "OTJdg", "bkName":"Jdg", "numChapters":21 });
	books.push({ "bkAbbrev": "OTRut", "bkName":"Rut", "numChapters":4 });
	books.push({ "bkAbbrev": "OT1Sa", "bkName":"1Sa", "numChapters":31 });
	books.push({ "bkAbbrev": "OT2Sa", "bkName":"2Sa", "numChapters":24 });
	books.push({ "bkAbbrev": "OT1Ki", "bkName":"1Ki", "numChapters":22 });
	books.push({ "bkAbbrev": "OT2Ki", "bkName":"2Ki", "numChapters":25 });
	books.push({ "bkAbbrev": "OT1Ch", "bkName":"1Ch", "numChapters":29 });
	books.push({ "bkAbbrev": "OT2Ch", "bkName":"2Ch", "numChapters":36 });
	books.push({ "bkAbbrev": "OTEzr", "bkName":"Ezr", "numChapters":10 });
	books.push({ "bkAbbrev": "OTNeh", "bkName":"Neh", "numChapters":13 });
	books.push({ "bkAbbrev": "OTEst", "bkName":"Est", "numChapters":10 });
	books.push({ "bkAbbrev": "OTJob", "bkName":"Job", "numChapters":42 });
	books.push({ "bkAbbrev": "OTPsa", "bkName":"Psa", "numChapters":150 });
	books.push({ "bkAbbrev": "OTPro", "bkName":"Pro", "numChapters":31 });
	books.push({ "bkAbbrev": "OTEcc", "bkName":"Ecc", "numChapters":12 });
	books.push({ "bkAbbrev": "OTSol", "bkName":"Sol", "numChapters":8 });
	books.push({ "bkAbbrev": "OTIsa", "bkName":"Isa", "numChapters":66 });
	books.push({ "bkAbbrev": "OTJer", "bkName":"Jer", "numChapters":52 });
	books.push({ "bkAbbrev": "OTLam", "bkName":"Lam", "numChapters":5 });
	books.push({ "bkAbbrev": "OTEze", "bkName":"Eze", "numChapters":48 });
	books.push({ "bkAbbrev": "OTDan", "bkName":"Dan", "numChapters":12 });
	books.push({ "bkAbbrev": "OTHos", "bkName":"Hos", "numChapters":14 });
	books.push({ "bkAbbrev": "OTJoe", "bkName":"Joe", "numChapters":3 });
	books.push({ "bkAbbrev": "OTAmo", "bkName":"Amo", "numChapters":9 });
	books.push({ "bkAbbrev": "OTOba", "bkName":"Oba", "numChapters":1 });
	books.push({ "bkAbbrev": "OTJon", "bkName":"Jon", "numChapters":4 });
	books.push({ "bkAbbrev": "OTMic", "bkName":"Mic", "numChapters":7 });
	books.push({ "bkAbbrev": "OTNah", "bkName":"Nah", "numChapters":3 });
	books.push({ "bkAbbrev": "OTHab", "bkName":"Hab", "numChapters":3 });
	books.push({ "bkAbbrev": "OTZep", "bkName":"Zep", "numChapters":3 });
	books.push({ "bkAbbrev": "OTHag", "bkName":"Hag", "numChapters":2 });
	books.push({ "bkAbbrev": "OTZec", "bkName":"Zec", "numChapters":14 });
	books.push({ "bkAbbrev": "OTMal", "bkName":"Mal", "numChapters":4 });
	books.push({ "bkAbbrev": "NTMt", "bkName":"Mt", "numChapters":28 });
	books.push({ "bkAbbrev": "NTMr", "bkName":"Mr", "numChapters":16 });
	books.push({ "bkAbbrev": "NTLu", "bkName":"Lu", "numChapters":24 });
	books.push({ "bkAbbrev": "NTJoh", "bkName":"Joh", "numChapters":21 });
	books.push({ "bkAbbrev": "NTAc", "bkName":"Ac", "numChapters":28 });
	books.push({ "bkAbbrev": "NTRo", "bkName":"Ro", "numChapters":16 });
	books.push({ "bkAbbrev": "NT1Co", "bkName":"1Co", "numChapters":16 });
	books.push({ "bkAbbrev": "NT2Co", "bkName":"2Co", "numChapters":13 });
	books.push({ "bkAbbrev": "NTGa", "bkName":"Ga", "numChapters":6 });
	books.push({ "bkAbbrev": "NTEph", "bkName":"Eph", "numChapters":6 });
	books.push({ "bkAbbrev": "NTPhp", "bkName":"Php", "numChapters":4 });
	books.push({ "bkAbbrev": "NTCol", "bkName":"Col", "numChapters":4 });
	books.push({ "bkAbbrev": "NT1Th", "bkName":"1Th", "numChapters":5 });
	books.push({ "bkAbbrev": "NT2Th", "bkName":"2Th", "numChapters":3 });
	books.push({ "bkAbbrev": "NT1Ti", "bkName":"1Ti", "numChapters":6 });
	books.push({ "bkAbbrev": "NT2Ti", "bkName":"2Ti", "numChapters":4 });
	books.push({ "bkAbbrev": "NTTit", "bkName":"Tit", "numChapters":3 });
	books.push({ "bkAbbrev": "NTPhm", "bkName":"Phm", "numChapters":1 });
	books.push({ "bkAbbrev": "NTHeb", "bkName":"Heb", "numChapters":13 });
	books.push({ "bkAbbrev": "NTJas", "bkName":"Jas", "numChapters":5 });
	books.push({ "bkAbbrev": "NT1Pe", "bkName":"1Pe", "numChapters":5 });
	books.push({ "bkAbbrev": "NT2Pe", "bkName":"2Pe", "numChapters":3 });
	books.push({ "bkAbbrev": "NT1Jo", "bkName":"1Jo", "numChapters":5 });
	books.push({ "bkAbbrev": "NT2Jo", "bkName":"2Jo", "numChapters":1 });
	books.push({ "bkAbbrev": "NT3Jo", "bkName":"3Jo", "numChapters":1 });
	books.push({ "bkAbbrev": "NTJude", "bkName":"Jude", "numChapters":1 });
	books.push({ "bkAbbrev": "NTRe", "bkName":"Re", "numChapters":22 });
	return(books);
}