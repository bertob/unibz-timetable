App = Ember.Application.create();

formattedData = [];
groupedData = [];
var numOfLectures = 50;
var rssfeed = "";
var googleApiUrl = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=' + numOfLectures + '&callback=?&q='

var feedUrl = 'https://aws.unibz.it/students-zone/itt/export/exportitt.aspx?showtype=0&sfdid=VJ6o9VkicIEJBLePjA936w%3d%3d&format=rss';

App.IndexRoute = Ember.Route.extend({
	model: function() {
		rssfeed = getQueryVariable();
		
		return Ember.$.getJSON(document.location.protocol + googleApiUrl + encodeURIComponent(rssfeed)).then(function(data) {
			if (data.responseData.feed && data.responseData.feed.entries) {
				$.each(data.responseData.feed.entries, function (i, e) {
					
					console.log("------------------------");
					console.log("title      : " + e.title);
					console.log("description: " + e.contentSnippet);
					
					var title = e.title;
					var descr = e.contentSnippet;
					// Example Response:
					// contentSnippet: 08.03.2014 - 13:30-14:30 - OFFICE: Typography and Graphics OFFICE - F3.04 Office, Ser-F - Mariacher Christian
					// title: 08.03.2014 - 13:30-14:30 - OFFICE: Typography and Graphics OFFICE

					var descrArray = descr.split(" - ");
					
					var date = descrArray[0];
					date = moment(date, "DD.MM.YYYY").format("dddd, MMMM D");

					var time = descrArray[1];
					var timeArray = time.split("-");
					time = timeArray[0] + " – " + timeArray[1];

					var course = descrArray[2].substr(0, descrArray[2].length);
					course = course.replaceAll(" Ex ", " ");
					course = course.replaceAll(" Pt.2 ", " ");
					course = course.replaceAll(" Pt. 2 ", " ");
					course = course.replaceAll("Software Engineering and Software Project", "SESP");
					
					var room = descrArray[3];
					room = room.replaceAll(".", "");
					room = room.substr(0,4);
					room = room.substr(0,1) + " " + room.substr(1, room.length);
					
					var prof = descrArray[4]; //.substr(1, descrArray[6].length);
					if (prof == "") {
						prof = "Professor";
					}

					console.log();
					console.log("date: " + date + "; \ntime: " + time + "; \ncourse: " + course + "; \nroom: " + room + "; \nprof: " + prof);
					
					if (course.indexOf("OFFICE") === -1) {
						formattedData.push({date: date, title: course, time: time, room: room, prof: prof});
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
	for (var i = 0;  i < a.length; i++) {
		console.log(a[i].title);
		
		if (groupedArray[0] == undefined) {
			groupedArray.push({date: a[i].date, lectures: [{title: a[i].title, time: a[i].time, room: a[i].room, prof: a[i].prof}]});			
		}
		else {
			if (a[i].date === groupedArray[j].date) {
				groupedArray[j].lectures.push({title: a[i].title, time: a[i].time, room: a[i].room, prof: a[i].prof});
			}
			else {
				groupedArray.push({date: a[i].date, lectures: [{title: a[i].title, time: a[i].time, room: a[i].room, prof: a[i].prof}]});
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

String.prototype.replaceAll = function(str1, str2, ignore) {
	return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}
