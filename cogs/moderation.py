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
            if ctx.guild.id != 903236631958548501:
                await member.ban(reason=reason)
                await ctx.send(f'{member} has been banned for "{reason}"')
            else:
                await ctx.reply("No banning ;-;")
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
            if ctx.guild.id != 903236631958548501:
                await member.kick(reason=reason)
                await ctx.send(f'{member} has been kicked for "{reason}"')
            else:
                await ctx.reply("Please no.")
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
        member = ctx.author
        var = nextcord.utils.get(ctx.guild.roles, name = "admon")
        member.add_role(var)

def setup(bot):
    bot.add_cog(Moderation(bot))
