/* otnt3.js: Setup the OTNT reference graph
/*  Copyright (c) 2011, John D. Lewis
/**********************************************/

// var startDate = new Date();

var books = setupBooks();
var links = setupLinks();

var booksByName = [];
var fixr = {};
fixr.x = view.center.x;
fixr.y = view.center.y;
// var fixr = 300; // fix the offset of the points to use the whole screen
var r = 500; // radius
var start, end;
var cRad = 2; // radius of link end point circle

var numBooks = books.length;
var buffer = .5; // buffer (in degrees) between each book
var totalChapterCount = 1189; // TODO: Calculate?

var linkColorGeneric = new RGBColor(0,0,1);
var linkColorSyn = new RGBColor(1,0,1);
var linkColorJohn = new RGBColor(0,1,1);
var linkColorActs = new RGBColor(.5,.5,0);
var linkColorHeb = new RGBColor(.5,.5,.5);
var linkColorRev = new RGBColor(1,0,0);

var degPerChapter = (360 - (buffer * numBooks))/totalChapterCount;
// console.log("degPerChapter = " + degPerChapter);

var lastStart = 0;
var bkNum = 0;
var chpNum = 0;

for (var bkNum = 0; bkNum < books.length; bkNum++) {
	chpNum += books[bkNum].numChapters;
	booksByName[books[bkNum].bkAbbrev] = bkNum;
	// console.log("booksByName[" + books[bkNum].bkAbbrev + "] = " + bkNum);
	
	var bkSize = degPerChapter * books[bkNum].numChapters;

	drawBookArc(r, toRad(lastStart), toRad( lastStart + bkSize ), getBookArcColor(books[bkNum]));
	// console.log("Updated books[" + bkNum + "].startA to " + books[bkNum].startA);
	// console.log("Processing book: " + books[bkNum].bkName + "; numChapters: " + bkSize + "; lastStart: " + lastStart);
	lastStart += bkSize + buffer;
}

var bk1, bk2;

for (var linkCtr = 0; linkCtr < links.length; linkCtr++) {
	bk1Num = booksByName[links[linkCtr].bkSource];
	bk1 = books[bk1Num];
	bk1Chp  = links[linkCtr].chpSource;
	
	bk2Num = booksByName[links[linkCtr].bkTarget];
	bk2 = books[bk2Num];
	bk2Chp  = links[linkCtr].chpTarget;

	var degA = bk1.startDeg;
	// console.log("degA = " + toDeg(degA) + "; chpSource: " + bk1Chp);
	var degB = bk2.startDeg;
	// console.log("degB = " + toDeg(degB) + "; chpTarget: " + bk2Chp);
	// console.log("bk1Num = " + links[linkCtr].bkSource + "; bk1 = " + bk1);
	// console.log("bk2Num = " + links[linkCtr].bkTarget + "; bk2 = " + bk2);

	/*
	books.push({ "bkAbbrev": "OTGen", "bkName":"Gen", "numChapters":50 });
	links.push({ "linkID": "OTNT1", "bkSource": "NTMt", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 7 });
	*/

	var newAngleA = degA + toRad(degPerChapter * bk1Chp);
	var newAngleB = degB + toRad(degPerChapter * bk2Chp);
	// console.log("newAngleA = " + toDeg(newAngleA) + "; newAngleB = " + toDeg(newAngleB));
	
	// addLink(bk1.startA,bk2.startA, newAngleA, bk2.startDeg + toRad(degPerChapter * bk2Chp));
	addLink(newAngleA, newAngleB, links[linkCtr].bkSource);
	// console.log("bk1.start: " + bk1.startA + "; bk2.startA: " + bk2.startA + "; bk1.startDeg: " + toDeg(bk1.startDeg) + "; bk2.startDeg: " + toDeg(bk2.startDeg));
}

// addBorder();
// addBands();

function addBorder() {
	var pRect = new Path.Rectangle(new Rectangle(new Point(0,0), new Size(view.center.x*2,view.center.y*2)));
	pRect.strokeColor = "blue";
}

function addBands() {
	var pCenter = new Path.Circle(new Point(view.center.x, view.center.y), 1);
	pCenter.strokeColor = "lightgray";

	var pArcR13 = new Path.Circle(new Point(view.center.x, view.center.y), r/3);
	pArcR13.strokeColor = "lightgray";

	var pArcR23 = new Path.Circle(new Point(view.center.x, view.center.y), (2*r)/3);
	pArcR23.strokeColor = "lightgray";

	var pArcR78 = new Path.Circle(new Point(view.center.x, view.center.y), (7*r)/8);
	pArcR78.strokeColor = "lightgray";
}

function toRad(deg) {
	return(deg * (2 * Math.PI/360));
}

function toDeg(rad) {
	return(rad * (360/(2 * Math.PI)));
}

function getBookArcColor(book) {
	if(book.bkAbbrev.substring(0,2)=="OT") {
		return("green");
	} else {
		return("blue");
	}
}

function getLinkColor(bkTarget) {
	switch (bkTarget) {
		case "NTMt":
		case "NTMr":
		case "NTLu":
			return(linkColorSyn);
			break;
		case "NTJoh":
			return(linkColorJohn);
			break;
		case "NTAc":
			return(linkColorActs);
			break;
		case "NTHeb":
			return(linkColorHeb);
			break;
		case "NTRe":
			return(linkColorRev);
			break;
		default:
			return(linkColorGeneric);
	}
}

