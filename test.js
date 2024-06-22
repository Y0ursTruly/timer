const timer=require('.')
let p1=0, p2=0, t=performance.now()
timer.interval(_=>p1+=1,1)
setInterval(_=>p2+=1,1)

setTimeout(_=>{
  console.log(
    "out of "+Math.floor(performance.now()-t)+" possible calls",
    {interval_calls:p1,setInterval_calls:p2}
  )
  process.exit(0)
},5e3)