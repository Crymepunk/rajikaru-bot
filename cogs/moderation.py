import nextcord
from nextcord.ext import commands

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    async def ban(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """Syntax: ban [member]"""
        if commands.has_guild_permissions(manage_messages=True):
            await ctx.send("Can't ban a Moderator")
        elif commands.has_guild_permissions(administrator=True):
            await ctx.send("Can't ban an Administrator")
        elif commands.has_guild_permissions(manage_messages=False) and commands.has_guild_permissions(administrator=False):
#            await member.ban(reason=reason)
            await ctx.send(f'{member} has been banned for "{reason}"')

    @commands.command()
    @commands.has_guild_permissions(kick_members=True)
    async def kick(self, ctx, member: nextcord.Member, *, reason=None):
        """Syntax: kick [member]"""
#        await member.kick(reason=reason)
        await ctx.send(f'{member} has been kicked for "{reason}"')

def setup(bot):
    bot.add_cog(Moderation(bot))
