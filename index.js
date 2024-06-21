//"timer" becomes a global variable which is an object with the functions timeout,interval,wait
//timeout is replacement of setTimeout, interval is replacement of setInterval, wait is replacement of sleep
(function(channelNameSize){
  const mapping=[], typedarray=new Uint8Array(channelNameSize);
  for(let i=0;i<256;i++) mapping[i]=String.fromCharCode(i);
  function randomChannel(){
    let arr=crypto.getRandomValues(typedarray), str="";
    for(let i=0;i<arr.length;i++) str+=mapping[arr[i]];
    return str;
  }
  function timeout(userFN,ms){
    const now=performance.now(), channelName=randomChannel();
    
  }
})(16)
