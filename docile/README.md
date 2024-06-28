# Timer (for JavaScript)
Custom and more accurate setInterval and setTimeout functionality that is not nerfed for things like when the browser tab is not in focus

# Features
- Roughly 99% accurate _real time_ intervals in JavaScript
- Smaller footprint to the JavaScript Event Loop than main `timer.js`

# Installation and Usage
- Install via <br>```npm install @y0urstruly/timer```
- Use main timer library via <br>```require('@y0urstruly/timer')```
- Use alternate timer library via <br>```require('@y0urstruly/timer/docile')```

# Modules
- `interval`: better setInterval, first argument is function, second argument is ms, returns _ID_
- `timeout`: better setTimeout, first argument is function, second argument is ms, returns _ID_
- `wait`: all you python `sleep` using kids, your functionality offered by a promise wrapped around `timeout` (tldr; `await wait(ms)`)
- `clear`: removes any `interval` or `timeout` by _ID_ (eg `clear(timeout(someFN))` is a waste of code since `someFN` will never run)

# Disclaimers
- The smallest unit of accuracy is only a whole millisecond (LESS ACCURATE THAN MAIN `timer.js`)
- Since this only checks every 1 ms, the worst case error is 0.999... ms

# Comparison to Native Modules
- This section will always be dedicated to displaying the test results of the current commit
![test image](image.png)