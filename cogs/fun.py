import nextcord
from nextcord.ext import commands
import nekos
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
        await ctx.send(nekos.img(target="neko"))

    @commands.command()
    async def pat(self, ctx, member: nextcord.Member):
        pat = nextcord.Embed(title=f"{ctx.author} patted {member}", description="", color=0x32363c)
        pat.set_image(url=f"{nekos.img(target='pat')}")
        await ctx.send(embed=pat)

def setup(bot):
    bot.add_cog(Fun(bot))
