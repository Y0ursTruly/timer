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
  function manageTimer(timer,ID){
    //manages each timer in the map of timers
    if(Math.round(performance.now()-timer.start) >= timer.ms){
      timer.userFN();
      if(!timer.repeat) map.delete(ID);
    }
  }
  
  //timer engine begin
  receiver.addEventListener('message',function(){
    sender.postMessage(null); //repeat the channel messaging
    //the idea here is something that must be waited on but doesn't resolve quickly enough to hang the process
    map.forEach(manageTimer);
  });
  sender.postMessage(null); //start the channel messaging
  //timer engine end
  
  function timeout(userFN,ms){
    return randomChannel({userFN,ms,repeat:false,start:performance.now()});
  }
  function interval(userFN,ms){
    return randomChannel({userFN,ms,repeat:true,start:performance.now()});
  }
  async function wait(ms){
    let resolver=null, promise=new Promise(resolve=>resolver=resolve);
    timeout(resolver,ms);
    return await promise;
  }
  function clear(ID){return map.delete(ID)}

  
  //exports
  const timer={timeout,interval,wait,clear};
  if(typeof window!=="undefined") window.timer=timer; //browser
  else module.exports=timer; //nodejs
})(16)
