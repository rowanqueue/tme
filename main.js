var time = 0;var timeTotal = 0;var timeMax = 0;var timeTotalPrestige = 0;
var coefficient = 1.1;
var coefficients = [coefficient,coefficient,coefficient];
var prestigeCoefficient = 1.2;

var updateTick = 1000;
var maxMade = 3;
var names = ["second","minute","hour","day","week"];
var unit = ["s","m","h","d","w"];
var unlock = [1,60,3600,86400,604800];
var amount = [1,60,3600,86400,604800];
var threshold = [60,3600,86400,604800,31536000];
var hands = [1,1,1,0,0];
var starthands = [hands[0],hands[1],hands[2],hands[3],hands[4]];
var handCost = [30,1800,43200];//[15,15*60,15*3600,15*86400,15*604800];
var startCost = [handCost[0],handCost[1],handCost[2],handCost[3],handCost[4]];


var prestigeStartCost = 900; var prestigeCost = prestigeStartCost;//how much it costs to prestige
var prestiges = 0;//how many times you've prestiged

var timeSpeed = 0;


//helper variables
var second = 1;
var minute = 60;
var hour = 3600;
var day = 86400;
var week =604800;
var year =31536000;

var tick = 0;
var lastSaveTick = 0;
function cheat(){
  prestiges = 60;
  setHands();
  updateDisplay();
}
function newTimeClick(l){
  var numHands = hands[l];
  if(l!=0){
    numHands-=1;
    switch(l){
        case 0:
          moveSecondHands();
          break;
        case 1:
          moveMinuteHands();
          break;
        case 2:
          moveHourHands();
          break;
    }
  }
  if(l==-1){
    l = 0;
    numHands = hands[0];
  }
  for(var i = 0; i < numHands;i++){
    var old_time_chunk = Math.floor(time>threshold[l]);
    time+=amount[l];
    timeTotal+=amount[l];
    timeTotalPrestige+=amount[l];
    switch(l){
        case 0:
          moveSecondHands();
          break;
        case 1:
          moveMinuteHands();
          break;
        case 2:
          moveHourHands();
          break;
    }
    if(time%threshold[l]==0 || Math.floor(time>threshold[l]) > old_time_chunk){
      if(l<maxMade){
        newTimeClick(l+1);
      }
    }
  }
  if(time>timeMax){
    timeMax = time;
  }
  updateDisplay();


}
function timeClick(num){
  for(var i =0; i <num;i++){
    time+=1;
    timeTotal+=1;
    moveSecondHands();
    if(time%60==0){
      //spaceClick();
      moveMinuteHands();
      for(var j =0; j<hands[1]-1;j++){
        moveMinuteHands();
        var old_time_hour = time%3600;//if this is higher than new time, you went to a new hour!
        var old_time_day = time%86400;//if tihs is higher than new, you went to a new day!
        time+=60;
        timeTotal+=60;
        if(time%86400<old_time_day){
          moveDayHands();
        }
        if(time%3600<old_time_hour){
          moveHourHands();
          for(var k=0;k<hands[2]-1;k++){
            moveHourHands();
            old_time_day = time%86400;
            time+=3600;
            timeTotal+=3600;
          }
        }
      }
    }
    if(time%3600==0){
      moveHourHands();
      for(var k=0;k<hands[2]-1;k++){
        moveHourHands();
        var old_time_day = time%86400;
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
function prestigeClick(){
  prestigeCost = Math.floor(prestigeStartCost*Math.pow(prestigeCoefficient,prestiges));
  if(time>=prestigeCost){
    prestiges++;
    hands[0]=1;
    hands[1]=1;
    hands[2]=1;
    time=0;
    timeMax = 0;
    timeTotalPrestige = 0;
    updateTick = Math.floor(1000*Math.pow(0.9,prestiges));
    setHands();
    updateDisplay();
    save();
  }
}
function spaceClick(){
  space+=1;
  spaceTotal+=1;
  updateDisplay();
}
function buyHand(n){
  handCost[n] = Math.floor(startCost[n]*Math.pow(coefficients[n],hands[n]-1));
  if(time >= handCost[n]){
    hands[n] += 1;
    time -= handCost[n];
    setHands();
    updateDisplay();
    save();
  }
}

var sec = function(){
  newTimeClick(0);
  updateDisplay();
  updateTick = Math.floor(1000*Math.pow(0.9,prestiges));
  setTimeout(sec,updateTick);
}
window.setTimeout(sec,updateTick);
window.setInterval(function(){
  tick+=1;
  //newTimeClick(0);
  if(tick%10==0){
    save();
  }
  updateDisplay();
},1000)


function start(){
  load();
  //time = 0;
  //space = 0;
  updateTick = Math.floor(1000*Math.pow(0.9,prestiges));
  updateDisplay();

}
function restart(){
  localStorage.removeItem("save");
  location.reload();
}
function CalculateSpeed(){
  var speed = hands[0];
  if(hands[1]> 0){
    speed += ((hands[0]/60)*(hands[1]-1)*60);
  }
  if(hands[2]> 0){
    speed += (speed/3600)*(hands[2]-1)*3600;
  }
  speed *= 1000/updateTick;
  if(speed < 60){
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += " s/s";
  }else if(speed < 3600){
    speed = speed/60;
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += " m/s";
  }else if(speed < 86400){
    speed = speed/3600;
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += " hr/s";
  }else if(speed < 604800){
    speed = speed/86400;
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += " d/s";
  }else if(speed < 31536000){
    speed = speed/604800;
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += " w/s";
  }else{
    speed = speed/31536000;
    speed = Number(Math.round(speed+'e1')+'e-1');
    speed += "y/s";
  }
  return "~"+speed;
}

function updateDisplay(){
  document.getElementById("time").innerHTML = showTime(time);
  timeSpeed = CalculateSpeed();
  document.getElementById("timeSpeed").innerHTML = timeSpeed;
  //document.getElementById("space").innerHTML = showSpace();
  for(var i =0; i < maxMade;i++){
    handCost[i] = Math.floor(startCost[i]*Math.pow(coefficients[i],hands[i]-1));
    var name = names[i];
    //if(timeMax>=unlock[i]){
    if(i ==0 || hands[i-1]> 1){
      document.getElementById(name).style.display = "table-row";
      document.getElementById("num"+name).innerHTML = prettify(hands[i])+" "+unit[i]+"/"+unit[i];
      document.getElementById(name+"HandCost").innerHTML = showTime(handCost[i]);
    }else{
      document.getElementById(name).style.display = "none";
    }
    //if(hands[i]>0){
      document.getElementById(name+"-show").style.display = "block";
    //}else{
    //  document.getElementById(name+"-show").style.display = "none";
    //}
  }
  prestigeCost = Math.floor(prestigeStartCost*Math.pow(prestigeCoefficient,prestiges));
  document.getElementById("updateTick").innerHTML = prettify(updateTick)+"ms/s";
  document.getElementById("timeTotal").innerHTML = showTime(timeTotal);
  if(prestiges > 0 || timeMax > prestigeStartCost/2){
    document.getElementById("timeTotalPrestige").innerHTML = showTime(timeTotalPrestige);
    document.getElementById("prestige").style.display = "table-row";
    document.getElementById("numprestige").innerHTML = prettify(prestiges);
    document.getElementById("prestigeCost").innerHTML = showTime(prestigeCost);
  }else{
    document.getElementById("prestige").style.display = "none";
  }

  document.getElementById("realtime").innerHTML = showTime(tick);
  if(tick%10==0){
    document.getElementById("saving").innerHTML = "saving...";
  }else{
    document.getElementById("saving").innerHTML = "";
  }
  //initLocalClocks();
}

function prettify(input){
  var output = Math.round(input*100)/100;
  return output;
}
function showTime(time){
  var s = "";
  //seconds
  s+= Math.floor(time%60);
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
  if(week<52){
    return week+"w "+s;
  }else{
      week = (week%52)+1;
      s = week+"w "+s;
  }
  //years
  year = parseInt(time/31536000);
  s = year+"y "+s;
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
    timeTotalPrestige: timeTotalPrestige,
    secondHands: hands[0],
    minuteHands: hands[1],
    hourHands: hands[2],
    prestiges: prestiges,
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
    if (typeof savegame.timeTotalPrestige !== "undefined") timeTotalPrestige = savegame.timeTotalPrestige;
    if (typeof savegame.secondHands !== "undefined") hands[0] = savegame.secondHands;
    if (typeof savegame.minuteHands !== "undefined") hands[1] = savegame.minuteHands;
    if (typeof savegame.hourHands !== "undefined") hands[2] = savegame.hourHands;
    if (typeof savegame.prestiges !== "undefined") prestiges = savegame.prestiges;
    if (typeof savegame.tick !== "undefined") tick = savegame.tick;
    setHands();
    updateDisplay();
  }
}
