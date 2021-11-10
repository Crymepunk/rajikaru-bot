import nextcord
import logging
import os
from colorama import Fore, init
from nextcord.ext import commands
import json

# Makes program log to discord.log file
logger = logging.getLogger('nextcord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

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

# Defines bot and adds a prefix
bot = commands.Bot(command_prefix=commands.when_mentioned_or(prefix))

# Check if the bot is running and ready
@bot.event
async def on_ready():
    print(f"{Fore.RED}R{Fore.GREEN}u{Fore.YELLOW}nn{Fore.BLUE}i{Fore.MAGENTA}n{Fore.CYAN}g {Fore.WHITE}on {bot.user}")

# Loading Nextcord.py Cogs
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
try:
    bot.load_extension("cogs.nsfw")
    print(f"{Fore.MAGENTA}NSFW {Fore.WHITE}cog loaded!")
except Exception as e:
    print(f"{Fore.RED}Failed to load NSFW cog")

@bot.command()
async def reload(ctx, cog = None):
    """Reloads cogs.
    Options: moderation, fun, utility, NSFW, all."""
    if ctx.author.id == uid:
        try:
            if cog.lower() == "all":
                try:
                    bot.reload_extension("cogs.utility")
                    bot.reload_extension("cogs.fun")
                    bot.reload_extension("cogs.moderation")
                    bot.reload_extension("cogs.nsfw")
                    await ctx.reply("Reloaded All Cogs!")
                    print(f"{Fore.WHITE}Reloaded {Fore.GREEN}All {Fore.WHITE}Cogs!")
                except Exception as e:
                    await ctx.reply("Failed to reload all cogs :x:")
                    print(f"{Fore.RED}Failed to reload all cogs.")
            elif cog.lower() == "moderation" or cog.lower() == "fun" or cog.lower() == "utility" or cog.lower() == "nsfw":
                try:
                    bot.reload_extension(f"cogs.{cog}")
                    await ctx.reply(f"Reloaded {cog.capitalize()} cog!")
                    print(f"{Fore.WHITE}Reloaded {Fore.GREEN}{cog.capitalize()} {Fore.WHITE}cog!")
                except Exception as e:
                    await ctx.send("Failed to reload cog :x:")
                    print(f"{Fore.RED}Failed to reload {cog.capitalize()} cog.")
            else:
                await ctx.reply("Invalid extension.")
        except Exception as e:
            await ctx.reply("Missing argument!")
    else:
        await ctx.reply("please dont.")

@bot.command()
async def pull(ctx):
    """Pulls the latest version from github
    use reload after using this command."""
    if ctx.author.id == uid:
        res = os.system("git pull")
        await ctx.reply(res)
    else:
        await ctx.reply("no")

bot.run(token)
