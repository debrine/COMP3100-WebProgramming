# COMP3100-WebProgramming

Coursework completed during Winter 2020. Course taught by Dr. Rod Byrne. His code was used as reference for completing these projects. I have received Dr. Byrne's permission to host this code in a public repository. More about Dr. Byrne can be found at https://www.mun.ca/computerscience/people/rod.php

## Weather ##
Can be run by the command node weather_app.js

Weather is my first attempt at a web application utilizing node and express, with sqlite3 as a database. There are two main pages. 

The editing page is used for adding new weather reports to the database and editing previous weather reports.
![](https://i.imgur.com/POkxtqB.png)

The reports page displays different information about the stored weather reports. 
![](https://i.imgur.com/zaFvIaB.png)

## project_partA ##
Can be run by the command node app.js

This project provides the user authentication for a future project. This project uses express and node, with cookie-session to track sessions, and express-hbs for handlebar templating. 

Middleware is used to ensure users are not accessing the system while logged out, or that a regular user can access admin pages. 

## Checkers ##
checkers.html and checkers.js uses HTML, CSS, SVG, and JavaScript to take a string that represents a checkers board state and generates a graphic of that board state. 

Input:
```
-W-W-W-W-W
W-W-W-W-W-
-W-W-W-W-W
W-W-W-W---
---------W
--B-------
-B---B-B-B
B-B-B-B-B-
-B-B-B-B-B
B-B-B-B-B-
```

Generated Graphic:
![](https://i.imgur.com/jGxkD6i.png)

play_checkers.html and playCheckers.js turns the code above into a custom web component for easier use in an HTML document. It also adds the feature of dragging and dropping checker pieces on the board. (Note that there is no checking whether the move is valid or the space is currently occupied.)

## Stars ##
Created a custom web component that creates an isotoxal star with a specified number of points. This is done using HTML, CSS, SVG and javascript. 

## Charting ##
Uses HTML, CSS, Javascript as well as the chart.js module. Uses custom web components to accept a list of x and y coordinates then graphs them as a scatter plot. 

## Sequences ##
Node web app using Express, JS, HTML, CSS, XMLHttpRequest with JSON message passing between client and server. Uses iterators and generators to generate values, then sends them to the client where they are transformed into HTML elements to be displayed.

## Weather-JSON ##
Node web app using Express, JS, HTML, CSS, with JSON message passing between client and server. Uses XMLHttpRequest to fetch data from the server and retrieve it as a JSON file, the web page then updates on the client side to show the new data sent by the server.


## finalProject ##
This project builds on project_partA. It is a node web app which utilizes Express, JS, HTML, CSS, XMLHttpRequest with JSON message passing, cookie sessions, and templating using hbs. The finalProject is an online spreadsheet sharing site which is spread into several pages.

The initial page is a login page which also provides a link to click if you need to register:
![](https://i.imgur.com/gvWUYee.png)

Once logged in, the user sees a home page which provides a navigation bar and the ability for the user to edit their account information:
![](https://i.imgur.com/eAA0X3H.png)

The admin tools tab is available only to administrator accounts, and allows the user to edit or delete any registered user:
![](https://i.imgur.com/yjPmOaN.png)

The user spreadsheets tab has two seperate areas. The first allows you to rename, change the privacy, delete, or edit any of your sheets:
![](https://i.imgur.com/KLAgBUd.png)

The second area shows the currently selected sheet for editing. It allows you to add or delete rows or columns, change values, or import or export a sheet as a .csv value:
![](https://i.imgur.com/08nzhKk.png)

The shared spreadsheets tab allows the user to see a list of every public spreadsheet from every user. If the user is an administrator, they will instead see both private and public spreadsheets. This page provides the option to copy a spreadsheet into the user's sheets so that they can view and edit it:
![](https://i.imgur.com/hZHEQf0.png)

The charting tab is split into three sections. This tab is used to chart the data from the user's spreadsheets. 

The first section allows you to select which spreadsheet you would like to graph:
![](https://i.imgur.com/J6RFkUa.png)

The second section allows you to specify the type of graph as well as which rows and columns to graph:
![](https://i.imgur.com/qmXX2s3.png)

The third section is where you view your generated graph:
![](https://i.imgur.com/KvL4TlA.png)
s
