function calc() {

	var fun = function(x, P) {
		// dd hyperbolic with sensitivity param (see Dallery et al., 2007)
		return x.map(function(xi){return (taskData.delAmount/(Math.pow((1+P[0]*xi),P[1])))})
	};

	var x = subjectData.delays;
	var y = subjectData.indiffVals;

	var params = fminsearch(fun,[0.5,0.5],x,y);
	console.log(params);

	var googleGraphURL = "https://www.google.com/?gws_rd=ssl#q=" + taskData.delAmount + "%2F(1%2B" + params[0] + "x)%5E" + params[1];
	var graphLink = document.createElement("a");
	graphLink.setAttribute("href", googleGraphURL);
	graphLink.setAttribute("target", "_blank");
	graphLink.textContent = "See your function!";

	document.getElementById("results-k").textContent = "k: " + parseFloat(params[0]).toFixed(3);
	document.getElementById("results-a").textContent = "a: " + parseFloat(params[1]).toFixed(3);
	document.getElementById("results-graph").appendChild(graphLink);

	subjectData.kValue = params[0];
	subjectData.aValue = params[1];

	sendData();

	return params;
}


// fminsearch -- https://github.com/jonasalmeida/fminsearch
var fminsearch=function(fun,Parm0,x,y,Opt){// fun = function(x,Parm)

	if(!Opt){Opt={}};
	if(!Opt.maxIter){Opt.maxIter=1000};
	if(!Opt.step){// initial step is 1/100 of initial value (remember not to use zero in Parm0)
		Opt.step=Parm0.map(function(p){return p/100});
		Opt.step=Opt.step.map(function(si){if(si==0){return 1}else{ return si}}); // convert null steps into 1's
	};
	if(typeof(Opt.display)=='undefined'){Opt.display=true};
	if(!Opt.objFun){Opt.objFun=function(y,yp){return y.map(function(yi,i){return Math.pow((yi-yp[i]),2)}).reduce(function(a,b){return a+b})}} //SSD

		var cloneVector=function(V){return V.map(function(v){return v})};
	var ya,y0,yb,fP0,fP1;
	var P0=cloneVector(Parm0),P1=cloneVector(Parm0);
	var n = P0.length;
	var step=Opt.step;
	var funParm=function(P){return Opt.objFun(y,fun(x,P))}//function (of Parameters) to minimize
	// silly multi-univariate screening
	for(var i=0;i<Opt.maxIter;i++){
		for(var j=0;j<n;j++){ // take a step for each parameter
			P1=cloneVector(P0);
			P1[j]+=step[j];
			if(funParm(P1)<funParm(P0)){ // if parm value going in the right direction
				step[j]=1.2*step[j]; // then go a little faster
				P0=cloneVector(P1);
			}
			else{
				step[j]=-(0.5*step[j]); // otherwiese reverse and go slower
			}
		}
		if(Opt.display){if(i>(Opt.maxIter-10)){console.log(i+1,funParm(P0),P0)}}
	}
	if (!!document.getElementById('plot')){ // if there is then use it
		fminsearch.plot(x,y,fun(x,P0),P0);
	}
	return P0
};
