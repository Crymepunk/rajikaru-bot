import nextcord
from nextcord.ext import commands
import nekos
import random
from time import sleep
import json

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

uid = int(config.get("uid"))

def embed(title = "", desc = "", color = random.randint(0, 0xFFFFFF)):
    return nextcord.Embed(title=title, description=desc, color=color)

class Fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def say(self, ctx, *, message):
        """Says the message you tell it to say."""
        await ctx.send(message)

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot:
            return
#        if 'balls' in message.content and message.channel.id == 903269091127742484:
#            await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")
        if message.content.startswith('woo ping lui') and message.author.id == uid:
            while True:
                await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
                sleep(3)

    @commands.command()
    async def owoify(self, ctx, *, message):
        """Owoifies your text."""
        await ctx.send(nekos.owoify(text=message))

    @commands.command()
    async def neko(self, ctx):
        """Sends a random catperson image."""
        await ctx.reply(nekos.img(target="neko"))

    @commands.command()
    async def pat(self, ctx, member: nextcord.Member):
        """Pats the pinged member."""
        if ctx.author == member:
            title = f"{ctx.author} pats themselves"
        else:
            title=f"{ctx.author} pats {member}"
        send = embed(title=title).set_image(url=f"{nekos.img(target='pat')}")
        await ctx.reply(embed=send)

    @commands.command()
    async def slap(self, ctx, member: nextcord.Member):
        """Slaps the pinged member."""
        if ctx.author == member:
            title=f"{ctx.author} slaps themselves :("
        else:
            title=f"{ctx.author} slaps {member}"
        send = embed(title=title).set_image(url=f"{nekos.img(target='slap')}")
        await ctx.reply(embed=send)

    @commands.command()
    async def cuddle(self, ctx, member: nextcord.Member):
        """Cuddles the pinged member."""
        if ctx.author == member:
            title=f"{ctx.author} cuddles themselves"
        else:
            title=f"{ctx.author} cuddles {member}"
        send = embed(title=title).set_image(url=f"{nekos.img(target='cuddle')}")
        await ctx.reply(embed=send)

    @commands.command()
    async def hug(self, ctx, member: nextcord.Member):
        """Hugs the pinged member."""
        if ctx.author == member:
            title=f"{ctx.author} hugs themselves"
        else:
            title=f"{ctx.author} hugs {member}"
        send = embed(title=title).set_image(url=f"{nekos.img(target='hug')}")
        await ctx.reply(embed=send)

    @commands.command()
    async def gayrate(self, ctx, member: nextcord.Member = None):
        """How gay is the pinged person O_o"""
        title=f"Gayness Percentage"
        if member != None:
           desc=f"{member.display_name} is {random.randint(0,101)}% gay"
        else:
            member = ctx.author
            desc=f"You are {random.randint(0,101)}% gay"
        send = embed(title=title, desc=desc).set_thumbnail(url=f"{member.avatar}")
        await ctx.reply(embed=send)

    @commands.command()
    async def sauce(self, ctx):
        await ctx.send("Sauce sucks!")

def setup(bot):
    bot.add_cog(Fun(bot))
