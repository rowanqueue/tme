var time = 0;var timeTotal = 0;var timeMax = 0;var timeTotalPrestige = 0;
var coefficient = 1.1; var coefficientStart = 1.1;
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


var prestigeCost = [302400,31536000/2,100000000];
var prestigeStartCost = [prestigeCost[0],prestigeCost[1],prestigeCost[2]];
var prestiges = [0,0,0];//how many times you've prestiged for lowering time
var prestigeNames = ["Seconds","Cost"];
//prestige 0: lowers milliseconds in a second
//prestige 1: lowers coefficient to buy stuff

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
  time+=100000000;
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
  var old_time_chunk = Math.floor(time/threshold[l]);
  var old_time_chunker = 0;
  if(l==0){
    old_time_chunker = Math.floor(time/threshold[l+1]);
  }
  time+=amount[l]*numHands;
  timeTotal+=amount[l]*numHands;
  timeTotalPrestige+=amount[l]*numHands;
  switch(l){
      case 0:
        for(var i = 0; i < numHands;i++){
          moveSecondHands();
        }

        break;
      case 1:
      for(var i = 0; i < numHands;i++){
        moveMinuteHands();
      }
        break;
      case 2:
      for(var i = 0; i < numHands;i++){
        moveHourHands();
      }
        break;
  }
  var new_time_chunk = Math.floor(time/threshold[l]);
  var new_time_chunker = 0;
  if(l==0){
    new_time_chunker = Math.floor(time/threshold[l+1]);
  }
  if(l== 0 && new_time_chunker>old_time_chunker){//you went over an hour with just seconds
    if(l<maxMade-2){
      while(new_time_chunker>old_time_chunker){
        newTimeClick(l+2);
        old_time_chunker++;
      }
    }
  }
  if(time%threshold[l]==0 || new_time_chunk>old_time_chunk){
    if(l<maxMade-1){
      while(new_time_chunk>old_time_chunk){
        newTimeClick(l+1);
        old_time_chunk++;
      }
    }
  }
  /*for(var i = 0; i < numHands;i++){
    var old_time_chunk = Math.floor(time/threshold[l]);
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
    var new_time_chunk = Math.floor(time/threshold[l]);
    if(time%threshold[l]==0 || new_time_chunk > old_time_chunk){
      old_time_chunk++;
      if(l<maxMade){
        newTimeClick(l+1);
        while(new_time_chunk>old_time_chunk){
          old_time_chunk++;
          newTimeClick(l+1);
        }
      }

    }
  }*/
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
function prestigeClick(n){
  prestigeCost[n] = Math.floor(prestigeStartCost[n]*Math.pow(prestigeCoefficient,prestiges[n]));
  if(prestiges[n]< 60 && time>=prestigeCost[n]){
    prestiges[n]++;
    hands[0]=1;
    hands[1]=1;
    hands[2]=1;
    time=0;
    timeMax = 0;
    timeTotalPrestige = 0;
    updateTick = Math.floor(1000*Math.pow(0.927,prestiges[0]));
    coefficient = (coefficientStart-(prestiges[1]*0.00157));
    setHands();
    updateDisplay();
    save();
  }
}
function prestigeMaxClick(n){
  //buy as many prestiges as possible
  var maxPrestigeBuy = Math.floor(Math.log((time*(prestigeCoefficient-1)/(prestigeStartCost[n]*Math.pow(prestigeCoefficient,prestiges[n])))+1)/Math.log(prestigeCoefficient));
  if(prestiges[n]+maxPrestigeBuy>60){
    maxPrestigeBuy = 60-prestiges[n];
  }
  var maxCost = prestigeStartCost[n]*((Math.pow(prestigeCoefficient,prestiges[n]))*((Math.pow(prestigeCoefficient,maxPrestigeBuy))-1)/(prestigeCoefficient-1))
  if(time>= maxCost){
    prestiges[n]+=maxPrestigeBuy;
    hands[0]=1;
    hands[1]=1;
    hands[2]=1;
    time=0;
    timeMax=0;
    timeTotalPrestige=0;
    updateTick = Math.floor(1000*Math.pow(0.927,prestiges[0]));
    coefficient = (coefficientStart-(prestiges[1]*0.00157));
    setHands();
    updateDisplay();
    save();
  }
}
function buyHand(n){
  handCost[n] = Math.floor(startCost[n]*Math.pow(coefficient,hands[n]-1));
  if(time >= handCost[n]){
    hands[n] += 1;
    time -= handCost[n];
    setHands();
    updateDisplay();
    save();
  }
}
function buyMaxHand(n){
  var maxBuy = Math.floor(Math.log((time*(coefficient-1)/(startCost[n]*Math.pow(coefficient,hands[n]-1)))+1)/Math.log(coefficient));
  var maxCost = startCost[n]*((Math.pow(coefficient,hands[n]-1))*((Math.pow(coefficient,maxBuy))-1)/(coefficient-1))
  if(time >= maxCost){
    time-=maxCost;
    hands[n]+=maxBuy;
    setHands();
    updateDisplay();
    save();
  }
}

