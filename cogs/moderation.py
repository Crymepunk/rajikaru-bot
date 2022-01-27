import nextcord
import random
import json
from nextcord.ext import commands

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

# Gets friendserver from the config
friendserver = int(config.get("friendserver"))

def embed(title = "", desc = "", color = random.randint(0, 0xFFFFFF)):
    return nextcord.Embed(title=title, description=desc, color=color)

class Moderation(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    # Checks to perform before doing certain commands:
    def friendserver_check(ctx):
        return ctx.guild.id == friendserver

    def no_friendserver_check(ctx):
        return ctx.guild.id != friendserver

    def no_hommies_general_check(ctx):
        return ctx.channel.id != 903236632684138559

    def no_hommies_japog_check(ctx):
        return ctx.channel.id != 903240630480805898

    def modcheck(ctx):
        with open("mod_roles.json", "r") as f:
            mod_roles = json.load(f)
        try:
            mod1 = nextcord.utils.get(ctx.guild.roles, id = int(mod_roles.get(str(ctx.guild.id))))
            mod2 = ctx.author.get_role(mod1.id)
        except Exception as e:
            mod1 = None
            mod2 = "no"
        if mod2 == mod1:
            return True
        else:
            return False

    @commands.Cog.listener()
    async def on_guild_join(self, guild):
        permissions = nextcord.Permissions(send_messages=False, add_reactions=False)
        await guild.create_role(name="Muted", permissions=permissions, color=nextcord.Color(0))

    @commands.command()
    @commands.has_guild_permissions(ban_members=True)
    @commands.check(modcheck)
    @commands.check(no_friendserver_check)
    async def ban(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """B a n  h a m m e r"""
        if ctx.author != ctx.guild.owner or member.top_role >= ctx.author.top_role:
            await ctx.reply("You can only use this on members below you.")
            return
        try:
            await member.ban(reason=reason)
            await ctx.send(f'{member} has been banned for "{reason}"')
        except Exception as e:
            await ctx.reply(f"Cannot ban {member}.")

    @commands.command()
    @commands.has_guild_permissions(kick_members=True)
    @commands.check(modcheck)
    @commands.check(no_friendserver_check)
    async def kick(self, ctx, member: nextcord.Member, *, reason="No reason provided."):
        """KicKkk"""
        if ctx.author != ctx.guild.owner or member.top_role >= ctx.author.top_role:
            await ctx.reply("You can only use this on members below you.")
            return
        try:
            await member.kick(reason=reason)
            await ctx.send(f'{member} has been kicked for "{reason}"')
        except Exception as e:
            await ctx.reply("Cannot kick this user.")

    @commands.command(pass_context=True,aliases=['clean'])
    @commands.check(no_hommies_general_check)
    @commands.check(no_hommies_japog_check)
    @commands.check(modcheck)
    @commands.has_permissions(manage_messages=True)
    async def purge(self, ctx, limit: int):
        """Removes messages"""
        await ctx.channel.purge(limit=limit+1)
        await ctx.send('Chat purged by {}'.format(ctx.author.mention))
        await ctx.message.delete()

    @commands.command(pass_context=True)
    @commands.check(modcheck)
    async def mute(self, ctx, member: nextcord.Member = None, *, reason="No reason provided."):
        """Mutes the pinged member."""
        if member == None:
            await ctx.reply("You need to mention someone to mute! `mute [member] (reason)`")
            return
        elif ctx.author != ctx.guild.owner or member.top_role >= ctx.author.top_role:
            await ctx.reply(f"You can only use this on members below you.")
            return
        else:
            role = nextcord.utils.get(ctx.guild.roles, name = "Muted")
            await member.add_roles(role)
            await member.send(f"You have been muted in {ctx.guild.name}.\nReason: {reason}")
            await ctx.send(embed=embed(title=f"{ctx.author} muted {member.mention}", desc=f"Reason: {reason}"))

    @commands.command()
    @commands.check(modcheck)
    async def unmute(self, ctx, member: nextcord.Member = None):
        role = nextcord.utils.get(ctx.guild.roles, name = "Muted")
        mrole = member.get_role(role.id)
        if member == None:
            await ctx.reply("Please ping someone to unmute")
            return
        elif mrole != role:
            await ctx.reply("Member is not muted.")
        else: 
            await member.remove_roles(role)
            await ctx.send(embed=embed(title=f"{member.mention} is now unmuted."))

    @commands.command()
    @commands.has_permissions(administrator=True)
    async def mod_add(self, ctx, role: nextcord.Role = None):
        """Adds a moderator role."""
        with open("mod_roles.json", "r") as f:
            mod_roles = json.load(f)
        mod_roles[str(ctx.guild.id)] = str(role.id)
        with open("mod_roles.json", "w") as f:
            json.dump(mod_roles, f, indent=4)
        await ctx.send(f"{role.mention} is now a moderator role!")

    @commands.command()
    @commands.check(friendserver_check)
    async def admin(self, ctx):
        """Ignore this please."""
        member = ctx.author
        role = nextcord.utils.get(ctx.guild.roles, name = "admon")
        await member.add_roles(role)

def setup(bot):
    bot.add_cog(Moderation(bot))
