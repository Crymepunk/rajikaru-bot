import nextcord
import logging
from colorama import Fore
from nextcord.ext import commands
import json
import os

# Makes program log to discord.log file
logger = logging.getLogger('nextcord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

# Clear the terminal/cmd
os.system("cls" if os.name == "nt" else "clear")

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

token = config.get("token")
prefix = config.get("prefix")
uid = int(config.get("uid"))

# Check if required variables have been changed.
if token == "CHANGEME":
    print("Please change the token in config.json!")
    exit()
elif uid == 1234567890:
    print("Please change the uid in config.json!")
    exit()

# Enables required intents for serverinfo and userinfo commands
intents = nextcord.Intents.default()
intents.members = True

# Defines bot and adds a prefix
bot = commands.Bot(command_prefix=commands.when_mentioned_or(prefix), intents=intents)

# Check if the bot is running and ready
@bot.event
async def on_ready():
    print(f"{Fore.RED}R{Fore.GREEN}u{Fore.YELLOW}nn{Fore.BLUE}i{Fore.MAGENTA}n{Fore.CYAN}g {Fore.WHITE}on {bot.user}")

# Loading Nextcord.py Cogs
try:
    bot.load_extension("cogs.base")
    print(f"{Fore.GREEN}Base {Fore.WHITE}cog loaded!")
except Exception as e:
    print(f"{Fore.RED}Failed to load Base cog")
try:
    bot.load_extension("cogs.moderation")
    print(f"{Fore.GREEN}Moderation {Fore.WHITE}cog loaded!")
except Exception as e:
    print(f"{Fore.RED}Failed to load Moderation cog")
try:
    bot.load_extension("cogs.fun")
    print(f"{Fore.GREEN}Fun {Fore.WHITE}cog loaded!")
except Exception as e:
    print(f"{Fore.RED}Failed to load Fun cog")
try:
    bot.load_extension("cogs.utility")
    print(f"{Fore.GREEN}Utility {Fore.WHITE}cog loaded!")
except Exception as e:
    print(f"{Fore.RED}Failed to load Utility cog")


# Start the bot when everything is loaded
bot.run(token)
