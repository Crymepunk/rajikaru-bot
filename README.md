# Rajikaru Bot

![Rajikaru-Banner No Square](https://user-images.githubusercontent.com/66682497/151678869-494ec38e-5626-4a55-8cfa-e483bfe4d455.png)

This is my first discord bot!
I have worked for several months on this and im quite proud of it, I know its not much but its mine and I've worked hard on it!

## Installation Instructions:
1. Download python3 and pip through your package manager of choice on linux or download it through their official site on Windows 
https://www.python.org/

2. Run this commands in your terminal or cmd (Remember to open your terminal/cmd IN the bot folder)
```
$ python3 -m pip install -r .\requirements.txt
```

3. Change the required lines in the config.json
The required ones are token and User ID. You can get your user id by enabling developer mode on discord, right clicking yourself and clicking

![image](https://user-images.githubusercontent.com/66682497/151679095-fc0025b5-ebc8-4ed3-ba46-f535cf2ac85b.png)

And you can get the token by making an application in the "discord developer portal" and then making a bot in that application.

![Untitled](https://user-images.githubusercontent.com/66682497/151679192-60aa190d-a3b0-444b-81c4-1dea7a805229.png)

```json
{
    "token": "put your token here",
    "prefix": "?",
    "uid": "Put your User ID here (Example: 6162286911558778122)",
    "friendserver": "1234567890", 
    "_comment": "'friendserver' is not required"
}
```

After doing these things you're basically good to go! Just run the bot by doing `python3 bot.py` inside the bot folder. Good luck!

## Help command output:
```
Base:
  pull       Pulls the latest version from github
  reload     Reloads cogs.
Fun:
  cuddle     Cuddles the pinged member.
  gayrate    How gay is the pinged person O_o
  hug        Hugs the pinged member.
  neko       Sends a random catperson image.
  owoify     Owoifies your text.
  pat        Pats the pinged member.
  sauce      
  say        Says the message you tell it to say.
  slap       Slaps the pinged member.
Moderation:
  ban        B a n  h a m m e r
  kick       KicKkk
  mute       Mutes the pinged member.
  purge      Removes messages
Utility:
  avatar     Shows the pinged member's avatar.
  nick       Give a nickname to the mentioned user.
  role       Adds role to the pinged user.
  serverinfo Shows server information.
  userinfo   Shows member information.
No Category:
  help       Shows this message

Type ?help command for more info on a command.
You can also type ?help category for more info on a category.
```
