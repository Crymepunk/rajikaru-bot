from nextcord.ext import commands
import json
from colorama import Fore

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

uid = int(config.get("uid"))

class Base(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def reload(self, ctx, cog = None):
        """Reloads cogs.
        Options: moderation, fun, utility, NSFW, all."""
        if ctx.author.id == uid:
            try:
                if cog.lower() == "all":
                    try:
                        self.bot.reload_extension("cogs.utility")
                        self.bot.reload_extension("cogs.fun")
                        self.bot.reload_extension("cogs.moderation")
                        self.bot.reload_extension("cogs.nsfw")
                        self.bot.reload_extension("cogs.base")
                        await ctx.reply("Reloaded All Cogs!")
                        print(f"{Fore.WHITE}Reloaded {Fore.GREEN}All {Fore.WHITE}Cogs!")
                    except Exception as e:
                        await ctx.reply("Failed to reload all cogs :x:")
                        print(f"{Fore.RED}Failed to reload all cogs.")
                elif cog.lower() == "moderation" or cog.lower() == "fun" or cog.lower() == "utility" or cog.lower() == "nsfw" or cog.lower() == "base":
                    try:
                        self.bot.reload_extension(f"cogs.{cog}")
                        await ctx.reply(f"Reloaded {cog.capitalize()} cog!")
                        print(f"{Fore.WHITE}Reloaded {Fore.GREEN}{cog.capitalize()} {Fore.WHITE}cog!")
                    except Exception as e:
                        await ctx.send("Failed to reload cog :x:")
                        print(f"{Fore.RED}Failed to reload {cog.capitalize()} cog.")
                else:
                    await ctx.reply("Invalid extension.")
            except Exception as e:
                await ctx.reply("Missing argument!")
        else:
            await ctx.reply("please dont.")

    @commands.command()
    async def pull(self, ctx):
        """Pulls the latest version from github
        use reload after using this command."""
        if ctx.author.id == uid:
            res = os.system("git pull")
            await ctx.reply(res)
        else:
            await ctx.reply("no")

def setup(bot):
    bot.add_cog(Base(bot))
