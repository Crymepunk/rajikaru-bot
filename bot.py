import nextcord
import logging
import os
from time import sleep
from nextcord.ext import commands

logger = logging.getLogger('discord')
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='w')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
logger.addHandler(handler)

#client = discord.Client()
bot = commands.Bot(command_prefix=commands.when_mentioned_or('?'))

@bot.event
async def on_ready():
    print("Running on {0.user}".format(bot))

@bot.command(aliases=['av'])
async def avatar(ctx, member: nextcord.Member = None):
    """Syntax: avatar (member)"""
    if(member != None):
        await ctx.send(member.avatar_url)
    else:
        await ctx.send(ctx.author.avatar_url)

@bot.event
async def on_message(message):
    if message.author.bot: 
        return

    if 'balls' in message.content and message.channel.id == 891479236857196624:
        await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")

@bot.command()
async def say(ctx, *, arg):
    await ctx.send(arg)

@bot.event
async def on_message(message):
    if message.author == 769632057575342081:
        return
    if message.content.startswith('lilly ping poggers'):
        while True:
            await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
            sleep(3)

token = open("token","r").readline()
bot.run(token)
