import nextcord
import logging
import os
from time import sleep
from nextcord.ext import commands

#Makes program log to discord.log file
logger = logging.getLogger('nextcord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

#Defines bot and adds a prefix
bot = commands.Bot(command_prefix=commands.when_mentioned_or('?'))

@bot.event
async def on_ready():
    print(f"Running on {bot.user}")

try:
    bot.load_extension("cogs.moderation")
    print("Moderation cog loaded!")
except Exception as e:
    print("Failed to load moderation cog")

@bot.command(aliases=['av'])
async def avatar(ctx, member: nextcord.Member = None):
    """Syntax: avatar (member)"""
    if(member != None):
        await ctx.send(member.avatar)
    else:
        await ctx.send(ctx.author.avatar)

@bot.command()
async def reload(ctx, arg):
    if arg == "moderation":
        try:
            await bot.reload_extension("cogs.moderation")
            await ctx.send("Reloaded Moderation cog!")
        except Exception as e:
            await ctx.send("Failed to reload :x:")
    else:
        await ctx.send("Invalid extension")

@bot.event
async def on_message(message):
    if message.author.bot:
        return
    if 'balls' in message.content and message.channel.id == 891479236857196624:
        await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")
    if message.content.startswith('woo ping lui') and message.author.id == bot.owner_id:
        while True:
            await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
            sleep(3)
    await bot.process_commands(message)

@bot.command()
async def say(ctx, *, arg):
    await ctx.send(arg)

token = open("token","r").readline()
bot.run(token)
