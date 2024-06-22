const test=require('node:test'), assert=require('node:assert'), timer=require('.');

(async function(){
  await test("1) Interval Skill Gap",async function(){
    let resolve=null, p=new Promise(r=>resolve=r)
    let p1=0, p2=0, t=performance.now()
    let t1=timer.interval(_=>p1+=1,1)
    let t2=setInterval(_=>p2+=1,1)
    setTimeout(_=>{
      assert.ok(p1>p2)
      timer.clear(t1)
      clearInterval(t2)
      console.log(
        "out of "+Math.floor(performance.now()-t)+" possible calls",
        {interval_calls:p1,setInterval_calls:p2}
      )
      resolve()
    },5e3)
    return await p
  })
  await test("2) Several Intervals Skill Gap",async function(){
    let resolve=null, p=new Promise(r=>resolve=r)
    let p1=0, p2=0, t=performance.now()
    let t1=Array(100), t2=Array(100);
    for(let i=0;i<t1.length;i++){
      t1[i]=timer.interval(_=>p1+=1,1);
      t2[i]=setInterval(_=>p2+=1,1);
    }
    setTimeout(_=>{
      assert.ok(p1>p2)
      for(let i=0;i>t1.length;i++){
        timer.clear(t1[i])
        clearInterval(t2[i])
      }
      console.log(
        "out of "+Math.floor((performance.now()-t)*t1.length)+" possible calls",
        {interval_calls:p1,setInterval_calls:p2}
      )
      resolve()
    },5e3)
    return await p
  })
  timer.wait(10).then(_=>process.exit(0))
})()
