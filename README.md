# Timer (for JavaScript)
Custom and more accurate setInterval and setTimeout functionality that is not nerfed for things like when the browser tab is not in focus

# Features
- Roughly 99% accurate _real time_ intervals in JavaScript
- More precision than a whole millisecond; fractional values supported
<br>It is more precise in nodejs (>300 per ms ~~at least on a github codespace~~)
<br>It is less precise in a browser (~10 per ms ~~at least on a chrome tab~~)
<br>Of course, sub ms timers might lose precision since functions take time to execute (~~tested on codespace for 0.2ms and got 98% precision instead~~)

# Comparison to Native Modules
![test image](image.png)