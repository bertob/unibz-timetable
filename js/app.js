App = Ember.Application.create();

formattedData = [];
groupedData = [];

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return Ember.$.getJSON(document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('https://aws.unibz.it/students-zone/itt/export/exportitt.aspx?showtype=0&sfdid=VJ6o9VkicIEJBLePjA936w%3d%3d&format=rss')).then(function(data) {
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
				
				var descrSpaceArray = descr.split(" ");
				var date = descrSpaceArray[0];
				date = moment(date, "DD.MM.YYYY").format("dddd, MMMM D");

				var time = descrSpaceArray[2];
				var timeArray = time.split("-");
				time = timeArray[0] + " – " + timeArray[1];
			
				var descrDashArray = descr.split("-");
				var course = descrDashArray[3].substr(1, descrDashArray[3].length - 2);
				var room = descrDashArray[4] + descrDashArray[5];
				room = room.substr(1,4);
				room = room.substr(0,1) + " " + room.substr(1,room.length);
				var prof = descrDashArray[6].substr(1, descrDashArray[6].length);
			
				console.log();
				console.log("date: " + date + "; \ntime: " + time + "; \ncourse: " + course + "; \nroom: " + room + "; \nprof: " + prof);
			
				formattedData.push({date: date, title: course, time: time, room: room, prof: prof});
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
