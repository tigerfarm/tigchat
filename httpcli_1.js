// -----------------------------------------------------------------------------
console.log("+++ Start.");

var request = require('request');

// -----------------------------------------------------------------------------
function doHelp() {
    sayMessage("------------------------------------------------------------------------------\n\
Commands:\n\
\n\
> show : Show settings.\n\
> clear : clear the console window.\n\
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
    sayMessage("> set <host> <name>");
    sayMessage("> set <debug> <on|off>");
}
function doSet(theCommand) {
    if (parseAttributeValue("set", theCommand) === 1) {
        if (attribute === "host") {
            httpHost = value;
        } else if (attribute === "debug") {
            setDebug(value);
        } else {
            syntaxHttp();
            return;
        }
    } else {
        syntaxSet();
    }
}

function syntaxHttp() {
    sayMessage("+ Send an HTTP request to the currently set host name.");
    sayMessage("> http <uri> : Assume HTTP GET.");
    sayMessage("> http get <uri>");
    // sayMessage("> http [<get|post>] <uri>");
}
function syntaxHttps() {
    sayMessage("+ Send an HTTPS request to the currently set host name.");
    sayMessage("> https <uri> : Assume HTTPS GET.");
    sayMessage("> https <get <uri>");
}
function doHttp(theCommand) {
    if (theCommand.startsWith('https')) {
        doHttps(theCommand);
        return;
    }
    if (parseAttributeValue("http", theCommand) === 1) {
        sayMessage("+ http :" + attribute + ": value :" + value + ":");
    } else {
        if (parseValue("http", theCommand) === 1) {
            debugMessage("http value :" + value + ":");
            attribute = "get";
        } else {
            syntaxHttp();
            doPrompt();
            return;
        }
    }
    if (attribute === "get") {
        httpGet(value);
        return;
    }
    sayMessage("+ Not implemented: " + attribute);
    doPrompt();
}
function doHttps(theCommand) {
    if (parseAttributeValue("https", theCommand) === 1) {
        sayMessage("+ https :" + attribute + ": value :" + value + ":");
    } else {
        if (parseValue("https", theCommand) === 1) {
            debugMessage("https value :" + value + ":");
            attribute = "get";
        } else {
            syntaxHttps();
            doPrompt();
            return;
        }
    }
    if (attribute === "get") {
        httpsGet(value);
        return;
    }
    sayMessage("+ Not implemented: " + attribute);
    doPrompt();
}

// -----------------------------------------------------------------------------
function doShow() {
    sayBar();
    sayMessage("+ HTTP host name: " + httpHost);
    if (debugState === 0) {
        sayMessage("++ Debug: off");
    } else {
        sayMessage("++ Debug: on");
    }
    sayBar();
}

function clearScreen() {
    process.stdout.write('\x1Bc');
    sayMessage('+ Running HTTP cli.');
    doPrompt();
}

// -----------------------------------------------------------------------------
function requestGet(theUri, theUrl) {
    debugMessage("theUrl :" + theUrl + ":");
    request(theUrl, function (error, response, theResponse) {
        if (error) {
            // Print the error if one occurred
            sayMessage('error:', error.);
            doPrompt();
            return;
        }
        if (!response.statusCode.toString().startsWith('2')) {
            var errorMessage = '';
            if (response.statusCode.toString().startsWith('1')) {
                errorMessage = ": Informational.";
            } else if (response.toString().startsWith('3')) {
                errorMessage = ": Redirectory.";
            } else if (response.statusCode === 400) {
                errorMessage = ": Bad request.";
            } else if (response.statusCode === 403) {
                errorMessage = ": Forbidden.";
            } else if (response.statusCode === 404) {
                errorMessage = ": Not found.";
            } else if (response.toString().startsWith('4')) {
                errorMessage = ": Client error.";
            } else if (response.toString().startsWith('5')) {
                errorMessage = ": Server Error.";
            }
            sayMessage('- Status code: ' + response.statusCode + errorMessage);
            doPrompt();
            return;
        }
        if (theUri !== "show") {
            sayMessage('+ Response code: ' + response.statusCode + '\n' + theResponse);
        } else {
            sayMessage(theResponse.replace(/<br>/g, '\n'));
        }
        doPrompt();
    });
}

var httpHost = "localhost:8000";    // default.
function httpGet(theUri) {
    theUrl = "http://" + httpHost;
    if (theUri !== "") {
        theUrl = theUrl + "/" + theUri;
    }
    requestGet(theUri, theUrl);
}
function httpsGet(theUri) {
    theUrl = "https://" + httpHost;
    if (theUri !== "") {
        theUrl = theUrl + "/" + theUri;
    }
    requestGet(theUri, theUrl);
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
        doPrompt();
    } else if (theCommand.startsWith('http')) {
        doHttp(theCommand);
    } else if (theCommand.startsWith('set')) {
        doSet(theCommand);
        doPrompt();
    } else if (theCommand === 'help') {
        doHelp();
        doPrompt();
    } else if (theCommand === 'clear') {
        clearScreen();
    } else if (theCommand === 'exit') {
        sayMessage("+ Exit.");
        process.exit();
        // ----------------------------
    } else {
        if (theCommand !== "") {
            sayMessage('- Invaid command: ' + theCommand);
        }
        doPrompt();
    }
});

// eof