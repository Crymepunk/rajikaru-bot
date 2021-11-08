import nextcord
from nextcord.ext import commands

class Utility(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['av'])
    async def avatar(self, ctx, member: nextcord.Member = None):
        """Shows the pinged member's avatar Syntax: avatar (member)"""
        if(member != None):
            await ctx.reply(member.avatar)
        else:
            await ctx.reply(ctx.author.avatar)

    @commands.command(pass_context=True)
    @commands.has_guild_permissions(manage_nicknames=True)
    async def nick(self, ctx, member: nextcord.Member, nick):
        """Give a nickname to the mentioned user."""
        await member.edit(nick=nick)
        await ctx.send(f"Changed {member}'s nickname to {member.mention}")

    @commands.command()
    @commands.has_guild_permissions(manage_roles=True)
    async def role(self, ctx, member: nextcord.Member, role: nextcord.Role):
        """Ignore this please."""
        try: 
            await member.add_roles(role)
            await ctx.send(f"Added {role.name} to {member.display_name}")
        except Exception as e:
            await ctx.send(f"Can't give {role.name} to {member.display_name}")


def setup(bot):
    bot.add_cog(Utility(bot))