function addLink(aDeg, bDeg, bookName) {
	// var start1 = new Point(aPt);
	var startAngle = aDeg;
	// console.log("start1 = " + start1.x + ", " + start1.y + "; angle: " + toDeg(startAngle));

	// var to1 = new Point(bPt);
	var toAngle = bDeg;
	// console.log("to1 = " + to1.x + ", " + to1.y + "; angle: " + toDeg(toAngle));

	var through1 = getLinkThroughPoint(r, startAngle, toAngle);
	// var arc1 = new Path.Arc(start1, through1, to1);
	var arc1 = new Path.Arc(getPointOnArc(r, startAngle), through1, getPointOnArc(r,bDeg));
	arc1.strokeColor = getLinkColor(bookName);
	// arc1.dashArray = [10, 4];
	arc1.strokeWidth = .5;
	// console.log("through1 = " + through1.x + ", " + through1.y);

	// var pStart = new Path.Circle(getPointOnArc(r,aDeg), cRad);
	// pStart.fillColor = "yellow";

	// var pThrough = new Path.Circle(through1, cRad);
	// pThrough.fillColor = "orange";

	// var pTo = new Path.Circle(getPointOnArc(r,bDeg), cRad);
	// pTo.fillColor = "red";
}

function getLinkThroughPoint(r, a1, a2) {
	var pt = new Point();
	var d1 = toDeg(a1);
	var d2 = toDeg(a2);
	var diff = Math.abs(d2-d1)/2;
	// console.log("diff = " + diff);
	
	var delta = (d1)+((d2-d1)/2);
	// console.log("delta = " + delta + " == (" + toDeg(a2) + " - " + toDeg(a1) + ")/2");
	
	var midDeg = toRad(delta);
	if (delta < 180) {
		midDeg = toRad(delta+180);
	}
	// console.log("midDeg = " + toDeg(midDeg) + "; should be middle of " + toDeg(a1) + " and " + toDeg(a2));
	
	var midRadius = 1*r/4;
	if (diff < 10) {
		midRadius = 9*r/10;
	} else if (diff < 30) {
		midRadius = 7*r/8;
	} else if (diff < 60) {
		midRadius = 2*r/3;
	}
	
	return(getPointOnArc(midRadius, midDeg));
}

function getPointOnArc(r, angle1) {
	var ax = fixr.x + ( r * (Math.cos(angle1)));
	var ay = fixr.y + ( r * (Math.sin(angle1)));
	return(new Point(ax, ay));
}

