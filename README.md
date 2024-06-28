# Timer (for JavaScript)
Custom and more accurate setInterval and setTimeout functionality that is not nerfed for things like when the browser tab is not in focus

# Features
- Roughly 99% accurate _real time_ intervals in JavaScript
- More precision than a whole millisecond; fractional values supported
- Alternate version with only whole millisecond precision but with a smaller footprint on the JavaScript Event Loop

# Installation
Install via:
```
npm install @y0urstruly/timer
```


# Usage
## JavaScript
- Main Timer Library
```
const {timeout,interval,wait,clear} = require('@y0urstruly/timer');
```
- Alternate Timer Library
```
const {timeout,interval,wait,clear} = require('@y0urstruly/timer/docile');
```

## TypeScript
- Main Timer Library
```
import {timeout,interval,wait,clear} = from '@y0urstruly/timer';
```
- Alternate Timer Library
```
import {timeout,interval,wait,clear} = from '@y0urstruly/timer/docile';
```


# Modules
- `interval(userFN:()=>void, ms:number): number`: better setInterval, first argument is function, second argument is ms, returns _ID_
- `timeout(userFN:()=>void, ms:number): number`: better setTimeout, first argument is function, second argument is ms, returns _ID_
- `wait(ms:number): Promise<void>`: all you python **sleep** using kids, your functionality offered by a promise wrapped around **timeout** (tldr; _await wait(ms)_)
- `clear(ID:number): boolean`: removes any **interval** or **timeout** by _ID_. For example _clear(timeout(someFN))_ is a waste of code since _someFN_ will never run

# Disclaimers
- It is more precise in nodejs (>300 events per ms ~~at least on a github codespace~~)
- It is less precise in a browser (~10 events per ms ~~at least on a chrome tab~~)
- The 2 points above were determined by comparing a 0ms interval to a 1ms interval and the ratio of their calls
- Of course, sub ms timers might lose precision since functions take time to execute (tested on codespace for 0.2ms and got 98% precision instead) so it is recommended to have fractional timer values _greater than_ 1
- The smaller the fractional part, the less accurate (`1.1 would be more accurate than 2.01`)

# Comparison to Native Modules
- This section will always be dedicated to displaying the test results of the current commit
![https://i.sstatic.net/gwZgawnI.png](image.png)