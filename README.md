# COMP3100-WebProgramming

Coursework completed during Winter 2020. Course taught by Dr. Rod Byrne. His code was used as reference for completing these projects. I have received Dr. Byrne's permission to host this code in a public repository. More about Dr. Byrne can be found at https://www.mun.ca/computerscience/people/rod.php

# Weather
Can be run by the command node weather_app.js

Weather is my first attempt at a web application utilizing node and express, with sqlite3 as a database. There are two main pages. 

The editing page is used for adding new weather reports to the database and editing previous weather reports.
![](https://i.imgur.com/POkxtqB.png)

The reports page displays different information about the stored weather reports. 
![](https://i.imgur.com/zaFvIaB.png)

# project_partA
Can be run by the command node app.js

This project provides the user authentication for a future project. This project uses express and node, with cookie-session to track sessions, and express-hbs for handlebar templating. 

Middleware is used to ensure users are not accessing the system while logged out, or that a regular user can access admin pages. 