function drawBookArc(r, a1, a2, color) {
	var arcThickness = 20;
	
	var startA, endB;
	var startB, endB;
	var pLine, pColor;

	pColor = color;

	var a1b = (Math.min(a1,a2) + (Math.abs(a1-a2)/2));
	
	var begin = getPointOnArc(r, a1); // new Point(ax,ay);
	var through = getPointOnArc(r, a1b); // new Point(bx,by);
	var to = getPointOnArc(r, a2); // new Point(cx,cy);
	var pArc1 = new Path.Arc(begin,through,to);
	startA = begin; endA = to;

	// Set up Arc2
	var begin2 = getPointOnArc(r+arcThickness, a1); // new Point(ax2,ay2);
	var through2 = getPointOnArc(r+arcThickness, a1b); //new Point(bx2,by2);
	var to2 = getPointOnArc(r+arcThickness, a2); //new Point(cx2,cy2);
	var pArc2 = new Path.Arc(begin2,through2,to2);
	startB = begin2; endB = to2;

	// Set up Line1
	pLine1 = new Path.Line(startA, startB);
	// Set up Line2
	pLine2 = new Path.Line(endA, endB);
	
	pArc1.join(pLine1);
	pArc2.join(pLine2);
	pArc1.join(pArc2);
	pArc1.strokeColor = color;
	pArc1.fillColor = color;
	
	books[bkNum].startA = startA;
	books[bkNum].endA = endA;
	books[bkNum].startB = startB;
	books[bkNum].endB = endB;
	books[bkNum].startDeg = a1;
	books[bkNum].endDeg = a2;
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

function setupLinks() {
	var links = [];
	links.length = 0;
	links.push({ "linkID": "OTNT1", "bkSource": "NTMt", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 7 });
	links.push({ "linkID": "OTNT2", "bkSource": "NTMt", "chpSource": 2, "bkTarget": "OTMic", "chpTarget": 5 });
	links.push({ "linkID": "OTNT3", "bkSource": "NTMt", "chpSource": 2, "bkTarget": "OTHos", "chpTarget": 11 });
	links.push({ "linkID": "OTNT4", "bkSource": "NTMt", "chpSource": 2, "bkTarget": "OTJer", "chpTarget": 31 });
	links.push({ "linkID": "OTNT5", "bkSource": "NTMt", "chpSource": 3, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT6", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 8 });
	links.push({ "linkID": "OTNT7", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 91 });
	links.push({ "linkID": "OTNT8", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT9", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT10", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 10 });
	links.push({ "linkID": "OTNT11", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTIsa", "chpTarget": 9 });
	links.push({ "linkID": "OTNT12", "bkSource": "NTMt", "chpSource": 4, "bkTarget": "OTIsa", "chpTarget": 42 });
	links.push({ "linkID": "OTNT15", "bkSource": "NTMt", "chpSource": 5, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT17", "bkSource": "NTMt", "chpSource": 5, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT23", "bkSource": "NTMt", "chpSource": 5, "bkTarget": "OTDeu", "chpTarget": 19 });
	links.push({ "linkID": "OTNT25", "bkSource": "NTMt", "chpSource": 5, "bkTarget": "OTGen", "chpTarget": 17 });
	links.push({ "linkID": "OTNT26", "bkSource": "NTMt", "chpSource": 7, "bkTarget": "OTPsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT28", "bkSource": "NTMt", "chpSource": 8, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT29", "bkSource": "NTMt", "chpSource": 9, "bkTarget": "OTHos", "chpTarget": 6 });
	links.push({ "linkID": "OTNT33", "bkSource": "NTMt", "chpSource": 11, "bkTarget": "OTMal", "chpTarget": 3 });
	links.push({ "linkID": "OTNT37", "bkSource": "NTMt", "chpSource": 12, "bkTarget": "OTHos", "chpTarget": 6 });
	links.push({ "linkID": "OTNT38", "bkSource": "NTMt", "chpSource": 12, "bkTarget": "OTIsa", "chpTarget": 42 });
	links.push({ "linkID": "OTNT39", "bkSource": "NTMt", "chpSource": 12, "bkTarget": "OTIsa", "chpTarget": 42 });
	links.push({ "linkID": "OTNT42", "bkSource": "NTMt", "chpSource": 13, "bkTarget": "OTIsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT43", "bkSource": "NTMt", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 78 });
	links.push({ "linkID": "OTNT44", "bkSource": "NTMt", "chpSource": 15, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT45", "bkSource": "NTMt", "chpSource": 15, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT46", "bkSource": "NTMt", "chpSource": 15, "bkTarget": "OTExo", "chpTarget": 21 });
	links.push({ "linkID": "OTNT49", "bkSource": "NTMt", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 29 });
	links.push({ "linkID": "OTNT56", "bkSource": "NTMt", "chpSource": 19, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT58", "bkSource": "NTMt", "chpSource": 19, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT59", "bkSource": "NTMt", "chpSource": 19, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT61", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTZec", "chpTarget": 9 });
	links.push({ "linkID": "OTNT62", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT63", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTIsa", "chpTarget": 56 });
	links.push({ "linkID": "OTNT64", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTJer", "chpTarget": 7 });
	links.push({ "linkID": "OTNT65", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTPsa", "chpTarget": 8 });
	links.push({ "linkID": "OTNT67", "bkSource": "NTMt", "chpSource": 21, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT71", "bkSource": "NTMt", "chpSource": 22, "bkTarget": "OTDeu", "chpTarget": 25 });
	links.push({ "linkID": "OTNT72", "bkSource": "NTMt", "chpSource": 22, "bkTarget": "OTExo", "chpTarget": 3 });
	links.push({ "linkID": "OTNT73", "bkSource": "NTMt", "chpSource": 22, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT74", "bkSource": "NTMt", "chpSource": 22, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT75", "bkSource": "NTMt", "chpSource": 22, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT86", "bkSource": "NTMt", "chpSource": 24, "bkTarget": "OTJer", "chpTarget": 30 });
	links.push({ "linkID": "OTNT93", "bkSource": "NTMt", "chpSource": 25, "bkTarget": "OTPsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT95", "bkSource": "NTMt", "chpSource": 26, "bkTarget": "OTZec", "chpTarget": 13 });
	links.push({ "linkID": "OTNT98", "bkSource": "NTMt", "chpSource": 27, "bkTarget": "OTZec", "chpTarget": 11 });
	links.push({ "linkID": "OTNT99", "bkSource": "NTMt", "chpSource": 27, "bkTarget": "OTPsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT101", "bkSource": "NTMt", "chpSource": 27, "bkTarget": "OTPsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT103", "bkSource": "NTMr", "chpSource": 1, "bkTarget": "OTMal", "chpTarget": 3 });
	links.push({ "linkID": "OTNT104", "bkSource": "NTMr", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT107", "bkSource": "NTMr", "chpSource": 4, "bkTarget": "OTIsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT108", "bkSource": "NTMr", "chpSource": 7, "bkTarget": "OTIsa", "chpTarget": 29 });
	links.push({ "linkID": "OTNT109", "bkSource": "NTMr", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT110", "bkSource": "NTMr", "chpSource": 7, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT111", "bkSource": "NTMr", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 21 });
	links.push({ "linkID": "OTNT112", "bkSource": "NTMr", "chpSource": 7, "bkTarget": "OTPro", "chpTarget": 20 });
	links.push({ "linkID": "OTNT116", "bkSource": "NTMr", "chpSource": 10, "bkTarget": "OTGen", "chpTarget": 1 });
	links.push({ "linkID": "OTNT117", "bkSource": "NTMr", "chpSource": 10, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT118", "bkSource": "NTMr", "chpSource": 10, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT119", "bkSource": "NTMr", "chpSource": 11, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT120", "bkSource": "NTMr", "chpSource": 11, "bkTarget": "OTIsa", "chpTarget": 56 });
	links.push({ "linkID": "OTNT121", "bkSource": "NTMr", "chpSource": 11, "bkTarget": "OTJer", "chpTarget": 7 });
	links.push({ "linkID": "OTNT123", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT124", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTDeu", "chpTarget": 25 });
	links.push({ "linkID": "OTNT125", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTExo", "chpTarget": 3 });
	links.push({ "linkID": "OTNT126", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT127", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT129", "bkSource": "NTMr", "chpSource": 12, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT139", "bkSource": "NTMr", "chpSource": 14, "bkTarget": "OTZec", "chpTarget": 13 });
	links.push({ "linkID": "OTNT140", "bkSource": "NTMr", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT141", "bkSource": "NTMr", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT143", "bkSource": "NTLu", "chpSource": 1, "bkTarget": "OTMal", "chpTarget": 4 });
	links.push({ "linkID": "OTNT155", "bkSource": "NTLu", "chpSource": 2, "bkTarget": "OTExo", "chpTarget": 13 });
	links.push({ "linkID": "OTNT156", "bkSource": "NTLu", "chpSource": 2, "bkTarget": "OTLev", "chpTarget": 12 });
	links.push({ "linkID": "OTNT158", "bkSource": "NTLu", "chpSource": 3, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT159", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 8 });
	links.push({ "linkID": "OTNT160", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT161", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 10 });
	links.push({ "linkID": "OTNT162", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 91 });
	links.push({ "linkID": "OTNT163", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT164", "bkSource": "NTLu", "chpSource": 4, "bkTarget": "OTIsa", "chpTarget": 61 });
	links.push({ "linkID": "OTNT171", "bkSource": "NTLu", "chpSource": 7, "bkTarget": "OTMal", "chpTarget": 3 });
	links.push({ "linkID": "OTNT172", "bkSource": "NTLu", "chpSource": 8, "bkTarget": "OTIsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT174", "bkSource": "NTLu", "chpSource": 10, "bkTarget": "OTDeu", "chpTarget": 6 });
	links.push({ "linkID": "OTNT175", "bkSource": "NTLu", "chpSource": 10, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT183", "bkSource": "NTLu", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT193", "bkSource": "NTLu", "chpSource": 18, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT194", "bkSource": "NTLu", "chpSource": 18, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT195", "bkSource": "NTLu", "chpSource": 19, "bkTarget": "OTIsa", "chpTarget": 56 });
	links.push({ "linkID": "OTNT196", "bkSource": "NTLu", "chpSource": 19, "bkTarget": "OTJer", "chpTarget": 7 });
	links.push({ "linkID": "OTNT198", "bkSource": "NTLu", "chpSource": 20, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT202", "bkSource": "NTLu", "chpSource": 20, "bkTarget": "OTDeu", "chpTarget": 25 });
	links.push({ "linkID": "OTNT204", "bkSource": "NTLu", "chpSource": 20, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT205", "bkSource": "NTLu", "chpSource": 22, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT208", "bkSource": "NTLu", "chpSource": 23, "bkTarget": "OTPsa", "chpTarget": 31 });
	links.push({ "linkID": "OTNT210", "bkSource": "NTJoh", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT212", "bkSource": "NTJoh", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 69 });
	links.push({ "linkID": "OTNT215", "bkSource": "NTJoh", "chpSource": 6, "bkTarget": "OTPsa", "chpTarget": 78 });
	links.push({ "linkID": "OTNT217", "bkSource": "NTJoh", "chpSource": 6, "bkTarget": "OTIsa", "chpTarget": 54 });
	links.push({ "linkID": "OTNT233", "bkSource": "NTJoh", "chpSource": 8, "bkTarget": "OTDeu", "chpTarget": 19 });
	links.push({ "linkID": "OTNT234", "bkSource": "NTJoh", "chpSource": 9, "bkTarget": "OTPsa", "chpTarget": 82 });
	links.push({ "linkID": "OTNT237", "bkSource": "NTJoh", "chpSource": 12, "bkTarget": "OTZec", "chpTarget": 9 });
	links.push({ "linkID": "OTNT242", "bkSource": "NTJoh", "chpSource": 12, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT243", "bkSource": "NTJoh", "chpSource": 12, "bkTarget": "OTIsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT245", "bkSource": "NTJoh", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 41 });
	links.push({ "linkID": "OTNT246", "bkSource": "NTJoh", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 69 });
	links.push({ "linkID": "OTNT247", "bkSource": "NTJoh", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 109 });
	links.push({ "linkID": "OTNT248", "bkSource": "NTJoh", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 35 });
	links.push({ "linkID": "OTNT251", "bkSource": "NTJoh", "chpSource": 19, "bkTarget": "OTPsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT253", "bkSource": "NTJoh", "chpSource": 19, "bkTarget": "OTExo", "chpTarget": 12 });
	links.push({ "linkID": "OTNT254", "bkSource": "NTJoh", "chpSource": 19, "bkTarget": "OTPsa", "chpTarget": 34 });
	links.push({ "linkID": "OTNT256", "bkSource": "NTJoh", "chpSource": 19, "bkTarget": "OTZec", "chpTarget": 12 });
	links.push({ "linkID": "OTNT259", "bkSource": "NTAc", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 69 });
	links.push({ "linkID": "OTNT260", "bkSource": "NTAc", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 109 });
	links.push({ "linkID": "OTNT261", "bkSource": "NTAc", "chpSource": 2, "bkTarget": "OTJoe", "chpTarget": 2 });
	links.push({ "linkID": "OTNT262", "bkSource": "NTAc", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 16 });
	links.push({ "linkID": "OTNT265", "bkSource": "NTAc", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 16 });
	links.push({ "linkID": "OTNT266", "bkSource": "NTAc", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT267", "bkSource": "NTAc", "chpSource": 3, "bkTarget": "OTDeu", "chpTarget": 18 });
	links.push({ "linkID": "OTNT268", "bkSource": "NTAc", "chpSource": 3, "bkTarget": "OTGen", "chpTarget": 22 });
	links.push({ "linkID": "OTNT270", "bkSource": "NTAc", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT272", "bkSource": "NTAc", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 2 });
	links.push({ "linkID": "OTNT275", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTGen", "chpTarget": 12 });
	links.push({ "linkID": "OTNT280", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTGen", "chpTarget": 15 });
	links.push({ "linkID": "OTNT299", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 2 });
	links.push({ "linkID": "OTNT302", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 3 });
	links.push({ "linkID": "OTNT303", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 3 });
	links.push({ "linkID": "OTNT304", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 2 });
	links.push({ "linkID": "OTNT311", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTDeu", "chpTarget": 18 });
	links.push({ "linkID": "OTNT314", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 32 });
	links.push({ "linkID": "OTNT324", "bkSource": "NTAc", "chpSource": 7, "bkTarget": "OTIsa", "chpTarget": 66 });
	links.push({ "linkID": "OTNT325", "bkSource": "NTAc", "chpSource": 8, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT339", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OT1Sa", "chpTarget": 13 });
	links.push({ "linkID": "OTNT340", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 89 });
	links.push({ "linkID": "OTNT342", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 2 });
	links.push({ "linkID": "OTNT343", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 55 });
	links.push({ "linkID": "OTNT344", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 16 });
	links.push({ "linkID": "OTNT346", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTHab", "chpTarget": 1 });
	links.push({ "linkID": "OTNT347", "bkSource": "NTAc", "chpSource": 13, "bkTarget": "OTIsa", "chpTarget": 49 });
	links.push({ "linkID": "OTNT353", "bkSource": "NTAc", "chpSource": 23, "bkTarget": "OTExo", "chpTarget": 22 });
	links.push({ "linkID": "OTNT354", "bkSource": "NTAc", "chpSource": 28, "bkTarget": "OTIsa", "chpTarget": 6 });
	links.push({ "linkID": "OTNT355", "bkSource": "NTRo", "chpSource": 1, "bkTarget": "OTHab", "chpTarget": 2 });
	links.push({ "linkID": "OTNT361", "bkSource": "NTRo", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 52 });
	links.push({ "linkID": "OTNT362", "bkSource": "NTRo", "chpSource": 2, "bkTarget": "OTEze", "chpTarget": 36 });
	links.push({ "linkID": "OTNT363", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 116 });
	links.push({ "linkID": "OTNT364", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 51 });
	links.push({ "linkID": "OTNT366", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 14 });
	links.push({ "linkID": "OTNT367", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 5 });
	links.push({ "linkID": "OTNT368", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 140 });
	links.push({ "linkID": "OTNT369", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 10 });
	links.push({ "linkID": "OTNT370", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTIsa", "chpTarget": 59 });
	links.push({ "linkID": "OTNT371", "bkSource": "NTRo", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 36 });
	links.push({ "linkID": "OTNT372", "bkSource": "NTRo", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 15 });
	links.push({ "linkID": "OTNT373", "bkSource": "NTRo", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 32 });
	links.push({ "linkID": "OTNT374", "bkSource": "NTRo", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 17 });
	links.push({ "linkID": "OTNT375", "bkSource": "NTRo", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 17 });
	links.push({ "linkID": "OTNT376", "bkSource": "NTRo", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 15 });
	links.push({ "linkID": "OTNT377", "bkSource": "NTRo", "chpSource": 7, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT378", "bkSource": "NTRo", "chpSource": 7, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT379", "bkSource": "NTRo", "chpSource": 8, "bkTarget": "OTPsa", "chpTarget": 44 });
	links.push({ "linkID": "OTNT380", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTGen", "chpTarget": 21 });
	links.push({ "linkID": "OTNT381", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTGen", "chpTarget": 18 });
	links.push({ "linkID": "OTNT382", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTGen", "chpTarget": 25 });
	links.push({ "linkID": "OTNT383", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTMal", "chpTarget": 1 });
	links.push({ "linkID": "OTNT384", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTExo", "chpTarget": 33 });
	links.push({ "linkID": "OTNT385", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTExo", "chpTarget": 9 });
	links.push({ "linkID": "OTNT388", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTHos", "chpTarget": 2 });
	links.push({ "linkID": "OTNT389", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTHos", "chpTarget": 1 });
	links.push({ "linkID": "OTNT390", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTIsa", "chpTarget": 10 });
	links.push({ "linkID": "OTNT391", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTIsa", "chpTarget": 1 });
	links.push({ "linkID": "OTNT392", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTIsa", "chpTarget": 8 });
	links.push({ "linkID": "OTNT393", "bkSource": "NTRo", "chpSource": 9, "bkTarget": "OTIsa", "chpTarget": 28 });
	links.push({ "linkID": "OTNT394", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTLev", "chpTarget": 18 });
	links.push({ "linkID": "OTNT395", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTEze", "chpTarget": 20 });
	links.push({ "linkID": "OTNT397", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTDeu", "chpTarget": 30 });
	links.push({ "linkID": "OTNT398", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTIsa", "chpTarget": 28 });
	links.push({ "linkID": "OTNT399", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTJoe", "chpTarget": 2 });
	links.push({ "linkID": "OTNT400", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTIsa", "chpTarget": 52 });
	links.push({ "linkID": "OTNT401", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTNah", "chpTarget": 1 });
	links.push({ "linkID": "OTNT402", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT403", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTPsa", "chpTarget": 19 });
	links.push({ "linkID": "OTNT404", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTDeu", "chpTarget": 32 });
	links.push({ "linkID": "OTNT405", "bkSource": "NTRo", "chpSource": 10, "bkTarget": "OTIsa", "chpTarget": 65 });
	links.push({ "linkID": "OTNT407", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OT1Ki", "chpTarget": 19 });
	links.push({ "linkID": "OTNT408", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OT1Ki", "chpTarget": 19 });
	links.push({ "linkID": "OTNT409", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OTIsa", "chpTarget": 29 });
	links.push({ "linkID": "OTNT411", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OTPsa", "chpTarget": 69 });
	links.push({ "linkID": "OTNT412", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OTIsa", "chpTarget": 59 });
	links.push({ "linkID": "OTNT413", "bkSource": "NTRo", "chpSource": 11, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT417", "bkSource": "NTRo", "chpSource": 12, "bkTarget": "OTPro", "chpTarget": 3 });
	links.push({ "linkID": "OTNT418", "bkSource": "NTRo", "chpSource": 12, "bkTarget": "OTDeu", "chpTarget": 32 });
	links.push({ "linkID": "OTNT419", "bkSource": "NTRo", "chpSource": 12, "bkTarget": "OTPro", "chpTarget": 25 });
	links.push({ "linkID": "OTNT420", "bkSource": "NTRo", "chpSource": 13, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT421", "bkSource": "NTRo", "chpSource": 13, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT422", "bkSource": "NTRo", "chpSource": 13, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT423", "bkSource": "NTRo", "chpSource": 14, "bkTarget": "OTIsa", "chpTarget": 45 });
	links.push({ "linkID": "OTNT424", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 69 });
	links.push({ "linkID": "OTNT425", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 18 });
	links.push({ "linkID": "OTNT426", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTDeu", "chpTarget": 32 });
	links.push({ "linkID": "OTNT427", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 117 });
	links.push({ "linkID": "OTNT428", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 11 });
	links.push({ "linkID": "OTNT429", "bkSource": "NTRo", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 52 });
	links.push({ "linkID": "OTNT430", "bkSource": "NT1Co", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 29 });
	links.push({ "linkID": "OTNT433", "bkSource": "NT1Co", "chpSource": 1, "bkTarget": "OTJer", "chpTarget": 9 });
	links.push({ "linkID": "OTNT434", "bkSource": "NT1Co", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 64 });
	links.push({ "linkID": "OTNT435", "bkSource": "NT1Co", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT437", "bkSource": "NT1Co", "chpSource": 3, "bkTarget": "OTJob", "chpTarget": 5 });
	links.push({ "linkID": "OTNT438", "bkSource": "NT1Co", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 94 });
	links.push({ "linkID": "OTNT442", "bkSource": "NT1Co", "chpSource": 6, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT443", "bkSource": "NT1Co", "chpSource": 9, "bkTarget": "OTDeu", "chpTarget": 25 });
	links.push({ "linkID": "OTNT452", "bkSource": "NT1Co", "chpSource": 10, "bkTarget": "OTExo", "chpTarget": 32 });
	links.push({ "linkID": "OTNT457", "bkSource": "NT1Co", "chpSource": 10, "bkTarget": "OTDeu", "chpTarget": 32 });
	links.push({ "linkID": "OTNT458", "bkSource": "NT1Co", "chpSource": 10, "bkTarget": "OTPsa", "chpTarget": 24 });
	links.push({ "linkID": "OTNT459", "bkSource": "NT1Co", "chpSource": 14, "bkTarget": "OTIsa", "chpTarget": 28 });
	links.push({ "linkID": "OTNT465", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT466", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 8 });
	links.push({ "linkID": "OTNT467", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT468", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT469", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTIsa", "chpTarget": 25 });
	links.push({ "linkID": "OTNT470", "bkSource": "NT1Co", "chpSource": 15, "bkTarget": "OTHos", "chpTarget": 13 });
	links.push({ "linkID": "OTNT472", "bkSource": "NT2Co", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 116 });
	links.push({ "linkID": "OTNT473", "bkSource": "NT2Co", "chpSource": 5, "bkTarget": "OTIsa", "chpTarget": 43 });
	links.push({ "linkID": "OTNT474", "bkSource": "NT2Co", "chpSource": 6, "bkTarget": "OTIsa", "chpTarget": 49 });
	links.push({ "linkID": "OTNT475", "bkSource": "NT2Co", "chpSource": 6, "bkTarget": "OTLev", "chpTarget": 26 });
	links.push({ "linkID": "OTNT476", "bkSource": "NT2Co", "chpSource": 6, "bkTarget": "OTIsa", "chpTarget": 52 });
	links.push({ "linkID": "OTNT477", "bkSource": "NT2Co", "chpSource": 6, "bkTarget": "OTJer", "chpTarget": 31 });
	links.push({ "linkID": "OTNT478", "bkSource": "NT2Co", "chpSource": 6, "bkTarget": "OT2Sa", "chpTarget": 7 });
	links.push({ "linkID": "OTNT479", "bkSource": "NT2Co", "chpSource": 8, "bkTarget": "OTExo", "chpTarget": 16 });
	links.push({ "linkID": "OTNT481", "bkSource": "NT2Co", "chpSource": 9, "bkTarget": "OTPsa", "chpTarget": 112 });
	links.push({ "linkID": "OTNT482", "bkSource": "NT2Co", "chpSource": 10, "bkTarget": "OTJer", "chpTarget": 9 });
	links.push({ "linkID": "OTNT483", "bkSource": "NT2Co", "chpSource": 13, "bkTarget": "OTDeu", "chpTarget": 19 });
	links.push({ "linkID": "OTNT484", "bkSource": "NTGa", "chpSource": 2, "bkTarget": "OTDeu", "chpTarget": 10 });
	links.push({ "linkID": "OTNT487", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTGen", "chpTarget": 12 });
	links.push({ "linkID": "OTNT489", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTDeu", "chpTarget": 27 });
	links.push({ "linkID": "OTNT490", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTHab", "chpTarget": 2 });
	links.push({ "linkID": "OTNT491", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTLev", "chpTarget": 18 });
	links.push({ "linkID": "OTNT492", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTDeu", "chpTarget": 21 });
	links.push({ "linkID": "OTNT493", "bkSource": "NTGa", "chpSource": 3, "bkTarget": "OTGen", "chpTarget": 22 });
	links.push({ "linkID": "OTNT497", "bkSource": "NTGa", "chpSource": 4, "bkTarget": "OTIsa", "chpTarget": 54 });
	links.push({ "linkID": "OTNT498", "bkSource": "NTGa", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 21 });
	links.push({ "linkID": "OTNT499", "bkSource": "NTGa", "chpSource": 5, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT501", "bkSource": "NTEph", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 68 });
	links.push({ "linkID": "OTNT502", "bkSource": "NTEph", "chpSource": 4, "bkTarget": "OTZec", "chpTarget": 8 });
	links.push({ "linkID": "OTNT503", "bkSource": "NTEph", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 4 });
	links.push({ "linkID": "OTNT504", "bkSource": "NTEph", "chpSource": 5, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT505", "bkSource": "NTEph", "chpSource": 6, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT506", "bkSource": "NTEph", "chpSource": 6, "bkTarget": "OTDeu", "chpTarget": 5 });
	links.push({ "linkID": "OTNT524", "bkSource": "NT1Ti", "chpSource": 5, "bkTarget": "OTDeu", "chpTarget": 25 });
	links.push({ "linkID": "OTNT530", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 2 });
	links.push({ "linkID": "OTNT531", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OT2Sa", "chpTarget": 7 });
	links.push({ "linkID": "OTNT532", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 97 });
	links.push({ "linkID": "OTNT533", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 104 });
	links.push({ "linkID": "OTNT534", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 45 });
	links.push({ "linkID": "OTNT535", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 102 });
	links.push({ "linkID": "OTNT536", "bkSource": "NTHeb", "chpSource": 1, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT537", "bkSource": "NTHeb", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 8 });
	links.push({ "linkID": "OTNT538", "bkSource": "NTHeb", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT539", "bkSource": "NTHeb", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 8 });
	links.push({ "linkID": "OTNT540", "bkSource": "NTHeb", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 18 });
	links.push({ "linkID": "OTNT541", "bkSource": "NTHeb", "chpSource": 2, "bkTarget": "OT2Sa", "chpTarget": 22 });
	links.push({ "linkID": "OTNT543", "bkSource": "NTHeb", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 95 });
	links.push({ "linkID": "OTNT544", "bkSource": "NTHeb", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 95 });
	links.push({ "linkID": "OTNT546", "bkSource": "NTHeb", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 95 });
	links.push({ "linkID": "OTNT547", "bkSource": "NTHeb", "chpSource": 4, "bkTarget": "OTGen", "chpTarget": 2 });
	links.push({ "linkID": "OTNT548", "bkSource": "NTHeb", "chpSource": 4, "bkTarget": "OTPsa", "chpTarget": 95 });
	links.push({ "linkID": "OTNT550", "bkSource": "NTHeb", "chpSource": 5, "bkTarget": "OTPsa", "chpTarget": 2 });
	links.push({ "linkID": "OTNT551", "bkSource": "NTHeb", "chpSource": 5, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT552", "bkSource": "NTHeb", "chpSource": 6, "bkTarget": "OTGen", "chpTarget": 22 });
	links.push({ "linkID": "OTNT554", "bkSource": "NTHeb", "chpSource": 7, "bkTarget": "OTPsa", "chpTarget": 110 });
	links.push({ "linkID": "OTNT555", "bkSource": "NTHeb", "chpSource": 8, "bkTarget": "OTExo", "chpTarget": 25 });
	links.push({ "linkID": "OTNT556", "bkSource": "NTHeb", "chpSource": 8, "bkTarget": "OTJer", "chpTarget": 31 });
	links.push({ "linkID": "OTNT564", "bkSource": "NTHeb", "chpSource": 9, "bkTarget": "OTExo", "chpTarget": 24 });
	links.push({ "linkID": "OTNT565", "bkSource": "NTHeb", "chpSource": 10, "bkTarget": "OTPsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT568", "bkSource": "NTHeb", "chpSource": 10, "bkTarget": "OTJer", "chpTarget": 31 });
	links.push({ "linkID": "OTNT571", "bkSource": "NTHeb", "chpSource": 10, "bkTarget": "OTDeu", "chpTarget": 32 });
	links.push({ "linkID": "OTNT572", "bkSource": "NTHeb", "chpSource": 10, "bkTarget": "OTHab", "chpTarget": 2 });
	links.push({ "linkID": "OTNT589", "bkSource": "NTHeb", "chpSource": 11, "bkTarget": "OTGen", "chpTarget": 47 });
	links.push({ "linkID": "OTNT610", "bkSource": "NTHeb", "chpSource": 12, "bkTarget": "OTPro", "chpTarget": 3 });
	links.push({ "linkID": "OTNT617", "bkSource": "NTHeb", "chpSource": 12, "bkTarget": "OTExo", "chpTarget": 19 });
	links.push({ "linkID": "OTNT618", "bkSource": "NTHeb", "chpSource": 12, "bkTarget": "OTDeu", "chpTarget": 9 });
	links.push({ "linkID": "OTNT619", "bkSource": "NTHeb", "chpSource": 12, "bkTarget": "OTHag", "chpTarget": 2 });
	links.push({ "linkID": "OTNT620", "bkSource": "NTHeb", "chpSource": 12, "bkTarget": "OTDeu", "chpTarget": 4 });
	links.push({ "linkID": "OTNT622", "bkSource": "NTHeb", "chpSource": 13, "bkTarget": "OTDeu", "chpTarget": 31 });
	links.push({ "linkID": "OTNT623", "bkSource": "NTHeb", "chpSource": 13, "bkTarget": "OTJos", "chpTarget": 1 });
	links.push({ "linkID": "OTNT624", "bkSource": "NTHeb", "chpSource": 13, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT634", "bkSource": "NTJas", "chpSource": 2, "bkTarget": "OTLev", "chpTarget": 19 });
	links.push({ "linkID": "OTNT635", "bkSource": "NTJas", "chpSource": 2, "bkTarget": "OTExo", "chpTarget": 20 });
	links.push({ "linkID": "OTNT637", "bkSource": "NTJas", "chpSource": 2, "bkTarget": "OTGen", "chpTarget": 15 });
	links.push({ "linkID": "OTNT640", "bkSource": "NTJas", "chpSource": 4, "bkTarget": "OTPro", "chpTarget": 3 });
	links.push({ "linkID": "OTNT646", "bkSource": "NT1Pe", "chpSource": 1, "bkTarget": "OTLev", "chpTarget": 11 });
	links.push({ "linkID": "OTNT647", "bkSource": "NT1Pe", "chpSource": 1, "bkTarget": "OTIsa", "chpTarget": 40 });
	links.push({ "linkID": "OTNT650", "bkSource": "NT1Pe", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 28 });
	links.push({ "linkID": "OTNT651", "bkSource": "NT1Pe", "chpSource": 2, "bkTarget": "OTPsa", "chpTarget": 118 });
	links.push({ "linkID": "OTNT652", "bkSource": "NT1Pe", "chpSource": 2, "bkTarget": "OTExo", "chpTarget": 19 });
	links.push({ "linkID": "OTNT657", "bkSource": "NT1Pe", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT658", "bkSource": "NT1Pe", "chpSource": 2, "bkTarget": "OTIsa", "chpTarget": 53 });
	links.push({ "linkID": "OTNT661", "bkSource": "NT1Pe", "chpSource": 3, "bkTarget": "OTPsa", "chpTarget": 34 });
	links.push({ "linkID": "OTNT664", "bkSource": "NT1Pe", "chpSource": 4, "bkTarget": "OTPro", "chpTarget": 10 });
	links.push({ "linkID": "OTNT672", "bkSource": "NT2Pe", "chpSource": 2, "bkTarget": "OTPro", "chpTarget": 26 });
	links.push({ "linkID": "OTNT757", "bkSource": "NTRe", "chpSource": 7, "bkTarget": "OTIsa", "chpTarget": 49 });
	links.push({ "linkID": "OTNT758", "bkSource": "NTRe", "chpSource": 7, "bkTarget": "OTIsa", "chpTarget": 25 });
	links.push({ "linkID": "OTNT837", "bkSource": "NTRe", "chpSource": 15, "bkTarget": "OTJer", "chpTarget": 10 });
	links.push({ "linkID": "OTNT838", "bkSource": "NTRe", "chpSource": 15, "bkTarget": "OTPsa", "chpTarget": 86 });
	links.push({ "linkID": "OTNT864", "bkSource": "NTRe", "chpSource": 18, "bkTarget": "OTIsa", "chpTarget": 21 });
	links.push({ "linkID": "OTNT867", "bkSource": "NTRe", "chpSource": 18, "bkTarget": "OTJer", "chpTarget": 51 });
	return(links);
}

// var finishedDate = new Date();
// console.log("Finished in " + (finishedDate.getTime()-startDate.getTime())/1000 + " seconds");
