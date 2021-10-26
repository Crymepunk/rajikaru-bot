import nextcord
from nextcord.ext import commands
import nekos

class Fun(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.command()
    async def say(self, ctx, *, message):
        """Says the message you tell it to say."""
        await ctx.send(message)

    @commands.Cog.listener()
    async def on_message(self, message):
        if message.author.bot:
            return
        if 'balls' in message.content and message.channel.id == 891479236857196624:
            await message.channel.send("<@384380563861274625> sucking balls 2021 (colorised) https://media.discordapp.net/attachments/885882663670546432/887437098972508180/unknown.png")
        if message.content.startswith('woo ping lui') and message.author.id == bot.owner_id:
            while True:
                await message.channel.send("follow <@621041670309543967>'s patreon https://www.patreon.com/underagegameruwu18pluspoorgibmoneyhelp")
                sleep(3)
    
    @commands.command()
    async def owoify(self, ctx, *, message):
        """Owoifies your text."""
        await ctx.send(nekos.owoify(text=message))

    @commands.command()
    async def lewdneko(self, ctx, arg = None):
        """'?help lewdneko' for more info
        Possible Choices:
        feet, yuri, trap, futanari, hololewd, lewdkemo, solog, feetg, 
        cum, erokemo, les, wallpaper, lewdk, ngif, tickle, lewd, feed, 
        gecg, eroyuri, eron, cum_jpg, bj, nsfw_neko_gif, solo, kemonomimi, 
        nsfw_avatar, gasm, poke, anal, slap, hentai, avatar, erofeet, holo, 
        keta, blowjob, pussy, tits, holoero, lizard, pussy_jpg, pwankg, classic, 
        kuni, waifu, pat, 8ball, kiss, femdom, neko, spank, cuddle, erok, fox_girl, 
        boobs, random_hentai_gif, smallboobs, hug, ero, smug, goose, baka, woof"""
        try:
            if arg == None:
                await ctx.send(nekos.img(target=yuri))
            else:
                await ctx.send(nekos.img(target=arg))
        except Exception as e:
            await ctx.send("Invalid argument.")

def setup(bot):
    bot.add_cog(Fun(bot))
