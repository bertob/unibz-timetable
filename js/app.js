App = Ember.Application.create();

formattedData = [];
groupedData = [];
var numOfLectures = 50;
var rssfeed = "";
var googleApiUrl = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + numOfLectures + '&callback=?&q=';

var feedUrl = 'https://aws.unibz.it/students-zone/itt/export/exportitt.aspx?showtype=0&sfdid=VJ6o9VkicIEJBLePjA936w%3d%3d&format=rss';

// Economy:
// http://aws.unibz.it/risweb/timetable.aspx?showtype=0&acy=7&dgroid=12724%2c16965&dep=1043&spoid=16966&format=rss

// Design:
// http://aws.unibz.it/risweb/timetable.aspx?showtype=0&acy=7&dep=4182&spoid=17529&format=rss

// Engineering:
// http://aws.unibz.it/risweb/timetable.aspx?showtype=0&acy=7&dgroid=16093&dep=9475&spoid=16095&format=rss

/*
var colors = ["2b2b2b",
							"272935",
							"3a4055",
							"5a647e",
							"d4cfc9",
							"e6e1dc",
							"f4f1ed",
							"f9f7f3",
							"da4939",
							"cc7833",
							"ffc66d",
							"a5c261",
							"519f50",
							"6d9cbe",
							"b6b3eb",
							"bc9458",
				 			];
var colors = ["3a4055",
							"5a647e",
							"da4939",					
							"519f50",
							"bc9458",
				 			];
							*/

var colors = ["475368",
							"637a8a",
							"da4939",
							"cca233",
							"94b646",
							"428141",
							"6dafbe",
							"805b26",
							"61386e",
							"8367ac",
							"b02561",
							"ca6595",
							"a87732",
				 			];
var newColors = [0,1,2,3,4,5,6,7,8,9,10,11,12];

var usedColors = [];
var hashColors = {};

App.IndexRoute = Ember.Route.extend({
	model: function () {
		rssfeed = getQueryVariable();

		return Ember.$.getJSON(document.location.protocol + googleApiUrl + encodeURIComponent(rssfeed)).then(function (data) {
			if (data.responseData.feed && data.responseData.feed.entries) {
				$.each(data.responseData.feed.entries, function (i, e) {
					/*
					console.log("------------------------");
					console.log("title      : " + e.title);
					console.log("description: " + e.contentSnippet);
					*/
					var title = e.title;
					var descr = e.contentSnippet;
					// Example Response:
					// contentSnippet: 08.03.2014 - 13:30-14:30 - OFFICE: Typography and Graphics OFFICE - F3.04 Office, Ser-F - Mariacher Christian
					// title: 08.03.2014 - 13:30-14:30 - OFFICE: Typography and Graphics OFFICE

					var descrArray = descr.split(" - ");

					var date = descrArray[0];
					date = moment(date, "DD.MM.YYYY").format("dddd, MMMM D");

					var time = descrArray[1];
					time = time.replaceAll("-", " – ");

					var course = descrArray[2].substr(0, descrArray[2].length);
					course = course.replaceAll("_", " ");
					course = course.replaceAll(" Ex ", " ");
					course = course.replaceAll(" Pt.2 ", " ");
					course = course.replaceAll(" Pt. 2 ", " ");
					course = course.replaceAll("Software Engineering and Software Project", "SESP");

					var room = descrArray[3];
					room = room.replaceAll(".", "");
					room = room.substr(0, 4);
					room = room.substr(0, 1) + " " + room.substr(1, room.length);

					var prof = descrArray[4]; //.substr(1, descrArray[6].length);
					if (prof === "") {
						prof = "Professor";
					}

					var color = addColor(course);
					console.log("YOOO! The color is " + color);

					console.log();
					console.log("date: " + date + "; \ntime: " + time + "; \ncourse: " + course + "; \nroom: " + room + "; \nprof: " + prof + "; \ncolor: " + color);

					if (course.indexOf("OFFICE") === -1) {
						formattedData.push({
							date: date,
							title: course,
							time: time,
							room: room,
							prof: prof,
							color: color
						});
					}
				});
			}
			groupedData = groupByDays(formattedData);
			return groupedData;
		});
	}
});

