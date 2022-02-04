# Rajikaru Bot

![Rajikaru-Banner No Square](https://user-images.githubusercontent.com/66682497/151678869-494ec38e-5626-4a55-8cfa-e483bfe4d455.png)

Rajikaru is an Open-Source General Purpose Discord Bot.
This bot is still in active development and will not be finished anytime soon.
I'm making great progress and have switched from python to javascript to make my life easier when making such a big bot.

## Installation Instructions:
1. Download node.js from your package manager on linux/mac or through their website on windows
https://nodejs.org/en/

2. Run this commands in your terminal or cmd (Remember to open your terminal/cmd IN the bot folder)
```
$ npm i
```

3. Change the name of `config.def.json` to `config.json` and change the required fields.

The required ones are token, clientId and User ID. You can get your user id by enabling developer mode on discord, right clicking yourself and clicking:

![image](https://user-images.githubusercontent.com/66682497/151679095-fc0025b5-ebc8-4ed3-ba46-f535cf2ac85b.png)

You can get the token by making an application in the "discord developer portal" and then making a bot in that application also remember to copy the clientID/ApplicationID while you're there.

![Untitled](https://user-images.githubusercontent.com/66682497/151679192-60aa190d-a3b0-444b-81c4-1dea7a805229.png)

```json
{
    "token": "put your token here",
    "clientId": "Application ID here",
    "uid": "User ID Here",
}
```

After doing these things you're basically good to go! Just run the bot by doing `node .` inside the bot folder. Good luck!

## Commands:
```
Base:
  pull       Pulls the latest version from github.
  restart    Restarts the bot.
Utility:
  avatar     Replies with the user's avatar
  nick       Give a nickname to the mentioned user.
  role       Adds role to the pinged user.
  serverinfo Shows server information. (TBS)
  userinfo   Shows member information. (TBS)
  ping       Replies with Pong!
  say        Says the message you tell it to say.
Moderation:
  ban        Bans the pinged member.
  kick       Kicks the pinged member.
  mute       Mutes the pinged member. (TBS)
  purge      Removes messages.
Fun:
  cuddle     Cuddles the pinged member.
  hug        Hugs the pinged member.
  pat        Pats the pinged member.
  slap       Slaps the pinged member.
  coinflip   Replies with Heads or Tails.
  neko       Sends a random catperson image.
  owoify     Owoifies your text.
  gayrate    How gay is the pinged person (Random)
```

## Invite the Bot!
https://discord.com/api/oauth2/authorize?client_id=900694117355487283&permissions=1377073080902&scope=bot%20applications.commands

Expect downtime and unexpected outcomes because of the bot not being finished.
