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
try:
    bot.load_extension("cogs.nsfw")
    print("NSFW cog loaded!")
except Exception as e:
    print("Failed to load NSFW cog")

@bot.command()
async def reload(ctx, cog = None):
    """Reloads cogs.
    Options: moderation, fun, utility, all."""
    if ctx.author.id == 744982881562263592:
        try:
            if cog.lower() == "all":
                try:
                    bot.reload_extension("cogs.utility")
                    bot.reload_extension("cogs.fun")
                    bot.reload_extension("cogs.moderation")
                    bot.reload_extension("cogs.nsfw")
                    await ctx.reply("Reloaded All Cogs!")
                    print("Reloaded All Cogs!")
                except Exception as e:
                    await ctx.reply("Failed to reload all cogs :x:")
                    print("Failed to reload all cogs.")
            elif cog.lower() == "moderation" or cog.lower() == "fun" or cog.lower() == "utility" or cog.lower() == "nsfw":
                try:
                    bot.reload_extension(f"cogs.{cog}")
                    await ctx.reply(f"Reloaded {cog.capitalize()} cog!")
                    print(f"Reloaded {cog.capitalize()} cog!")
                except Exception as e:
                    await ctx.send("Failed to reload cog :x:")
                    print("Failed to reload cog.")
            else:
                await ctx.reply("Invalid extension.")
        except Exception as e:
            await ctx.send("Missing argument!")
    else:
        await ctx.reply("please dont.")

@bot.command()
async def pull(ctx):
    if ctx.author.id == 744982881562263592:
        res = os.system("git pull")
        await ctx.reply(res)
    else:
        await ctx.reply("no")

# Runs the bot, token needs to be in "token" file.
token = open("token","r").readline()
bot.run(token)
