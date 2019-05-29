// -----------------------------------------------------------------------------
console.log("+++ Start.");

var request = require('request');

// -----------------------------------------------------------------------------
function doHelp() {
    sayMessage("------------------------------------------------------------------------------");
    sayMessage("Commands:\n");
    syntaxHttp();
    sayMessage("");
    syntaxSet();
    sayBar();
    sayMessage("> show : Show settings.\n\
> clear : clear the console window.\n\
> help\n\
> exit");
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
    sayMessage("+ Twilio test host: https://api.twilio.com:8443/");
    sayMessage("+ Other hosts: http://localhost:8000/ http://tigerfarmpress.com");
    sayMessage("> set <debug> <on|off>");
}
function doSet(theCommand) {
    if (parseAttributeValue("set", theCommand) === 1) {
        if (attribute === "host") {
            if (!value.endsWith('/')) {
                value = value + '/';
            }
            if (value.startsWith('http')) {
                httpHost = value;
            } else {
                httpDefault = 'https://';
                httpHost = httpDefault + value;
                sayMessage("+ Using HTTPS as default: " + httpHost);
            }
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
    sayMessage("+ Send an HTTP/HTTPS request to the currently set host name.");
    sayMessage("> http <uri> : Assume HTTP GET.");
    sayMessage("> http get <uri>");
    // sayMessage("> http [<get|post>] <uri>");
}
function doHttp(theCommand) {
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
    } else if (attribute === "post") {
        httpPost(value);
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

var httpHost = "http://localhost:8000/";    // default.
function httpGet(theUri) {
    if (theUri !== "") {
        if (theUri.startsWith('/')) {
            theUrl = httpHost + theUri.substring(1);
        } else {
            theUrl = httpHost + theUri;
        }
    }
    requestGet(theUri, theUrl);
}

function requestGet(theUri, theUrl) {
    debugMessage("theUrl :" + theUrl + ":");
//    request(theUrl, "secureProtocol: 'SSLv3_method'", function (error, response, theResponse) {
    request(theUrl, function (error, response, theResponse) {
        if (error) {
            // Print the error if one occurred
            sayMessage('- Error connecting.');
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
            sayMessage('- Status code: ' + response.statusCode + errorMessage + ' ' + theUrl);
            doPrompt();
            return;
        }
        sayBar();
        sayMessage('+ Response code: ' + response.statusCode + ', URL: ' + theUrl);
        sayMessage(response.headers);
        sayMessage('');
        if (theUri !== "show") {
            sayMessage(theResponse);
        } else {
            sayMessage(theResponse.replace(/<br>/g, '\n'));
        }
        sayBar();
        doPrompt();
    });
}

function httpPost(theUri) {
    if (theUri !== "") {
        if (theUri.startsWith('/')) {
            theUrl = httpHost + theUri.substring(1);
        } else {
            theUrl = httpHost + theUri;
        }
    }
    requestPost(theUri, theUrl);
}
function requestPost(theUri, theUrl) {
    // Future.
    // 
    // set host http://localhost:8000/
    // http post registration
    // 
    // set host https://tigauthy.herokuapp.com/
    // http post /registration
    // 
    // set host http://tigerfarmpress.com/cgi/
    // http echo.php?hello=there
    // set host http://tigerfarmpress.com/cgi/echo.php
    // https://api.authy.com
    // 
    // set host https://api.authy.com/protected/json/sdk/
    // http post registrations
    //
    sayMessage("+ POST theUrl :" + theUrl + ":");
    sayMessage("+ api_key :" + process.env.AUTHY_API_KEY_TF + ":");
    sayMessage("+ authy_id :" + process.env.AUTHY_ID + ":");
    let options = {
        url: theUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            api_key: process.env.AUTHY_API_KEY_TF,
            authy_id: process.env.AUTHY_ID
        }
    };
    request.post(options, function (error, response, theResponse) {
        if (error) {
            // Print the error if one occurred
            sayMessage('- Error connecting.');
            doPrompt();
            return;
        }
        if (!response.statusCode.toString().startsWith('2')) {
            var errorMessage = '';
            if (response.statusCode.toString().startsWith('1')) {
                errorMessage = ": Informational.";
            } else if (response.statusCode === 307) {
                errorMessage = ": Temporary Redirect.";
            } else if (response.toString().startsWith('3')) {
                errorMessage = ": Redirect.";
            } else if (response.statusCode === 400) {
                errorMessage = ": Bad request.";
            } else if (response.statusCode === 401) {
                errorMessage = ": Unauthorized.";
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
        } else {
            sayBar();
            sayMessage('+ Response code: ' + response.statusCode + ', URL: ' + theUrl);
        }
        sayMessage(response.headers);
        sayMessage('');
        if (theUri !== "show") {
            sayMessage(theResponse);
        } else {
            sayMessage(theResponse.replace(/<br>/g, '\n'));
        }
        sayBar();
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