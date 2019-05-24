# Chat Web Application

This application is ready to run.
To deploy to Heroku, you will need an [Heroku account](https://heroku.com/) to host your application.
Once you have an account, stay logged in for the deployment and configuration.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/tigerfarm/tigchat)

When you deploy to Heroku, you will be prompted for an app name. 
The name needs to be unique. Example, enter your name+app (example: davidapp). 
Click Deploy app. Once the application is deployed, click Manage app. 
Now, set the Heroku project environment variables by clicking Settings. 
Click Reveal Config Vars.

Add the following key value pairs:
- ACCOUNT_SID : your Twilio account SID (starts with "AC", available from Twilio Console)
- CHAT_SERVICE_SID : your Chat service SID
- CHAT_API_KEY : your Chat API key
- CHAT_API_KEY_SECRET : your Chat API key secret
Key value pairs not required or used at this time:
- AUTH_TOKEN : your Twilio account auth token (Available from Twilio Console, click view)
- TOKEN_PASSWORD : your token password (Password is required to create tokens. The password can be any string you want to use.)

Chat Client Application screen print:

<img src="ChatClient.jpg" width="400"/>

### Requirements:

- Twilio account. A free Trial account will work.
- To run locally on your computer using the include web server, install Node.JS and the Twilio Node.JS helper library.

## Files

- [index.html](index.html) : Chat client HTML
- [chat.css](chat.css) : Chat client styles, CSS
- [chat.js](chat.js) : Chat client JavaScript
- [chatserver.js](chatserver.js) : a NodeJS Express HTTP Server that serves the Chat client files.
- [chatcli.js](chatcli.js) : a standalone NodeJS command line chat program.
- [httpcli.js](httpcli.js) : a standalone command line program for making HTTP GET requests.
- [app.json](app.json) : Heroku deployment file to describe the application.
- [package.json](package.json) : Heroku deployment file which sets the programming language used.

## Twilio Console Configuration

These are the steps to configure to use the Chat Web Application.
No development or credit card information required to try Chat.

1. Create a Chat Service:

[https://www.twilio.com/console/chat/dashboard](https://www.twilio.com/console/chat/dashboard)

2. Create an API key and secret string:

[https://www.twilio.com/console/chat/runtime/api-keys](https://www.twilio.com/console/chat/runtime/api-keys)

## For Developers

Following are the steps to run the Chat Web Application on your localhost computer.

Download this repository's zip into a working directory and unzip it.
Create an environment variable that is your Twilio Function Runtime Domain.
Example:
````
$ export ACCOUNT_SID ACxxx...xxx
$ export CHAT_SERVICE_SID ISxxx...xxx
$ export CHAT_API_KEY SKxxx...xxx
$ export CHAT_API_KEY_SECRET xxx...xxx
````
Run the Node.JS server program, install the required packages, then run the chat server or command line program.
````
$ npm install twilio
$ npm install twilio-chat
$ npm install express

$ node chatserver.js

$ node chatcli.js
````
### Test
````
Use your browser to run the chat client:
http://localhost:8000
Enter a username, example: stacy.
Enter a Channel name and description, example: "mychannel" and "My test channel".

In another browser tab, run another chat client using a , same channel name:
http://localhost:8000
Enter a username, example: david (different username).
Enter a Channel name, example: mychannel (same as the other client).

Send messages between your clients.
````
## SMS Twilio Chat Gateway

I’ve done some more work on my SMS Chat gateway. I do see the issue you asked me about, which is,

How is a person using SMS, to interact with a Twilio Chatter?

````
A Twilio phone number is used as Chat channel name.
Chat users join the channel using a text string identity such as, "david".
SMS users join the channel using their mobile phone number as their Chat identity.
A Chat user sends a message to the Twilio phone number Chat channel.
   The Chat users receive the message as normal.
   The SMS user receives the chat message as an SMS message,
      with the message prefixed with Chat identity of sender.
Example,
a person with identity, david, would send a chat message, "Hello to all."
The SMS person would receive the following text: "david: Hello to all."
The SMS person sends a text to the Twilio phone number.
The message is relayed as Chat message on the Chat channel, from the Identity as the person's mobile phone number.
````
An alternative is to have 1 to 1 interactions between an person using SMS and a person using Chat.
The person using Chat, would use the Twilio phone number as their Chat identity and join a channel named as the Twilio phone number.
Only the two can chat.

Cheers...
