//"timer" becomes a global variable which is an object with the functions timeout,interval,wait
//timeout is replacement of setTimeout, interval is replacement of setInterval, wait is replacement of sleep
//do note that timeout only takes the first 2 arguments of setTimeout, same with interval in relation to setInterval, and well sleep is sleep
(function(channelNameSize){
  const mapping=[], typedarray=new Uint8Array(channelNameSize), map=new Map();
  for(let i=0;i<256;i++) mapping[i]=String.fromCharCode(i);
  function randomChannel(input=true){
    do{
      var arr=crypto.getRandomValues(typedarray), str="";
      for(let i=0;i<arr.length;i++) str+=mapping[arr[i]];
    }while(map.has(str));
    map.set(str,input);
    return str;
  }
  const channel=randomChannel(), sender=new BroadcastChannel(channel), receiver=new BroadcastChannel(channel);
  map.delete(channel); //it isn't needed to be unique towards other map entries
  receiver.addEventListener('message',function(){
    map.forEach(function(timer,ID){
      if(performance.now()-timer.start >= timer.ms) entry.userFN();
      if(!entry.repeat) map.remove(ID);
    })
  })
  function timeout(userFN,ms){
    return randomChannel({userFN,ms,repeat:false,start:performance.now()});
  }
  window.timer={timeout} //other functions added soon
})(16)
