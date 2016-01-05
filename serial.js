// task data
var taskData = {
    // immAmount: [1000, 990, 960, 920, 850, 800, 750, 700, 650, 600, 550, 500, 450, 400, 350, 300, 250, 200, 150, 100, 80, 60, 40, 20, 10, 5, 1],
    immAmount: [1000, 960, 850, 750, 650, 550, 450, 350, 250, 150, 80, 40, 10, 1],
    delAmount: 1000,
    delLength: [{
        inMonths: 0.25,
        inWords: "1 week"
    }, {
        inMonths: 0.5,
        inWords: "2 weeks"
    }, {
        inMonths: 1,
        inWords: "1 month"
    }, {
        inMonths: 6,
        inWords: "6 months"
    }, {
        inMonths: 12,
        inWords: "1 year"
    }, {
        inMonths: 60,
        inWords: "5 years"
    }, {
        inMonths: 300,
        inWords: "25 years"
    }]
};

// subject data
var subjectData = {
    delays: [],
    indiffVals: [],
};

var makingChoice = true;

var delayCounter = 0;

function start() {
    // setup trial view/html
    var trialHTML = "<div class=\"task-container\">\r\n<div class=\"container u-vert-align\">\r\n  <div class=\"row\">\r\n    <div class=\"u-full-width\"><p class=\"instructions\">Which would you prefer?<\/p><\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns now-label\">Now<\/div>\r\n    <div class=\"six columns after-label\" id=\"delay\">After x<\/div>\r\n  <\/div>\r\n  <div class=\"row\">\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"imm-btn\">immediate amount<\/button>\r\n    <\/div>\r\n    <div class=\"six columns\">\r\n      <button class=\"task-button\" id=\"del-btn\">delayed amount<\/button>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>\r\n<\/div>";
    document.body.innerHTML = trialHTML;

    delay = document.getElementById("delay");
    delay.textContent = "After " + taskData.delLength[delayCounter].inWords;

    if (makingChoice) {

        task();

    } else {

        //calculate indifference
        
        if (immChoicesDesc.length == 0) {
            // no immediate choice selected
            immChoicesDesc[0] = taskData.delAmount;
        }

        if (immChoicesAsc.length == 0) {
            // no immediate choice selected
            immChoicesAsc[0] = taskData.delAmount;
        }

        var indiff = (immChoicesDesc[immChoicesDesc.length - 1] + immChoicesAsc[0]) / 2

        // record subject data for each delay
        subjectData.delays.push(taskData.delLength[delayCounter].inMonths);
        subjectData.indiffVals.push(indiff);
        console.log(subjectData);

        delayCounter++;

        // end task after no more delays
        if (delayCounter > taskData.delLength.length - 1) {
            showResults();
            return; // end execution of start() before task() called again
        }
        task();
    }
}

var task = (function() {

    // init variables
    var amountCounter = 0,
    amountCounterAsc = taskData.immAmount.length - 1;

    immChoicesDesc = [],
    immChoicesAsc = [];

    // remember: variable declarations without var are automatically GLOBAL
    immBtn = document.getElementById("imm-btn");
    delBtn = document.getElementById("del-btn");
    immBtn.textContent = "$" + taskData.immAmount[amountCounter];
    delBtn.textContent = "$" + taskData.delAmount;
    delay.textContent = "After " + taskData.delLength[delayCounter].inWords;

    var nextQuestion = function() {
        amountCounter++;
        immBtn.textContent = "$" + taskData.immAmount[amountCounter];

        if (amountCounter > taskData.immAmount.length - 1) {
            amountCounterAsc--;
            immBtn.textContent = "$" + taskData.immAmount[amountCounterAsc];

            if (amountCounterAsc < 0) {
                // reset counters, makingChoice = false -> next delay
                amountCounter = 0;
                amountCounterAsc = taskData.immAmount.length - 1;
                makingChoice = false;
                start();
            }
        }
    };

    var recordAnswer = function() {
        if (amountCounter > taskData.immAmount.length - 1) {
            //splice $ from string
            // immChoicesAsc.push(parseInt(immBtn.textContent.substring(1)));
            immChoicesAsc.push(taskData.immAmount[amountCounterAsc]);
            console.log(immChoicesAsc);
            nextQuestion();
        } else {
            //splice $ from string
            // immChoicesDesc.push(parseInt(immBtn.textContent.substring(1)));
            immChoicesDesc.push(taskData.immAmount[amountCounter]);
            console.log(immChoicesDesc);
            nextQuestion();
        }
    };

    // event listeners
    immBtn.addEventListener("click", recordAnswer);
    delBtn.addEventListener("click", nextQuestion);
});

function showResults() {
    // alert("results!");
    var resultsHTML = "<div class=\"results-container\">\r\n  <div class=\"container u-vert-align\">\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\"><h3>Results<\/h3><\/div>\r\n    <\/div>\r\n    <div class=\"row\">\r\n      <div class=\"u-full-width\" id=\"results-k\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-a\"><\/div>\r\n      <div class=\"u-full-width\" id=\"results-graph\"><\/div>\r\n    <\/div>\r\n  <\/div>\r\n<\/div>";
    document.body.innerHTML = resultsHTML;
    calc();
}

function sendData() {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
    xmlhttp.open("POST", "/data");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(subjectData));
}

// event listener - start
document.getElementById("start-btn").addEventListener("click", start);