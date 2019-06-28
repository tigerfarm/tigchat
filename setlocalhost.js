//
//  Sample: test links.
// 
// http://localhost:8000/set?user=relay
// http://localhost:8000/generate
// http://localhost:8000/join?channel=relay
// http://localhost:8000/show
// http://localhost:8000/set?debug=on
// http://localhost:8000/send?message=hello from Chat bot.
// 
// http://localhost:8000/http.get/hello.xml
//
console.log('-------------------------------------------------');
console.log('+++ Setup Gateway Chat User.');
//
var httpHost = "http://localhost:8000/";
var userIdentity = "relay";
var theChannel = "relay";
//
if (process.argv[2]) {
    userIdentity = process.argv[2];
}
if (process.argv[3]) {
    theChannel = process.argv[3];
}
if (process.argv[4]) {
    theChannel = process.argv[4];
}
console.log('+ Set httpHost:', httpHost);
console.log('+ Set userIdentity:', userIdentity);
console.log('+ Set theChannel:', theChannel);
//
var request = require('request');
function generate() {
    request(httpHost + 'generate?channel=' + theChannel + 'set?user=' + userIdentity, function (error, response, theResponse) {
        console.log('+ generate: ');
        if (error) {
            console.log('error:', error);
            return;
        }
        if (response && response.statusCode !== 200) {
            console.log('- Status code:', response && response.statusCode);
            return;
        }
        console.log('++ theResponse: ', theResponse);
    });
}

// eof