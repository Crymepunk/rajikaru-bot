from os import name
from typing import Sized
import nextcord
from nextcord.ext import commands
import datetime
import random

class Utility(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command(aliases=['av'])
    async def avatar(self, ctx, member: nextcord.Member = None):
        """Shows the pinged member's avatar."""
        if member != None:
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
        """Adds role to the pinged user."""
        try:
            await member.add_roles(role)
            await ctx.send(f"Added {role.name} to {member.display_name}")
        except Exception as e:
            await ctx.send(f"Can't give {role.name} to {member.display_name}")

    @commands.command(aliases=['user-info'])
    async def userinfo(self, ctx, member: nextcord.Member = None):
        if member == None:
            member = ctx.author
        joined = member.joined_at.strftime("%H:%M %d/%m/%Y in %Z")
        created = member.created_at.strftime("Created at %H:%M %d/%m/%Y in %Z")
        embed = nextcord.Embed(title="Userinfo command", color = random.randint(0, 0xFFFFFF))
        embed.add_field(name="UserID\n", value=member.id, inline=True)
        embed.add_field(name="Joined Server at\n", value=joined, inline=True)
        embed.add_field(name="Joined Discord at\n", value=created, inline=True)
        embed.set_thumbnail(url=f"{member.avatar}")
        await ctx.reply(embed=embed)

def setup(bot):
    bot.add_cog(Utility(bot))
