var time = 0;var timeTotal = 0;var timeMax = 0;
var coefficient = 1.1;

var secondUnlock = 1;
var secondHands = 1;//make time for you
var secondHandCost = 15; var secondHandStartCost = secondHandCost;

var minuteUnlock = 60;//when it shows up
var minuteHands = 1;//make time for you
var minuteHandCost = 15*60; var minuteHandStartCost = minuteHandCost;

var hourUnlock = 3600;//when it shows up
var hourHands = 1;//make time for you
var hourHandCost = 15*3600; var hourHandStartCost = hourHandCost;

//helper variables
var second = 1;
var minute = 60;
var hour = 3600;
var day = 86400;
var week =604800;

var tick = 0;
function timeClick(num){
  for(var i =0; i <num;i++){
    time+=1;
    timeTotal+=1;
    moveSecondHands();
    if(time%60==0){
      //spaceClick();
      moveMinuteHands();
      for(var j =0; j<minuteHands-1;j++){
        moveMinuteHands();
        var old_time = time%3600;//if this is higher than new time, you went to a new hour!
        time+=60;
        timeTotal+=60;
        if(time%3600<old_time){
          moveHourHands();
          for(var k=0;k<hourHands-1;k++){
            moveHourHands();
            time+=3600;
            timeTotal+=3600;
          }
        }

      }
    }
    if(time%3600==0){
      moveHourHands();
      for(var k=0;k<hourHands-1;k++){
        moveHourHands();
        time+=3600;
        timeTotal+=3600;
      }
    }
  }
  if(time>timeMax){
    timeMax = time;
  }
  updateDisplay();
}
function spaceClick(){
  space+=1;
  spaceTotal+=1;
  updateDisplay();
}
function buyHand(num){
  switch(num){
    case 0://secondHands
      secondHandCost = Math.floor(secondHandStartCost*Math.pow(coefficient,secondHands-1));
      if(time >= secondHandCost){
        secondHands += 1;
        time -= secondHandCost;
        setHands();
      }
      break;
    case 1://minuteHands
        minuteHandCost = Math.floor(minuteHandStartCost*Math.pow(coefficient,minuteHands-1));
        if(time >= minuteHandCost){
          minuteHands += 1;
          time -= minuteHandCost;
          setHands();
        }
        break;
    case 2://hourHands
        hourHandCost = Math.floor(hourHandStartCost*Math.pow(coefficient,hourHands-1));
        if(time >= hourHandCost){
          hourHands += 1;
          time -= hourHandCost;
          setHands();
        }
        break;
  }


  updateDisplay();
}

window.setInterval(function(){
  updateDisplay();
  tick+=1;
  if(tick%1==0){
    timeClick(secondHands);
  }
},1000)


function start(){
  load();
  //time = 0;
  //space = 0;
  updateDisplay();
}
function restart(){
  localStorage.removeItem("save");
  location.reload();
}

function updateDisplay(){
  secondHandCost = Math.floor(secondHandStartCost*Math.pow(coefficient,secondHands-1));
  minuteHandCost = Math.floor(minuteHandStartCost*Math.pow(coefficient,minuteHands-1));
  hourHandCost = Math.floor(hourHandStartCost*Math.pow(coefficient,hourHands-1));
  document.getElementById("time").innerHTML = showTime(time);
  //document.getElementById("space").innerHTML = showSpace();
  document.getElementById("secondHandCost").innerHTML = showTime(secondHandCost);
  document.getElementById("numSeconds").innerHTML = prettify(secondHands)+"s/s";
  document.getElementById("minuteHandCost").innerHTML = showTime(minuteHandCost);
  document.getElementById("numMinutes").innerHTML = prettify(minuteHands)+"m/m";
  document.getElementById("hourHandCost").innerHTML = showTime(hourHandCost);
  document.getElementById("numHours").innerHTML = prettify(hourHands)+"hr/hr";
  if(timeMax>=secondUnlock){
    document.getElementById("seconds").style.display = "table-row";
  }else{
    document.getElementById("seconds").style.display = "none";
  }
  if(timeMax>=minuteUnlock){
    document.getElementById("minutes").style.display = "table-row";
  }else{
    document.getElementById("minutes").style.display = "none";
  }
  if(timeMax>=hourUnlock){
    document.getElementById("hours").style.display = "table-row";
  }else{
    document.getElementById("hours").style.display = "none";
  }
  document.getElementById("realtime").innerHTML = showTime(tick);
  //initLocalClocks();
}

function prettify(input){
  var output = Math.round(input*100)/100;
  return output;
}
function showTime(time){
  var s = "";
  //seconds
  s+= time%60;
  if(time%60<10){
    s = "0"+s;
  }
  if(time<60){
    return "00:"+s;
  }
  //minutes
  minute = parseInt(time/60);
  if(minute <60){
    if(minute<10){
      minute = "0"+minute;
    }
    return minute+":"+s;
  }else{
    minute = minute%60;
    if(minute<10){
      minute = "0"+minute;
    }
  }
  s = minute+":"+s;
  //hours
  hour = parseInt((time/60)/60);
  if(hour<24){
    if(hour<10){
      hour = "0"+hour;
    }
    return hour+":"+s;
  }else{
    hour = hour%24;
    if(hour<10){
      hour = "0"+hour;
    }
    s = hour+":"+s;
  }
  //days
  day = parseInt(time/86400);
  if(day<7){
    return day+"d "+s;
  }else{
    day = (day%7)+1;
    s = day+"d "+s;
  }
  //weeks
  week = parseInt(time/604800);
  s = week+"w "+s;
  return s
}
function showSpace(){
  var s = "";
  s += space+"/"+spaceTotal;
  return s;
}

function save(){
  var save = {
    time: time,
    timeTotal: timeTotal,
    timeMax: timeMax,
    secondHands: secondHands,
    minuteHands: minuteHands,
    hourHands: hourHands,
    tick: tick
  }
  localStorage.setItem("save",JSON.stringify(save));
}
function load(){
  var savegame = JSON.parse(localStorage.getItem("save"));
  if(savegame != null){
    if (typeof savegame.time !== "undefined") time = savegame.time;
    if (typeof savegame.timeTotal !== "undefined") timeTotal = savegame.timeTotal;
    if (typeof savegame.timeMax !== "undefined") timeMax = savegame.timeMax;
    if (typeof savegame.secondHands !== "undefined") secondHands = savegame.secondHands;
    if (typeof savegame.minuteHands !== "undefined") minuteHands = savegame.minuteHands;
    if (typeof savegame.hourHands !== "undefined") hourHands = savegame.hourHands;
    if (typeof savegame.tick !== "undefined") tick = savegame.tick;
    setHands();
    updateDisplay();
  }
}
