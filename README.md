# About
This is a simple scalable Twitch IRC logger. It utilizes [tmi.js](https://www.npmjs.com/package/tmi.js) to listen to an IRC channel with full configuration in `config.json`, including regex filtering and 

# Installation
`logger.js` requires [Node.js >=10.0.0](https://nodejs.org/en/) and [tmi.js](https://www.npmjs.com/package/tmi.js).

# Configuration
**Example configuration** is as follows.
```
{
    "identity": {},
    "options": {
        "debug": "true"
    },
    "channels": ["channel"],
    "filterRegex": "^[a-zA-Z]{3,7}$",
    "filterFlags": "",
    "prefix": "prefix ",
    "suffix": " suffix"
}
```
`tmi.js` client options can be found [here](https://tmijs.com/#guide-options) and added/edited in the config.json.
Regex expressions can be added by pruning the forward slashes from the start and ending, and adding flags to the filterFlags field. For more reference on use, check the [Javascript RegExp documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp).
```
Normal regex: /^[a-zA-Z]{3,7}$/g
Formatted regex: 
"filterRegex": "^[a-zA-Z]{3,7}$",
"filterFlags": "g",
```

## Techincal Explanation
This script is rather simple. From `config.json` it grabs all listed channels and creates `fs.writeStreams` and IRC connections to each. The files are created in the same directory as `logger.js`.

### Why writeStream instead of a normal fs.writeFile connection?
`fs.writeStream` has the benefit of queueing write operations rather than multiple individual writes. On small streams with low message counts this change wouldn't be noticable, but on streams with +10k viewership it would quickly lag behind.

### Tested limits
The largest workload placed on this script was 4 channels (xcqow, forsen, moonmoon, jerma985). It ran in the background for 2 days, logging 500k messages total. No memory leaks or performance issues were encountered, nor any interference with normal PC operation (including CPU/GPU intensive workloads).

### Issues
If there are any encountered issues, log it on the issues page along with an error message and used configuration.