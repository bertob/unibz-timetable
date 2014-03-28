unibz-timetable
===============

A simple timetable based on the unibz timetable RSS feed.

It looks like this: [tobiasbernard.com/unibz-timetable](tobiasbernard.com/unibz-timetable)

***This site is still in development and not very well tested, so if you encounter any problems specific to your device/browser, please report them .***

##FAQ

###How can I use this with my personal timetable?

####1. Set up the timetable
Go to your student portal page and set up a personalized timetable by adding your courses to it.

*If you already have a personalized time table you can skip this step.*

####2. Copy the RSS Feed URL
Open your personal timetable inside the student portal. On the top right, next to the timespan selector, there is a link with a caption "RSS". Right click on this link and select **"Copy link location"**.

The URL should look similar to this:
```
http://aws.unibz.it/risweb/timetable.aspx?showtype=0&acy=7&dep=4182&spoid=17529&format=rss
```

####3. Create your personal timetable URL
Now add your personal URL to this base URL: 
```
tobiasbernard.com/unibz-timetable/index.html?rssfeed=
```
The result should look similar to this:
```
tobiasbernard.com/unibz-timetable/index.html?rssfeed=http://aws.unibz.it/risweb/timetable.aspx?showtype=0&acy=7&dep=4182&spoid=17529&format=rss
```

####4. Profit
Now copy this URL into your browser's URL bar and enjoy your cool new timetable.

###How can I use this with a public timetable (e.g. faculty timetables)?
The technique explained above works for all timetable RSS feeds, not just the ones for personal timetables.
For example, you want your course's official timetable, you can just go to the timetable website and copy the RSS link from there, just as you would for a personal time table.

###I don't understand the guides above
If you have any problems setting up your timetable, just [shoot me an email](hi@tobiasbernard.com).

###Why are the room names so big?
Because for how I use it, that's the most important information on the timetable. Also, it looks cool.

###I found a bug/would like to suggest a feature!
Great, thanks.
You can either [file an issue](https://github.com/bertob/unibz-timetable/issues) on Github repo or [email me](hi@tobiasbernard.com).