(function(channelNameSize){

  class Queue{
    //each node is in form [data,next]
    top=null;
    end=null;
    constructor(){}
    add(data){
      const node=[data,null];
      this.top? (this.end[1]=node,this.end=node): (this.top=node,this.end=node);
    }
    pop(){
      if(!this.top) return null;
      const [data,next]=this.top;
      return (this.top=next,data);
    }
    empty(){return !this.top}
  }
  const timers={__proto__:null,length:0,count:0,queue:new Queue()};

  const crypto=typeof window==="undefined"?require('node:crypto'):window.crypto;
  const mapping=[], typedarray=new Uint8Array(channelNameSize);
  for(let i=0;i<256;i++) mapping[i]=String.fromCharCode(i);
  function randomChannel(input){
    if(input){
      const num=timers.queue.empty()? timers.length++: timers.queue.pop();
      return (timers[num]=input),timers.count++,num;
    }
    //below is support in same function but for cryptographically secure random channel name
    var arr=crypto.getRandomValues(typedarray), str="";
    for(let i=0;i<arr.length;i++) str+=mapping[arr[i]];
    return str;
  }

  //timer engine begin
  let channel=randomChannel(), sender=null, receiver=null;
  function listener(){
    if(!timers.count) return deactivate();
    sender.postMessage(null); //repeat the channel messaging IF TIMER(S) EXIST
    //the idea here is something that must be waited on but doesn't resolve quickly enough to hang the process
    for(let i=0;i<timers.length;i++){
      if(!timers[i]) continue;
      const now=performance.now(), timer=timers[i];
      if(now-timer.start >= timer.ms){
        timer.userFN();
        if(!timer.repeat){
          delete timers[i];
          timers.queue.add(i);
          timers.count--;
        }
        else timer.start=now;
      }
    }
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
  function clear(ID){
    if(!timers[ID]) return false;
    delete timers[ID];
    timers.queue.add(ID);
    timers.count--;
    return true;
  }


  //exports
  const timer={timeout,interval,wait,clear};
  if(typeof window!=="undefined") window.timer=timer; //browser
  else module.exports=timer; //nodejs
})(16)
