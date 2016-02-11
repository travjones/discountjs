// task data
var taskData = {
    immAmount: 500,
    delAmount: 1000,
    changeAmount: [250, 125, 62.5, 31.25, 15.63],
    probVal: [{
        inProb: 0.95,
        inWords: "95%"
    }, {
        inProb: 0.9,
        inWords: "90%"
    }, {
        inProb: 0.75,
        inWords: "75%"
    }, {
        inProb: 0.5,
        inWords: "50%"
    }, {
        inProb: 0.33,
        inWords: "33%"
    }, {
        inProb: 0.1,
        inWords: "10%"
    }, {
        inProb: 0.05,
        inWords: "5%"
    }]
};

// calculate odds against and add to taskData object
for (i = 0; i < taskData.probVal.length; i++) {
    var oddsAgainst = (1 - taskData.probVal[i].inProb) / taskData.probVal[i].inProb;
    taskData.probVal[i].oddsAgainst = oddsAgainst;
}

console.log(taskData);

// subject data
var subjectData = {
    delays: [],
    indiffVals: [],
};

var makingChoice = true;

var delayCounter = 0;

function start() {
    // setup trial view/html
    var trialHTML = "<div class=\"task-container\">\r\n<div class=\"container u-vert-align\">\r\n  <div class=\"row\">\r\n    <div class=\"u-full-width\"><p class=\"instructions\">Which would you prefer?<\/p><\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns now-label\">For sure<\/div>\r\n    <div class=\"six columns after-label\" id=\"delay\">With a x chance<\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"imm-btn\">immediate amount<\/button>\r\n    <\/div>\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"del-btn\">delayed amount<\/button>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>\r\n<\/div>";
    document.body.innerHTML = trialHTML;

    delay = document.getElementById("delay");
    delay.textContent = "With a " + taskData.probVal[delayCounter].inWords + " chance";

    if (makingChoice) {

        task();

    } else {

        console.log(subjectData);

        delayCounter++;

        // end task after no more delays
        if (delayCounter > taskData.probVal.length - 1) {
            showResults();
            return; // end execution of start() before task() called again
        }

        task();
    }
}

var task = (function() {

    // init variables
    var trialCounter = 0;
    var curImmAmount = taskData.immAmount;
    var immChoiceCount = 0;

    // remember: variable declarations without var are automatically GLOBAL
    immBtn = document.getElementById("imm-btn");
    delBtn = document.getElementById("del-btn");
    immBtn.textContent = "$" + taskData.immAmount;
    delBtn.textContent = "$" + taskData.delAmount;
    delay.textContent = "With a " + taskData.probVal[delayCounter].inWords + "chance";

    var delayedChoice = function() {

        if (trialCounter > 3) {
            // reset counters, makingChoice = false -> next delay

            // immediate amount never selected on this trial
            if (immChoiceCount == 0) {
                subjectData.delays.push(taskData.probVal[delayCounter].oddsAgainst);
                subjectData.indiffVals.push(taskData.delAmount);
            } else {
                subjectData.delays.push(taskData.probVal[delayCounter].oddsAgainst);
                subjectData.indiffVals.push(curImmAmount);
            }

            trialCounter = 0;
            makingChoice = false;
            start();
        } else {
            curImmAmount = curImmAmount + taskData.changeAmount[trialCounter];
            immBtn.textContent = "$" + curImmAmount;
        }

        trialCounter++;
    };

    var immediateChoice = function() {
        immChoiceCount++;

        if (trialCounter > 3) {
            // reset counters, makingChoice = false -> next delay
            subjectData.delays.push(taskData.probVal[delayCounter].oddsAgainst);
            subjectData.indiffVals.push(curImmAmount);
            trialCounter = 0;
            makingChoice = false;
            start();
        } else {
            curImmAmount = curImmAmount - taskData.changeAmount[trialCounter];
            immBtn.textContent = "$" + curImmAmount;
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
    calc();
}

function sendData() {
    var xmlhttp = new XMLHttpRequest();   // should use fetch -- XHR is deprecated
    xmlhttp.open("POST", "/data");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(subjectData));
}

// event listener - start
document.getElementById("start-btn").addEventListener("click", start);