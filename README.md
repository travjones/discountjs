#discountjs

discountjs is a javascript library for running delay discounting tasks on the web. Three types of tasks are included: 

* serial.js - similar to Bickel, Odum, & Madden (1999) - immediate amounts are iterated through in descending and then ascending order to assess indifference

* adjamount.js - adjusting amount task - 5 trials per delay, next immediate amount dependent on previous subject response 

* adjdelay-ed50.js - super-quick, 5-trial adjusting delay task (described by Koffarnus & Bickel, 2015)

###Instructions
Click "Download ZIP" (upper-right) and unzip. Open index.html. The adjusting amount (adjamount.js) task is default.

####Serial task
If you would like to use the serial (similar to Bickel et al., 1999) task instead, you will have to edit one line of code in index.html. Open index.html in a text editor (I recommend Sublime Text).

Find this line.
```html
	<script type="text/javascript" src="adjamount.js"></script>
```
Change it to:
```html
	<script type="text/javascript" src="serial.js"></script>
```
####Adjusting delay task
If you would like to use the adjusting delay task, you will have to edit one line of code in index.html. Open index.html in a text editor (I recommend Sublime Text).

Find this line.
```html
	<script type="text/javascript" src="adjamount.js"></script>
```
Change it to:
```html
	<script type="text/javascript" src="adjdelay-ed50.js"></script>
```

####main.go
I included a main.go file to demonstrate how one could serve the static files (e.g., discountjs frontend JS), accept subject data from the discounting task as JSON via POST request, and persist this data in a database. 