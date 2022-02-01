# Rajikaru Bot

![Rajikaru-Banner No Square](https://user-images.githubusercontent.com/66682497/151678869-494ec38e-5626-4a55-8cfa-e483bfe4d455.png)

This is my first discord bot!
I have worked for several months on this and im quite proud of it, I know its not much but its mine and I've worked hard on it!

## Installation Instructions:
1. Download node.js from your package manager on linux/mac or through their website on windows
https://nodejs.org/en/

2. Run this commands in your terminal or cmd (Remember to open your terminal/cmd IN the bot folder)
```
$ npm i
```

3. Change the required lines in the config.json
The required ones are token and User ID. You can get your user id by enabling developer mode on discord, right clicking yourself and clicking

![image](https://user-images.githubusercontent.com/66682497/151679095-fc0025b5-ebc8-4ed3-ba46-f535cf2ac85b.png)

And you can get the token by making an application in the "discord developer portal" and then making a bot in that application also remember to copy the clientID/ApplicationID while you're there.

![Untitled](https://user-images.githubusercontent.com/66682497/151679192-60aa190d-a3b0-444b-81c4-1dea7a805229.png)

```json
{
    "token": "put your token here",
    "clientId": "Application ID here"
    "uid": "User ID Here"
}
```

After doing these things you're basically good to go! Just run the bot by doing `node .` inside the bot folder. Good luck!

## Commands:
```
  pull       Pulls the latest version from github.
  avatar     Replies with the user's avatar
  ping       Replies with Pong!
```
