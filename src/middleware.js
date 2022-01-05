const util = require("./util");
const messages = require("./messages");
const {TryRegister, RegisterSuccessHandler, RegisterFailedHandler} = require("./commands");
const {Person} = require('./model');
const {Telegraf} = require('telegraf');


CodeFilter = Telegraf.hears(/^\d{9}$/m, async (ctx) => {
    if (ctx.isRegistered) {
        return await ctx.reply(messages.RegisterSuccess(ctx.person.name, ctx.chatTarget))
    }
    const success = await TryRegister(ctx, ctx.message.text)
    if (!success) {
        await RegisterFailedHandler(ctx, ctx.message.text);
    }
})

WithModel = (model) => async (ctx, next) => {
    ctx.model = model
    await next()
}

UserId = async (ctx, next) => {
    const telegramId = ctx.from.id;
    const model = ctx.model;
    const person = model.getPersonById(telegramId)
    if (person !== null) {
        ctx.person = person
        ctx.isRegistered = true
    }
    await next();
}

RequireRegister = async (ctx, next) => {
    const telegramId = ctx.from.id;
    const model = ctx.model;
    const person = model.getPersonById(telegramId)
    if (person !== null) {
        ctx.person = person
        ctx.angel = model.getPersonByUuid(person.angel)
        ctx.mortal = model.getPersonByUuid(person.mortal)
        await next();
    } else {
        let success = false;
        let isCommand = false;
        if (util.isText(ctx)) {
            success = await TryRegister(ctx, ctx.message.text)
            isCommand = ctx.message.text.startsWith("/")
        }
        if (!success && !isCommand)
            return ctx.replyWithMarkdown(messages.RegisterReminder);
        await next()
    }
}

OnlyPrivate = async (ctx, next) => {
    let chat = ctx.chat;
    if (chat.type !== 'private') {
        try {
            await ctx.reply(messages.NoGroupChats)
            await ctx.leaveChat(chat.id)
        } catch (e) {
        }
        return
    }
    await next()
}

ErrorHandler = async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        Telegraf.log(console.error)(ctx, () => console.error(e))
    }
}

Settings = (isAngel = true, otherBot) => async (ctx, next) => {
    ctx.isAngel = isAngel
    ctx.isMortal = !isAngel
    ctx.otherBot = otherBot
    ctx.chatTarget = isAngel ? "Angel" : "Mortal"
    ctx.chatAs = isAngel ? "Mortal" : "Angel"

    await next()
}

Replies = async (ctx, next) => {
    const target = ctx.message.reply_to_message
    if (!target) {
        //Not a reply
        await next()
        return
    }
    if (!target.text) {
        //not replying to a pure text message or not sending pure text
        ctx.reply(messages.ReplyToWarning)
        await next()
        return
    }
    if (ctx.updateSubTypes[0] !== "text"
        && ctx.updateSubTypes[0] !== "animation"
        && ctx.updateSubTypes[0] !== "sticker") {
        //not replying to a pure text message or not sending pure text
        ctx.reply(messages.ReplyWithWarning(ctx.updateSubTypes[0]))
        await next()
        return
    }

    const MAX_QUOTE_LENGTH = 250
    const name = target.from.username == ctx.botInfo.username ? "you" : ctx.chatAs
    const strs = ["\n\n| In reply to: ", name, " said:\n| "]
    const quotedText = target.text
        .split(strs[0])[0]
        .substr(0, MAX_QUOTE_LENGTH)
    strs.push(quotedText)
    ctx.replyText = strs.join('')
    await next()
}

module.exports = {
    UserId,
    OnlyPrivate,
    ErrorHandler,
    RequireRegister,
    WithModel,
    Settings,
    CodeFilter,
    Replies
}
