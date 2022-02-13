<p align='center'>
  <img src='https://user-images.githubusercontent.com/66682497/151678869-494ec38e-5626-4a55-8cfa-e483bfe4d455.png'/>
</p>

<a href="https://github.com/Radiicall/rajikaru-bot/blob/main/LICENSE"><img src="https://img.shields.io:/github/license/Radiicall/rajikaru-bot?color=informational"></img></a>
<a href="https://github.com/Radiicall/rajikaru-bot/issues"><img src="https://img.shields.io:/github/issues/Radiicall/rajikaru-bot?color=important"></img></a>
<a href="https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2FRadiicall%2Frajikaru-bot"><img src="https://img.shields.io:/twitter/url?style=social&url=https%3A%2F%2Fgithub.com%2FRadiicall%2Frajikaru-bot"></img></a>

# Installation Instructions:

## Initial Setup

1. Download <a href="https://nodejs.org/en/">Node.js</a>


2. Run this command in your terminal or command prompt:

<strong>Note: Remember to open your terminal/command prompt from WITHIN the bot folder!</strong>
```
$ npm i
```

3. Change the name of `config.def.json` to `config.json` and change the required fields.

The required fields are "token", "clientId", "guildId", "sqluser", and "sqlpass".

## Gathering the Required Fields

You can get the guild (server) ID by enabling "Developer Mode" on Discord, right clicking the server in the server list on the left, and clicking "Copy ID".

To enable "Developer Mode", go to settings, click on "Advanced", and enable "Developer Mode".

![Discord account settings v2](https://user-images.githubusercontent.com/42098474/153733014-921c77a7-a2db-4791-8a00-392b6417f9a6.png)

![Discord account settings developer mode](https://user-images.githubusercontent.com/42098474/153732978-df1104b7-2568-4262-ad3b-8795d8a7dc9a.PNG)

![image](https://user-images.githubusercontent.com/66682497/151679095-fc0025b5-ebc8-4ed3-ba46-f535cf2ac85b.png)

You can get the token by making an application in the <a href="https://discord.com/developers/applications">Discord Developer Portal</a> and then making that application into a bot user. Both the token and the client ID/Application ID are found there.

To create an application in the Developer Portal, go to the portal by <a href="https://discord.com/developers/applications">clicking here</a>, click on "New Application" on the top right, and give it a a name. Before you move on, copy the application ID and paste it in the "config.json" file.

After you've done that, find "Bot" on the sidebar to the left and click it. Click "Add Bot". Click "Yes, do it!". Then copy the token and paste it in the "config.json" file.

![Discord bot creation](https://user-images.githubusercontent.com/42098474/153733398-cc9855cb-1861-45a1-bed4-b7b57d9d81bc.png)

![Discord bot creation #2](https://user-images.githubusercontent.com/42098474/153733401-c954f41a-2e53-457b-addc-f936b685fe17.png)

![Discord bot creation #3](https://user-images.githubusercontent.com/42098474/153733406-b532e224-8400-447c-84d5-e23305923418.png)

![Untitled](https://user-images.githubusercontent.com/66682497/151679192-60aa190d-a3b0-444b-81c4-1dea7a805229.png)

```json
{
    "token": "Put your token here",
    "clientId": "Application ID here",
    "guildId": "Guild ID here",
    "sqluser": "sql username",
    "sqlpass": "sql password"
}
```

Finally, make sure to have MariaDB installed and a database set up; you must put the database's username and password in the "sqluser" and "sqlpass" fields, respectively.


## Congrats!

After completing these steps you're basically good to go! Just run the bot by opening a terminal/command prompt, and executing `node .` from inside the bot folder. Good luck!
