import nextcord
from nextcord.ext import commands
import nekos

class NSFW(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    @commands.is_nsfw()
    async def lewd(self, ctx, arg = None):
        """'?help lewd' for more info
        Possible Choices:
        feet, yuri, trap, futanari, hololewd, lewdkemo, solog, feetg,
        cum, erokemo, les, wallpaper, lewdk, ngif, tickle, lewd, feed,
        gecg, eroyuri, eron, cum_jpg, bj, nsfw_neko_gif, solo, kemonomimi,
        nsfw_avatar, gasm, poke, anal, slap, hentai, avatar, erofeet, holo,
        keta, blowjob, pussy, tits, holoero, lizard, pussy_jpg, pwankg, classic,
        kuni, waifu, 8ball, kiss, femdom, spank, erok, fox_girl,
        boobs, random_hentai_gif, smallboobs, ero, smug"""
        try:
            if arg == None:
                await ctx.reply(nekos.img(target="yuri"))
            else:
                await ctx.reply(nekos.img(target=arg))
        except Exception as e:
            await ctx.send("Invalid argument.")

def setup(bot):
    bot.add_cog(NSFW(bot))