function groupByDays(a) {
	var groupedArray = [];
	var j = 0;
	for (var i = 0; i < a.length; i++) {
		console.log(a[i].title);

		if (groupedArray[0] === undefined) {
			groupedArray.push({
				date: a[i].date,
				lectures: [{
					title: a[i].title,
					time: a[i].time,
					room: a[i].room,
					prof: a[i].prof,
					color: a[i].color
				}]
			});
		} else {
			if (a[i].date === groupedArray[j].date) {
				groupedArray[j].lectures.push({
					title: a[i].title,
					time: a[i].time,
					room: a[i].room,
					prof: a[i].prof,
					color: a[i].color
				});
			} else {
				groupedArray.push({
					date: a[i].date,
					lectures: [{
						title: a[i].title,
						time: a[i].time,
						room: a[i].room,
						prof: a[i].prof,
						color: a[i].color
					}]
				});
				j++;
			}
		}
	}
	return groupedArray;
}

function getQueryVariable() {
	var query = window.location.search.substring(1);
	var variable = query.split(/=(.+)?/)[1]; //split along fist = and save the part after it
	if (variable == null) variable = feedUrl;
	console.log("request url: " + variable);
	return variable;
}

function replaceStuffInTitles(title) {
	var newtitle = title.replaceAll(" LECT", "");
	var newtitle = newtitle.replaceAll(" EXERCISE", "");
	var newtitle = newtitle.replaceAll(" LAB", "");
	var newtitle = newtitle.replaceAll("  LAB", "");
	var newtitle = newtitle.replaceAll("  ", " ");
	return newtitle;
}

function addColor(newCourseTitle) {
	var returnColor;
	var exitsingColor = false;
	
	formattedData.every(function (oldCourse) {
		oldTitle = replaceStuffInTitles(oldCourse.title);
		newTitle = replaceStuffInTitles(newCourseTitle);
		console.log(newTitle + "###########" + oldTitle)
		var substring = lcs(oldTitle, newTitle);
		console.log(substring.length >= Math.floor(newTitle.length / 3));
		if (substring.length >= Math.floor(newTitle.length / 3)) { // Course already exists and has a color
			var existingHash = oldCourse.title.hashCode();
			console.log("---------------> " + substring);
			retrunColor = hashColors[existingHash];
			exitsingColor = true;
			return false;
		}
	});

	if (!exitsingColor) {
		// Course doesn't exitst yet, assign new color
		var newHash = newCourseTitle.hashCode();
		if (newColors.length > 0) {
			var newColorIndex = Math.floor(Math.random() * newColors.length);
			hashColors[newHash] = newColorIndex;
			newColors.remove(newColorIndex);
			returnColor = hashColors[newHash];
		} else {
			var newColorIndex = Math.floor(Math.random() * colors.length);
			hashColors[newHash] = newColorIndex;
			returnColor = hashColors[newHash];
		}
	}
	return returnColor;

	/*
	formattedData.forEach(function (oldCourse) {
		var substring = lcs(oldCourse.title, newCourseTitle);
		if (substring.length >= Math.floor(newCourseTitle.length / 3)) { // Already exists and has a color
			var existingHash = oldCourse.title.hashCode();
			return hashColors[existingHash];
		} else { // Doesn't exitst yet, assign new color
			var newHash = newCourseTitle.hashCode();
			if (newColors.length > 0) {
				var newColorIndex = Math.floor(Math.random() * newColors.length);
				hashColors[newHash] = newColorIndex;
				newColors.remove(newColorIndex);
				return hashColors[newHash];
			} else {
				var newColorIndex = Math.floor(Math.random() * colors.length);
				hashColors[newHash] = newColorIndex;
				return hashColors[newHash];
			}
		}
	});*/
	/*
	for (var i = 0; i < formattedData.length; i++) {
		var substring = lcs(formattedData[i].title, course);
		console.log(formattedData[i].title + " --> " + course);
		console.log(course + "substring: " + substring);
		if (substring.length >= Math.floor(course.length / 3)) { // Already exists and has a color
			var existingHash = formattedData[i].title.hashCode();
			console.log("LOOOL " + existingHash);
			console.log("OLD HASH: " + existingHash + " # " + hashColors[existingHash] + " title: " + formattedData[i].title + " substr: " + substring);
			console.log(formattedData);
			return hashColors[existingHash];
		} else { // Doesn't exitst yet, assign new color
			for (var j = 0; j < 100; j++) { //just try for a sufficiently large number of times
				var colorNo = Math.floor(Math.random() * colors.length);
				var hash = course.hashCode();
				var used = false;
				usedColors.forEach(function (usedColor) {
					if (colorNo === usedColor) used = true;
				});
				if (used === false) {
					usedColors.push(colorNo);
					hashColors[hash] = colorNo;
					console.log("NEW HASH: " + hash + " # " + colorNo + " title: " + course);
					return colorNo;
				}
			}
			var colorNo = Math.floor(Math.random() * colors.length);
			usedColors.push(colorNo);
			return colorNo;
		}
	}
	*/

}

