import nextcord
from nextcord.ext import commands

class Fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def say(self, ctx, *, arg):
        await ctx.send(arg)
    
    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot:
            return
        if 'balls' in message.content and message.channel.id == 891479236857196624:
            await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")
        if message.content.startswith('woo ping lui') and message.author.id == bot.owner_id:
            while True:
                await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
                sleep(3)

def setup(bot):
    bot.add_cog(Fun(bot))