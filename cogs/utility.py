import nextcord
from nextcord.ext import commands

class Utility(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['av'])
    async def avatar(self, ctx, member: nextcord.Member = None):
        """Shows the pinged member's avatar Syntax: avatar (member)"""
        if(member != None):
            await ctx.send(member.avatar)
        else:
            await ctx.send(ctx.author.avatar)

def setup(bot):
    bot.add_cog(Utility(bot))