/*
function addColor(course) {
	for (var i = 0; i < formattedData.length; i++) {
		var substring = lcs(formattedData[i].title, course);
		console.log(formattedData[i].title + " --> " + course);
		console.log(course + "substring: " + substring);
		if (substring.length >= Math.floor(course.length / 3)) { // Already exists and has a color
			var existingHash = formattedData[i].title.hashCode();
			console.log("LOOOL " + existingHash);
			console.log("OLD HASH: " + existingHash + " # " + hashColors[existingHash] + " title: " +  formattedData[i].title + " substr: " + substring);
			console.log(formattedData);
			return hashColors[existingHash];
		} else { // Doesn't exitst yet, assign new color
			for (var j = 0; j < 100; j++) { //just try for a sufficiently large number of times
				var colorNo = Math.floor(Math.random() * colors.length);
				var hash = course.hashCode();
				var used = false;
				usedColors.forEach(function (usedColor) {
					if (colorNo === usedColor) used = true;
				});
				if (used === false) {
					usedColors.push(colorNo);
					hashColors[hash] = colorNo;
					console.log("NEW HASH: " + hash + " # " + colorNo + " title: " + course);
					return colorNo;
				}
			}
			var colorNo = Math.floor(Math.random() * colors.length);
			usedColors.push(colorNo);
			return colorNo;
		}
	}
}
*/


function lcs(lcstest, lcstarget) {
	matchfound = 0
	lsclen = lcstest.length;
	for (lcsi = 0; lcsi < lcstest.length; lcsi++) {
		lscos = 0
		for (lcsj = 0; lcsj < lcsi + 1; lcsj++) {
			re = new RegExp("(?:.{" + lscos + "})(.{" + lsclen + "})", "i");
			temp = re.test(lcstest);
			re = new RegExp("(" + RegExp.$1 + ")", "i");
			if (re.test(lcstarget)) {
				matchfound = 1;
				result = RegExp.$1;
				break;
			}
			lscos = lscos + 1;
		}
		if (matchfound == 1) {
			return result;
			break;
		}
		lsclen = lsclen - 1;
	}
	result = "";
	return result;
}

App.IndexView = Ember.View.extend({
	didInsertElement: function () {
		this._super();
	}
});

Ember.View.reopen({
	didInsertElement: function () {
		this._super();
		Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
	},
	afterRenderEvent: function () {
		// implement this hook in your own subclasses and run your jQuery logic there
		/*
		var divs = $(".lecture"); 
		$.each(divs ,function (i, val) {
			$(val).css("color", "red");
			//alert("Yo " + elem.className);
		});
		*/
		var testColor = "ff0044";
		$('.lecture').each(
			function () {
				var elem = $(this);
				//var idColor = $(this).attr('id');
				var idColor = $(this).attr("id").split("script")[2];
				idColor = idColor.substr(1, idColor.length - 2);
				var colorCode = colors[idColor];
				//alert("class: " + idColor);
				//alert("class: " + $(this).attr("class"));
				//alert("code: " + colorCode);
				$(this).children().css("color", "#" + colorCode);
				$(this).children().children().css("color", "#" + colorCode);
			}
		);

	}
});

String.prototype.replaceAll = function (str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};

String.prototype.hashCode = function () {
	var hash = 0,
		i, char;
	if (this.length == 0) return hash;
	for (i = 0, l = this.length; i < l; i++) {
		char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

Array.prototype.remove = function (from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};