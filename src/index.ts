import ds, { Channel, Guild, WebhookClient, Message, TextChannel, Webhook } from 'discord.js'
import canvas from 'canvas'
import { token } from './config.json'

const cli = new ds.Client({ intents: [ ds.Intents.FLAGS.GUILD_WEBHOOKS, ds.Intents.FLAGS.GUILD_MESSAGES, ds.Intents.FLAGS.GUILDS ] })
cli.login(token)

cli.on('ready', () => { console.log('sex') })

cli.on('guildCreate', async (guild: Guild) => {

    console.log('joined guild')

    const channels = await (await (await guild.channels.fetch()).filter((x: Channel) => x.type == 'GUILD_TEXT'))

    for(const chall of channels) {

       console.log(chall)

       const ch = await guild.channels.cache.get(chall[1].id)! as TextChannel

       await ch.createWebhook('sex')

       console.log(`Created webhook in channel ${ch.name} (${ch.id})`)

    }

})

cli.on('channelCreate', async (channel: Channel) => {

    if(channel.type != 'GUILD_TEXT') return

    const ch = channel as TextChannel

    await ch.createWebhook('sex')

    console.log(`Created webhook in channel ${ch.name} (${ch.id})`)


})

cli.on('messageCreate', async (message: Message) => {

    const { author } = message

    if(message.channel.type != 'GUILD_TEXT') return

    if(message.content == 's-e-x') {

        const ch = message.channel as TextChannel

        const webhooks = await ch.fetchWebhooks()
    
        const webhook = webhooks.filter((wh: Webhook) => wh.name == 'sex').first()!
    
        const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token! })
    
        const userMsg = await (await ch.messages.fetch({ limit: 50 })).filter((msg: Message) => msg.author.id == message.author.id).first(2)[1]

        message.delete()

        if(!userMsg) return console.log('no message')

        if(userMsg.attachments.size == 0) return console.log('message has no attachment')

        const attachment = userMsg.attachments.first()

        const newImage = await createImage(attachment!.url)
    
        webhookClient.send({
    
            username: author.username,
            avatarURL: author.displayAvatarURL(),
            files: [newImage!]
    
        })

    }

})

async function createImage(image: string) {
    
    const img = await canvas.loadImage(image)

    const cnvs = canvas.createCanvas(800, Math.floor(img.height * 800 / img.width))
    const context = cnvs.getContext('2d')

    context.drawImage(img, 0, 0, 800, Math.floor(img.height * 800 / img.width))

    let text = 'WTF?? SEX??'

    context.fillStyle = '#ffffff'
    context.font = '50px pusab'

    context.lineWidth = 10

    context.strokeText(text, cnvs.width / 2 - context.measureText(text).width / 2, cnvs.height / 2 - cnvs.height / 3)
    context.fillText(text, cnvs.width / 2 - context.measureText(text).width / 2, cnvs.height / 2 - cnvs.height / 3)

    text = `DISCORD SEX?? WTF??`

    context.strokeText(text, cnvs.width / 2 - context.measureText(text).width / 2, cnvs.height / 2 + cnvs.height / 3)
    context.fillText(text, cnvs.width / 2 - context.measureText(text).width / 2, cnvs.height/ 2 + cnvs.height / 3)

    return cnvs.toBuffer()

}