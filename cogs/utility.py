import nextcord
from nextcord.ext import commands
import random
import json

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

# Gets friendserver from the config
friendserver = int(config.get("friendserver"))

def embed(title = "", desc = "", color = random.randint(0, 0xFFFFFF)):
    return nextcord.Embed(title=title, description=desc, color=color)

class Utility(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['av'])
    async def avatar(self, ctx, member: nextcord.Member = None):
        """Shows the pinged member's avatar."""   
        if member == None:
            # If member is None then set member to author and execute as normal.
            member = ctx.author
        # If member is not None then dont do anything and execute the code below as normal.
        send = embed(title = f"{member.name}'s avatar").set_image(url=f"{member.display_avatar}")
        await ctx.reply(embed=send)

    @commands.command(pass_context=True)
    @commands.has_guild_permissions(manage_nicknames=True)
    async def nick(self, ctx, member: nextcord.Member, *, nick):
        """Give a nickname to the mentioned user."""
        await member.edit(nick=nick)
        await ctx.send(f"Changed {member.name}'s nickname to {member.mention}")

    @commands.command()
    @commands.has_guild_permissions(manage_roles=True)
    async def role(self, ctx, member: nextcord.Member, role: nextcord.Role):
        """Adds role to the pinged user."""
        if ctx.guild.id == friendserver:
            if ctx.author != ctx.guild.owner or member.top_role > ctx.author.top_role:
                await ctx.send("Stop trying to break my shit!")
                return
        elif ctx.author != ctx.guild.owner or member.top_role >= ctx.author.top_role:
            await ctx.send("You can only use this on members below you.")
            return
        try:
            await member.add_roles(role)
            await ctx.send(f"Added {role.name} to {member.display_name}")
        except Exception as e:
            await ctx.send(f"Can't give {role.name} to {member.display_name}")

    @commands.command(aliases=['user-info'])
    async def userinfo(self, ctx, member: nextcord.Member = None):
        """Shows member information."""
        if member == None:
            member = ctx.author
        joined = member.joined_at.strftime("%H:%M %d/%m/%Y in %Z")
        created = member.created_at.strftime("Created at %H:%M %d/%m/%Y in %Z")
        emb = embed(title="Userinfo command")
        emb.add_field(name="UserID\n", value=member.id, inline=True)
        emb.add_field(name="Joined Server at\n", value=joined, inline=True)
        emb.add_field(name="Joined Discord at\n", value=created, inline=True)
        emb.set_thumbnail(url=f"{member.display_avatar}")
        await ctx.reply(embed=emb)

    @commands.command(aliases=['server-info'])
    async def serverinfo(self, ctx):
        """Shows server information."""
        created = ctx.guild.created_at.strftime("%d/%m/%Y")
        emb = embed(title=f"{ctx.guild.name}")
        emb.add_field(name="Owner\n", value=ctx.guild.owner, inline=True)
        emb.add_field(name="Category Channels\n", value=f"{len(ctx.guild.categories)}", inline=True)
        emb.add_field(name="Text Channels\n", value=f"{len(ctx.guild.text_channels)}", inline=True)
        emb.add_field(name="Voice Channels\n", value=f"{len(ctx.guild.voice_channels)}", inline=True)
        emb.add_field(name="Members\n", value=ctx.guild.member_count, inline=True)
        emb.add_field(name="Roles\n", value=f"{len(ctx.guild.roles)}", inline=True)
        emb.set_footer(text=f"ID: {ctx.guild.id} | Server Created -> {created}")
        emb.set_thumbnail(url=(ctx.guild.icon or "https://cdn.discordapp.com/avatars/900694117355487283/1da67d4f41e66eb8aa222bd8d5837857.png?size=1024"))
        await ctx.reply(embed=emb)

def setup(bot):
    bot.add_cog(Utility(bot))
