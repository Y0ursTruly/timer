(function(channelNameSize,isThread){
  const WINDOW=typeof window!=="undefined"? window: typeof self!=="undefined"?self: false;
  const crypto=WINDOW? WINDOW.crypto: require('node:crypto');
  const Worker=WINDOW? WINDOW.Worker: (require('node:worker_threads')).Worker;
  if(WINDOW) Worker.prototype.on=Worker.prototype.addEventListener;
  const parent=WINDOW || (require('node:worker_threads')).parentPort;
  if(WINDOW) parent.on=parent.addEventListener;
  const mainFN=arguments.callee
  function makethread(){
    if(isThread) return null;
    let script=`(${mainFN.toString()})(16,true)`
    if(!WINDOW) return new Worker(script,{eval:true});
    let worker_url=URL.createObjectURL(new Blob([script],{type:'text/javascript'}))
    let worker=new Worker(worker_url)
    URL.revokeObjectURL(worker_url)
    return worker;
  }
  class Queue{ //only used in parent, never the thread
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
  const thread=makethread()
  function parentListener(event){ //set on thread, listens to input FROM the parent
    const [id,timer]=event.data;
    console.log({id,timer})
    if(!timer) return (delete timers[id],timers.count--);
    timer.start=performance.now()-(Date.now()-timer.start); //transition to worker's performance.now()
    if(id>=timers.length) timers.length++;
    timers.count++;
    timers[id]=timer;
    console.log(timers)
  }
  function threadListener(event){ //set on parent, listens to input FROM the thread
    const id=event.data, timer=timers[id];
    if(!timer) return null;
    if(!timer.repeat){
      delete timers[id];
      timers.queue.add(id);
      timers.count--;
    }
    timer.userFN();
  }
  if(isThread) parent.on('message',parentListener);
  else thread.on('message',threadListener);


  const mapping=[], typedarray=new Uint8Array(channelNameSize);
  for(let i=0;i<256;i++) mapping[i]=String.fromCharCode(i);
  function randomChannel(input){ //only used on parent, never on thread
    if(input){
      const copy={...input}, num=timers.queue.empty()? timers.length++: timers.queue.pop();
      return (timers[num]=input),timers.count++,(delete copy.userFN),thread.postMessage([num,copy]),num;
    }
    //below is support in same function but for cryptographically secure random channel name
    var arr=crypto.getRandomValues(typedarray), str="";
    for(let i=0;i<arr.length;i++) str+=mapping[arr[i]];
    return str;
  }


  //timer engine begin (only on thread, never on parent)
  let channel=randomChannel(), sender=null, receiver=null;
  function listener(){ //listener is only ever set in the worker thread
    //console.log('ever?')
    //if(!timers.count) return deactivate();
    //console.log('ever?')
    sender.postMessage(null); //repeat the channel messaging IF TIMER(S) EXIST
    //the idea here is something that must be waited on but doesn't resolve quickly enough to hang the process
    const now=performance.now() //noticable performance difference when checking time outside loop
    for(let i=0;i<timers.length;i++){
      if(!timers[i]) continue;
      const timer=timers[i];
      if(now-timer.start >= timer.ms){
        parent.postMessage(i);
        if(!timer.repeat) (delete timers[i],timers.count--);
        else timer.start=now;
      }
    }
  }
  let active=false;
  function activate(){
    if(active) return null;
    active=true;
    if(!isThread) return null;
    sender=new BroadcastChannel(channel);
    receiver=new BroadcastChannel(channel);
    receiver.addEventListener('message',listener);
    sender.postMessage(null);
  }
  function deactivate(){
    if(!active) return null;
    receiver.removeEventListener('message',listener);
    receiver.close();
    sender.close();
  }
  if(isThread) activate();
  //timer engine end (only on thread, never on parent)


  function timeout(userFN,ms){
    activate();
    return randomChannel({userFN,ms,repeat:false,start:Date.now()});
  }
  function interval(userFN,ms){
    activate();
    return randomChannel({userFN,ms,repeat:true,start:Date.now()});
  }
  async function wait(ms){
    let resolver=null, promise=new Promise(resolve=>resolver=resolve);
    timeout(resolver,ms);
    return await promise;
  }
  function clear(ID){
    if(typeof ID!=="number" || !timers[ID]) return false;
    delete timers[ID];
    timers.queue.add(ID);
    timers.count--;
    thread.postMessage([ID]);
    return true;
  }


  //exports
  const timer={timeout,interval,wait,clear};
  if(WINDOW) WINDOW.timer=timer; //browser
  else module.exports=timer; //nodejs
})(16)
