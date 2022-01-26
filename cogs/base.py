from nextcord.ext import commands
import json
from colorama import Fore
import os

# Loads config.json
with open("config.json") as f:
    config = json.load(f)

# Gets uid from the config
uid = int(config.get("uid"))

class Base(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def reload(self, ctx, cog = None):
        """Reloads cogs.
        Options: moderation, fun, utility, all."""
        # Checks if the user is allowed to do the command
        if ctx.author.id == uid:
            try:
                # Checks if all cogs should be reloaded.
                if cog.lower() == "all":
                    try:
                        # Tries to reload all extensions AKA cogs.
                        self.bot.reload_extension("cogs.utility")
                        self.bot.reload_extension("cogs.fun")
                        self.bot.reload_extension("cogs.moderation")
                        self.bot.reload_extension("cogs.base")
                        await ctx.reply(":white_check_mark: Reloaded All Cogs!")
                        print(f"{Fore.WHITE}Reloaded {Fore.GREEN}All {Fore.WHITE}Cogs!")
                    except Exception as e:
                        # Sends and prints out an error message if it fails to reload.
                        await ctx.reply("Failed to reload all cogs :x:")
                        print(f"{Fore.RED}Failed to reload all cogs.")
                # Checks if any of these cogs should be reloaded
                elif cog.lower() == "moderation" or cog.lower() == "fun" or cog.lower() == "utility" or cog.lower() == "base":
                    try:
                        # Tries to reload a single extension AKA cog.
                        self.bot.reload_extension(f"cogs.{cog}")
                        await ctx.reply(f":white_check_mark: Reloaded {cog.capitalize()} cog!")
                        print(f"{Fore.WHITE}Reloaded {Fore.GREEN}{cog.capitalize()} {Fore.WHITE}cog!")
                    except Exception as e:
                        # Sends and prints out an error message if it fails to reload.
                        await ctx.send("Failed to reload cog :x:")
                        print(f"{Fore.RED}Failed to reload {cog.capitalize()} cog.")
                else:
                    # Sends out an error if the extension doesnt exist.
                    await ctx.reply("Invalid extension.")
            except Exception as e:
                # Sends "Missing argument" if none of the above is fulfilled.
                await ctx.reply("Missing argument!")
        else:
            # Sends please dont if the user that executed the command isnt allowed to reload cogs.
            await ctx.reply("please dont.")

    @commands.command(aliases=['git'])
    async def pull(self, ctx, arg='pull'):
        """Pulls the latest version from github
        use reload after using this command."""
        # Checks if the user is allowed to do the command
        if ctx.author.id == uid:
            # Does system command "git pull" and replies with the exit code of the program
            if arg != 'pull':
                await ctx.reply("what are you doing?")
                return
            res = os.system("git pull")
            if res == 0:
                await ctx.reply(f":white_check_mark: Success!\n       Exit code: {str(res)}")
            else:
                await ctx.reply(f":x: Failed \n       Exit code: {str(res)}")
        else:
            # Sends no if user isnt allowed to execute the command
            await ctx.reply("no")

def setup(bot):
    bot.add_cog(Base(bot))
