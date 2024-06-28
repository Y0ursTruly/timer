//worst case is that timeouts from this timer are ~1ms slower than the current timer.js, no scaling just constant 1ms faster however it seems to take less "space" on the JavaScript Event Loop
//look at the difference when this was used as the timer.js: https://github.com/Y0ursTruly/timer/blob/de690997b914a6ccb7cfc612a75c89ed843ecd70/image.png
//compared to the current timer.js: https://github.com/Y0ursTruly/timer/blob/bc35b4230943b66b60cdd719869852b7c3d2d377/image.png
(function(channelNameSize){
  const crypto=typeof window==="undefined"?require('node:crypto'):window.crypto;
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

  //timer engine begin
  let channel=randomChannel(), sender=null, receiver=null, curr=Math.floor(performance.now());
  map.delete(channel); //it isn't needed to be unique towards other map entries
  function manageTimer(timer,ID){
    //manages each timer in the map of timers
    if(curr-timer.start >= timer.ms){
      timer.userFN();
      if(!timer.repeat) map.delete(ID);
      else timer.start=curr;
    }
  }
  function listener(){
    if(!map.size) return deactivate();
    sender.postMessage(null); //repeat the channel messaging IF TIMER(S) EXIST
    //the idea here is something that must be waited on but doesn't resolve quickly enough to hang the process
    const now=performance.now();
    if(now-curr<1) return null;
    curr=Math.floor(now);
    map.forEach(manageTimer);
  }
  let active=false;
  function activate(){
    if(active) return null;
    sender=new BroadcastChannel(channel);
    receiver=new BroadcastChannel(channel);
    receiver.addEventListener('message',listener);
    sender.postMessage(null);
    active=true;
  }
  function deactivate(){
    if(!active) return null;
    receiver.removeEventListener('message',listener);
    receiver.close();
    sender.close();
    active=false;
  }
  //timer engine end
  
  function timeout(userFN,ms){
    activate();
    return randomChannel({userFN,ms,repeat:false,start:performance.now()});
  }
  function interval(userFN,ms){
    activate();
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
