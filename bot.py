import nextcord
import logging
import os
from time import sleep
from nextcord.ext import commands

# Makes program log to discord.log file
logger = logging.getLogger('nextcord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

# Defines bot and adds a prefix
bot = commands.Bot(command_prefix=commands.when_mentioned_or('?'))

@bot.event
async def on_ready():
    print(f"Running on {bot.user}")

# Loading Nextcord.py Cogs
try:
    bot.load_extension("cogs.moderation")
    print("Moderation cog loaded!")
except Exception as e:
    print("Failed to load Moderation cog")
try:
    bot.load_extension("cogs.fun")
    print("Fun cog loaded!")
except Exception as e:
    print("Failed to load Fun cog")
try:
    bot.load_extension("cogs.utility")
    print("Utility cog loaded!")
except Exception as e:
    print("Failed to load Utility cog")

@bot.command()
async def reload(ctx, arg = None):
    """Reloads cogs. Options: moderation, fun, utility, all"""
    if arg.lower() == "all":
        try:
            bot.reload_extension("cogs.utility")
            bot.reload_extension("cogs.fun")
            bot.reload_extension("cogs.moderation")
            await ctx.send("Reloaded All Cogs!")
            print("Reloaded All Cogs!")
        except Exception as e:
            await ctx.send("Failed to reload all cogs :x:")
            print("Failed to reload all cogs :x:")
    elif arg.lower() == "moderation" or arg.lower() == "fun" or arg.lower() =="utility":
        try:
            bot.reload_extension(f"cogs.{arg}")
            await ctx.send(f"Reloaded {arg.capitalize()} cog!")
            print(f"Reloaded {arg.capitalize()} cog!")
        except Exception as e:
            await ctx.send("Failed to reload cog :x:")
            print("Failed to reload cog :x:")
    elif arg == None:
        await ctx.send("Missing argument!")
    else:
        await ctx.send("Invalid extension.")


# Runs the bot, token needs to be in "token" file.
token = open("token","r").readline()
bot.run(token)
