import nextcord
from nextcord.ext import commands
import nekos
import random
from time import sleep

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
        if 'balls' in message.content and message.channel.id == 891479236857196624:
            await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")
        if message.content.startswith('woo ping lui') and message.author.id == 769632057575342081:
            while True:
                await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
                sleep(3)

    @commands.command()
    async def owoify(self, ctx, *, message):
        """Owoifies your text."""
        await ctx.send(nekos.owoify(text=message))

    @commands.command()
    async def neko(self, ctx):
        """Sends a random catperson image"""
        await ctx.send(nekos.img(target="neko"))

    @commands.command()
    async def pat(self, ctx, member: nextcord.Member):
        """Pats the pinged member"""
        pat = nextcord.Embed(title=f"{ctx.author} pats {member}", description="", color = random.randint(0, 0xFFFFFF))
        pat.set_image(url=f"{nekos.img(target='pat')}")
        await ctx.send(embed=pat)

    @commands.command()
    async def slap(self, ctx, member: nextcord.Member):
        """Slaps the pinged member"""
        slap = nextcord.Embed(title=f"{ctx.author} slaps {member}", description="", color = random.randint(0, 0xFFFFFF))
        slap.set_image(url=f"{nekos.img(target='slap')}")
        await ctx.send(embed=slap)

    @commands.command()
    async def cuddle(self, ctx, member: nextcord.Member):
        """Cuddles the pinged member"""
        cuddle = nextcord.Embed(title=f"{ctx.author} cuddles {member}", description="", color = random.randint(0, 0xFFFFFF))
        cuddle.set_image(url=f"{nekos.img(target='cuddle')}")
        await ctx.send(embed=cuddle)

    @commands.command()
    async def hug(self, ctx, member: nextcord.Member):
        """Hugs the pinged member"""
        hug = nextcord.Embed(title=f"{ctx.author} hugs {member}", description="", color = random.randint(0, 0xFFFFFF))
        hug.set_image(url=f"{nekos.img(target='hug')}")
        await ctx.send(embed=hug)

def setup(bot):
    bot.add_cog(Fun(bot))
