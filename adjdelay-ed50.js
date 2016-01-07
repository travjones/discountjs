// task data - see Koffarnus and Bickel (2015) Table 1
taskData = {
	immAmount: 500,
	delAmount: 1000,
	delay: ["1 hour", "2 hours", "3 hours", "4 hours", "6 hours", "9 hours", "12 hours", "1 day", 
			"1.5 days", "2 days", "3 days", "4 days", "1 week", "1.5 weeks", "2 weeks", "3 weeks",
			"1 month", "2 months", "3 months", "4 months", "6 months", "8 months", "1 year",
			"2 years", "3 years", "4 years", "5 years", "8 years", "12 years", "18 years", "25 years"],
	immediateED50: [],
	delayedED50: [],
	immediateK: [24.0, 0, 9.79, 0, 4.9, 0, 2.31, 0, 0.816, 0, 0.408, 0, 0.189, 0, 0.0825,
				 0, 0.0396, 0, 0.0134, 0, 0.00671, 0, 0.00335, 0, 0.00112, 0, 0.000612, 0,
				 0.000279, 0, 0.000129],
	delayedK: [17.0, 0, 6.93, 0, 3.27, 0, 1.41, 0, 0.577, 0, 0.289, 0, 0.117, 0, 0.0583,
			   0, 0.0232, 0, 0.00949, 0, 0.004741, 0, 0.00194, 0, 0.000791, 0, 0.000433,
			   0, 0.000186, 0, 0.000110],
	indexChange: [8, 4, 2, 1]
};

// subject data
subjectData = {}

var trialCounter = 0;

var taskIndex = 15;

function start() {
    // setup trial view/html
    var trialHTML = "<div class=\"task-container\">\r\n<div class=\"container u-vert-align\">\r\n  <div class=\"row\">\r\n    <div class=\"u-full-width\"><p class=\"instructions\">Which would you prefer?<\/p><\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns now-label\">Now<\/div>\r\n    <div class=\"six columns after-label\" id=\"delay\">After x<\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"imm-btn\">immediate amount<\/button>\r\n    <\/div>\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"del-btn\">delayed amount<\/button>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>\r\n<\/div>";
    document.body.innerHTML = trialHTML;

    delay = document.getElementById("delay");
    delay.textContent = "After " + taskData.delay[taskIndex];

    task();
}

var task = (function() {

    // remember: variable declarations without var are automatically GLOBAL
    immBtn = document.getElementById("imm-btn");
    delBtn = document.getElementById("del-btn");
    immBtn.textContent = "$" + taskData.immAmount;
    delBtn.textContent = "$" + taskData.delAmount;
    delay.textContent = "After " + taskData.delay[taskIndex];

    var delayedChoice = function() {
        if (trialCounter > 3) {
        	subjectData.k = taskData.delayedK[taskIndex];
        	console.log(subjectData);
            showResults();
        } else {
            taskIndex = taskIndex + taskData.indexChange[trialCounter];
    		delay.textContent = "After " + taskData.delay[taskIndex];
        }

        trialCounter++;
    };

    var immediateChoice = function() {
        if (trialCounter > 3) {
        	subjectData.k = taskData.immediateK[taskIndex];
        	console.log(subjectData);
            showResults();
        } else {
            taskIndex = taskIndex - taskData.indexChange[trialCounter];
    		delay.textContent = "After " + taskData.delay[taskIndex];
        }

        trialCounter++;
    };

    // event listeners
    immBtn.addEventListener("click", immediateChoice);
    delBtn.addEventListener("click", delayedChoice);
});

function showResults() {
    var resultsHTML = "<div class=\"results-container\">\r\n  <div class=\"container u-vert-align\">\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\"><h3>Results<\/h3><\/div>\r\n    <\/div>\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\" id=\"results-k\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-a\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-graph\"><\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>";
    document.body.innerHTML = resultsHTML;

	var googleGraphURL = "https://www.google.com/?gws_rd=ssl#q=" + taskData.delAmount + "%2F(1%2B" + subjectData.k + "x)";
	var graphLink = document.createElement("a");
	graphLink.setAttribute("href", googleGraphURL);
	graphLink.setAttribute("target", "_blank");
	graphLink.textContent = "See your function!";

	document.getElementById("results-k").textContent = "k: " + subjectData.k;
	document.getElementById("results-graph").appendChild(graphLink);

	sendData();
}

function sendData() {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/data");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(subjectData));
}

// event listener - start
document.getElementById("start-btn").addEventListener("click", start);