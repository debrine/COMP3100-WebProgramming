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

play_checkers.html and playCheckers.js turns the code above into a custom web component for easier use in an HTML document. It also adds the feature of dragging and dropping checker pieces on the board. (Note that there is no checking whether the move is valid or the spce is currently occupied.)

## Stars ##
Created a custom web component that creates an isotoxal star with a specified number of points. This is done using HTML, CSS, SVG and javascript. 
