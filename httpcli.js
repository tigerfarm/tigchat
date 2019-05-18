// -----------------------------------------------------------------------------
console.log("+++ Start.");

var request = require('request');

// -----------------------------------------------------------------------------
function doHelp() {
    sayMessage("------------------------------------------------------------------------------\n\
Commands:\n\
\n\
> show : Show settings.\n\
> help\n\
> exit");
    sayBar();
    syntaxHttp();
    sayMessage("");
    syntaxSet();
    sayBar();
}
function sayBar() {
    sayMessage("-------------------------");
}

// -----------------------------------------------------------------------------
var thePromptPrefix = "+ Command, ";
var thePrompt = "Enter > ";
function doPrompt() {
    // No line feed after the prompt.
    process.stdout.write(thePromptPrefix + thePrompt);
}
function sayMessage(message) {
    console.log(message);
}

let debugState = 0;
function debugMessage(message) {
    if (debugState !== 0) {
        console.log("?- " + message);
    }
}
function setDebug(value) {
    if (value === "on") {
        debugState = 1;
        debugMessage("set debug on.");
    } else {
        debugState = 0;
        debugMessage("set debug off.");
    }
}

// -----------------------------------------------------------------------------
var attribute = "";
var value = "";
function parseAttributeValue(theType, theCommand) {
    commandLength = theCommand.length;
    commandWordLength = theType.length + 1;
    if (commandLength > commandWordLength) {
        attribute = theCommand.substring(commandWordLength, commandLength);
        value = "";
        ew = theCommand.indexOf(" ", commandWordLength + 1);
        if (ew > 1) {
            attribute = theCommand.substring(commandWordLength, ew).trim();
            value = theCommand.substring(ew, commandLength).trim();
            debugMessage("attribute :" + attribute + ": value :" + value + ":");
            return(1);
        }
    }
    return(0);
}
function parseValue(theType, theCommand) {
    commandLength = theCommand.length;
    commandWordLength = theType.length + 1;
    if (commandLength > commandWordLength) {
        value = theCommand.substring(commandWordLength, commandLength);
        return(1);
    }
    return(0);
}

function syntaxSet() {
    sayMessage("> set <debug> <on|off>");
}
function doSet(theCommand) {
    if (parseAttributeValue("set", theCommand) === 1) {
        setDebug(value);
    } else {
        syntaxSet();
    }
}

function syntaxHttp() {
    sayMessage("> http <url> : Assume HTTP GET.");
    sayMessage("> http [<get|post>] <url>");
}
function doHttp(theCommand) {
    if (parseAttributeValue("http", theCommand) === 1) {
        sayMessage("+ http :" + attribute + ": value :" + value + ":");
    } else {
        if (parseValue("http", theCommand) === 1) {
            sayMessage("+ http value :" + value + ":");
            attribute = "get";
        } else {
            syntaxHttp();
            return;
        }
    }
    if (attribute === "get") {
        httpGet(value);
    } else {
        sayMessage("+ Note implemented: " + attribute);
    }
}

// -----------------------------------------------------------------------------
function doShow() {
    sayBar();
    if (debugState === 0) {
        sayMessage("++ Debug: off");
    } else {
        sayMessage("++ Debug: on");
    }
    sayBar();
}

// -----------------------------------------------------------------------------
var httpHost = "localhost:8000";
function httpGet(theUri) {
    theUrl = "http://" + httpHost;
    if (theUri !== "") {
        theUrl = theUrl + "/" + theUri;
    }
    debugMessage("theUrl :" + theUrl + ":");
    request(theUrl, function (error, response, theResponse) {
        if (error) {
            // Print the error if one occurred
            sayMessage('error:', error);
            return;
        }
        if (response && response.statusCode !== 200) {
            sayMessage('- Status code:', response && response.statusCode);
            return;
        }
        if (theUri !== "show") {
            sayMessage(theResponse);
        } else {
            sayMessage(theResponse.replace(/<br>/g, '\n'));
        }
        doPrompt();
    });
}

// -----------------------------------------------------------------------------
doPrompt();
var standard_input = process.stdin;
standard_input.setEncoding('utf-8');
standard_input.on('data', function (inputString) {
    theCommand = inputString.substring(0, inputString.length - 1).trim();
    debugMessage('Echo: ' + theCommand + ":");
    // ----------------------------
    if (theCommand === 'show') {
        doShow();
    } else if (theCommand.startsWith('http')) {
        doHttp(theCommand);
    } else if (theCommand.startsWith('set')) {
        doSet(theCommand);
    } else if (theCommand === 'help') {
        doHelp();
    } else if (theCommand === 'exit') {
        sayMessage("+ Exit.");
        process.exit();
        // ----------------------------
    } else {
        if (theCommand !== "") {
            sayMessage('- Invaid command: ' + theCommand);
        }
    }
    doPrompt();
});

// eof