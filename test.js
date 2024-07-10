const test=require('node:test'), assert=require('node:assert'), timer=require('.');

(async function(){
  await test("1) Interval Skill Gap",async function(){
    let resolve=null, p=new Promise(r=>resolve=r)
    let p1=0, p2=0, t=performance.now()
    let t1=timer.interval(_=>p1+=1.5,1.5)
    let t2=setInterval(_=>p2+=1,1)
    setTimeout(_=>{
      assert.ok(p1>p2)
      timer.clear(t1)
      clearInterval(t2)
      console.log("Higher is Better")
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
      t1[i]=timer.interval(_=>p1+=1.01,1.01);
      t2[i]=setInterval(_=>p2+=1,1);
    }
    setTimeout(_=>{
      assert.ok(p1>p2)
      for(let i=0;i<t1.length;i++){
        timer.clear(t1[i])
        clearInterval(t2[i])
      }
      console.log("Higher is Better")
      console.log(
        "out of "+Math.floor((performance.now()-t)*t1.length)+" possible calls",
        {interval_calls:p1,setInterval_calls:p2}
      )
      resolve()
    },5e3)
    return await p
  })
  await test("3) Timeout is Unrivaled",async function(){
    return await new Promise(async function(resolve){
      let t=performance.now(), timeout_wait_time=null, setTimeout_wait_time
      await timer.wait(2e3) //wraps a promise over timeout
      timeout_wait_time=performance.now()-t
      t=performance.now()
      await new Promise(r=>setTimeout(r,2e3)) //promise wrapped over setTimeout
      setTimeout_wait_time=performance.now()-t
      assert.ok(timeout_wait_time<setTimeout_wait_time)
      console.log("Lower is Better")
      console.log({timeout_wait_time,setTimeout_wait_time})
      resolve()
    })
  })
  process.exit(0) //needed to kill the test process for now since timer now spawns worker thread
})()