var sec = function(){
  newTimeClick(0);
  updateDisplay();
  updateTick = Math.floor(1000*Math.pow(0.927,prestiges[0]));
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
  updateTick = Math.floor(1000*Math.pow(0.927,prestiges[0]));
  coefficient = (coefficientStart-(prestiges[1]*0.00157));
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
  document.getElementById("coefficient").innerHTML = prettify(coefficient);
  document.getElementById("time").innerHTML = showTime(time);
  timeSpeed = CalculateSpeed();
  document.getElementById("timeSpeed").innerHTML = timeSpeed;
  //document.getElementById("space").innerHTML = showSpace();
  for(var i =0; i < maxMade;i++){
    handCost[i] = Math.floor(startCost[i]*Math.pow(coefficient,hands[i]-1));
    var name = names[i];
    //if(timeMax>=unlock[i]){
    if(i ==0 || hands[i-1]> 1){
      document.getElementById(name).style.display = "table-row";
      document.getElementById("num"+name).innerHTML = prettify(hands[i])+" "+unit[i]+"/"+unit[i];
      if(time>=handCost[i]){
        document.getElementById(name+"button").style.background = "#111111";
      }else{
          document.getElementById(name+"button").style.background = "#ffffff";
      }

      document.getElementById(name+"HandCost").innerHTML = showTimeShort(handCost[i]);
      var maxBuy = Math.floor(Math.log((time*(coefficient-1)/(startCost[i]*Math.pow(coefficient,hands[i]-1)))+1)/Math.log(coefficient));
      if(maxBuy > 1){
        document.getElementById(name+"Max").innerHTML = prettify(maxBuy)+" "+name.charAt(0).toUpperCase()+name.slice(1)+" Hands";
        document.getElementById(name+"Max").style.background="#111111";
      }else{
        if(maxBuy == 1){
          document.getElementById(name+"Max").innerHTML = prettify(maxBuy)+" "+name.charAt(0).toUpperCase()+name.slice(1)+" Hand";
          document.getElementById(name+"Max").style.background="#111111";
        }else{
          //can't buy nothing
          //document.getElementById(name+"Max").innerHTML = "0";
          document.getElementById(name+"Max").style.background="#ffffff";
        }

      }

    }else{
      document.getElementById(name).style.display = "none";
    }
    //if(hands[i]>0){
      document.getElementById(name+"-show").style.display = "block";
    //}else{
    //  document.getElementById(name+"-show").style.display = "none";
    //}
  }
  document.getElementById("updateTick").innerHTML = prettify(updateTick)+"ms/s";
  document.getElementById("timeTotal").innerHTML = showTimeShort(timeTotal);



  if(prestiges[0] > 0 || prestiges[1] > 1){
    document.getElementById("timeTotalPrestige").innerHTML = showTimeShort(timeTotalPrestige);
  }
  for(var i =0; i < 2;i++){
    if(prestiges[i] > 0 || ((i < 1 && hands[2]>1) || (prestiges[i-1]>0))){
      prestigeCost[i] = Math.floor(prestigeStartCost[i]*Math.pow(prestigeCoefficient,prestiges[i]));
      document.getElementById("prestige"+i).style.display = "table-row";
      document.getElementById("numprestige"+i).innerHTML = prettify(prestiges[i]);
      document.getElementById("prestige"+i+"Cost").innerHTML = showTimeShort(prestigeCost[i]);
      var maxPrestigeBuy = Math.floor(Math.log((time*(prestigeCoefficient-1)/(prestigeStartCost[i]*Math.pow(prestigeCoefficient,prestiges[i])))+1)/Math.log(prestigeCoefficient));
      if(prestiges[i]+maxPrestigeBuy>60){
        maxPrestigeBuy = 60-prestiges[i];
      }
      document.getElementById("prestige"+i+"Max").innerHTML = prettify(maxPrestigeBuy)+" Prestiges";
    }else{
      document.getElementById("prestige"+i).style.display = "none";
    }

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
function showTimeShort(time){
  if(time < 86400){
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
    return s;
  }else{
    var s="";
    day = Math.ceil(time/86400);
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
    return s;
  }
  //more than a single day

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
    prestiges: prestiges[0],
    prestige2s: prestiges[1],
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
    if (typeof savegame.prestiges !== "undefined") prestiges[0] = savegame.prestiges;
    if (typeof savegame.prestige2s !== "undefined") prestiges[1] = savegame.prestige2s;
    if (typeof savegame.tick !== "undefined") tick = savegame.tick;
    setHands();
    updateDisplay();
  }
}
