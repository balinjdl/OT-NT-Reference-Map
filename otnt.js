/* otnt3.js: Setup the OTNT reference graph
/*  Copyright (c) 2011, John D. Lewis
/**********************************************/

// var startDate = new Date();

var books = setupBooks();
var fixr = {};
fixr.x = view.center.x;
fixr.y = view.center.y;
// var fixr = 300; // fix the offset of the points to use the whole screen
var r = 250; // radius
var start, end;
var cRad = 2; // radius of link end point circle

var numBooks = books.length;
var buffer = 1.2; // buffer (in degrees) between each book
var totalChapterCount = 1189; // TODO: Calculate?

var linkColor = new RGBColor(.7,.7,.15);
var degPerChapter = (360 - (buffer * numBooks))/totalChapterCount;
// console.log("degPerChapter = " + degPerChapter);

var lastStart = 0;
var bkNum = 0;
var chpNum = 0;

for (var bkNum = 0; bkNum < books.length; bkNum++) {
	chpNum += books[bkNum].numChapters;
	var bkSize = degPerChapter * books[bkNum].numChapters;

	drawBookArc(r, toRad(lastStart), toRad( lastStart + bkSize ), getColor(books[bkNum]));
	// console.log("Updated books[" + bkNum + "].startA to " + books[bkNum].startA);
	// console.log("Processing book: " + books[bkNum].bkName + "; numChapters: " + bkSize + "; lastStart: " + lastStart);
	lastStart += bkSize + buffer;
}

var bk1 = 14;
var bk2 = 27;

// console.log("random: " + (Math.random()*66));

for (var linkCtr = 1; linkCtr < 100; linkCtr++) {
	bk1 = Math.round(Math.random()*38);
	bk2 = Math.round(39+Math.random()*26);
	// console.log("bk1: " + bk1 + "; bk2: " + bk2);
	
	addLink(books[bk1].startA,books[bk2].startA, books[bk1].startDeg, books[bk2].startDeg);
	addLink(books[bk1].startA,books[bk2].startA, books[bk1].startDeg, books[bk2].startDeg);
	addLink(books[bk1].startA,books[bk2].startA, books[bk1].startDeg, books[bk2].startDeg);
	addLink(books[bk1].startA,books[bk2].startA, books[bk1].startDeg, books[bk2].startDeg);
	addLink(books[bk1].startA,books[bk2].startA, books[bk1].startDeg, books[bk2].startDeg);
}

// var pRect = new Path.Rectangle(new Rectangle(new Point(0,0), new Size(view.center.x*2,view.center.y*2)));
// pRect.strokeColor = "blue";

var pCenter = new Path.Circle(new Point(view.center.x, view.center.y), 1);
pCenter.strokeColor = "lightgray";

var pArcR13 = new Path.Circle(new Point(view.center.x, view.center.y), r/3);
pArcR13.strokeColor = "lightgray";

var pArcR23 = new Path.Circle(new Point(view.center.x, view.center.y), (2*r)/3);
pArcR23.strokeColor = "lightgray";

var pArcR78 = new Path.Circle(new Point(view.center.x, view.center.y), (7*r)/8);
pArcR78.strokeColor = "lightgray";

// console.log("center = " + view.center.x + ", " +  view.center.y);

function toRad(deg) {
	return(deg * (2 * Math.PI/360));
}

function toDeg(rad) {
	return(rad * (360/(2 * Math.PI)));
}

function getColor(book) {
	if(book.bkAbbrev.substring(0,2)=="OT") {
		return("green");
	} else {
		return("blue");
	}
}

function addLink(aPt, bPt, aDeg, bDeg) {
	// Test a line between books
	var start1 = new Point(aPt);
	var startAngle = aDeg;
	// console.log("start1 = " + start1.x + ", " + start1.y + "; angle: " + startAngle);

	var to1 = new Point(bPt);
	var toAngle = bDeg;
	// console.log("to1 = " + to1.x + ", " + to1.y + "; angle: " + toAngle);

	var through1 = getLinkThroughPoint(r, startAngle, toAngle);
	var arc1 = new Path.Arc(start1, through1, to1);
	arc1.strokeColor = linkColor;
	arc1.dashArray = [10, 4];
	arc1.strokeWidth = .1;
	// console.log("through1 = " + through1.x + ", " + through1.y);

	var pStart = new Path.Circle(start1, cRad);
	pStart.fillColor = "yellow";

	var pThrough = new Path.Circle(through1, cRad);
	pThrough.fillColor = "orange";

	var pTo = new Path.Circle(to1, cRad);
	pTo.fillColor = "red";
}

function getLinkThroughPoint(r, a1, a2) {
	var pt = new Point();
	var d1 = toDeg(a1);
	var d2 = toDeg(a2);
	// var midDeg = a1 + Math.abs(a2-a1)/2;
	var delta = (d1)+((d2-d1)/2);
	// console.log("delta = " + delta + " == (" + toDeg(a2) + " - " + toDeg(a1) + ")/2");
	
	if (delta > 90) {
		delta = (d2 + d1);
		// console.log("now delta = " + delta);
	}
	var midDeg = toRad(delta);
	// console.log("midDeg = " + toDeg(midDeg) + "; should be middle of " + toDeg(a1) + " and " + toDeg(a2));
	
	var midRadius = 1*r/3;
	var midX = fixr.x + ( midRadius * (Math.cos(midDeg)));
	var midY = fixr.y + ( midRadius * (Math.sin(midDeg)));
	return(new Point(midX, midY));
}
		
function drawBookArc(r, a1, a2, color) {
	var arcThickness = 20;
	
	var startA, endB;
	var startB, endB;
	var pLine, pColor;

	pColor = color;

	var a1b = (Math.min(a1,a2) + (Math.abs(a1-a2)/2));
	
	var cos1 = Math.cos(a1);
	var cos1b = Math.cos(a1b);
	var cos2 = Math.cos(a2);

	var sin1 = Math.sin(a1);
	var sin1b = Math.sin(a1b);
	var sin2 = Math.sin(a2);
	
	// Set up Arc1
	var ax = fixr.x + ( r * (cos1));
	var ay = fixr.y + ( r * (sin1));
	var bx = fixr.x + ( r * (cos1b));
	var by = fixr.y + ( r * (sin1b));
	var cx = fixr.x + ( r * (cos2));
	var cy = fixr.y + ( r * (sin2));

	var begin = new Point(ax,ay);
	var through = new Point(bx,by);
	var to = new Point(cx,cy);
	var pArc1 = new Path.Arc(begin,through,to);
	startA = begin; endA = to;

	// Set up Arc2
	var ax2 = fixr.x + ( (r+arcThickness) * (Math.cos(a1)));
	var ay2 = fixr.y + ( (r+arcThickness) * (Math.sin(a1)));
	var bx2 = fixr.x + ( (r+arcThickness) * (Math.cos(a1b)));
	var by2 = fixr.y + ( (r+arcThickness) * (Math.sin(a1b)));
	var cx2 = fixr.x + ( (r+arcThickness) * (Math.cos(a2)));
	var cy2 = fixr.y + ( (r+arcThickness) * (Math.sin(a2)));

	var begin2 = new Point(ax2,ay2);
	var through2 = new Point(bx2,by2);
	var to2 = new Point(cx2,cy2);
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

// var finishedDate = new Date();
// console.log("Finished in " + (finishedDate.getTime()-startDate.getTime())/1000 + " seconds");
