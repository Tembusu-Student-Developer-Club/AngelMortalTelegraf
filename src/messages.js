require('dotenv').config();
const prefix = process.env.PREFIX || "anm";

module.exports = {
    RegisterReminder: 'To register, please enter \'`/r code`\' where code is your 9 digit code',
    NoGroupChats: "Please don't add me to groups! Byeeee 👋",
    BotWelcome: (name, chatTarget) => `Welcome ${name}! This bot will act as a messaging platform between you and your match. Simply send a message here and we will pass it to your match`,
    ReferToBot: (chatAs) => `Please go to the ${chatAs}-bot at @${prefix}_${chatAs.toLowerCase()}_bot to start chatting with your ${chatAs} as well. You do not need to register again.`,
    // RegisterWelcome: "Paste the 9 digit code sent to you here to register",
    UnregisteredTarget: (chatTarget) => `It seems that your match hasn't registered with the bot on Telegram, we can't deliver your message to them. Don't worry, we'll let you know as soon as they have registered!`,
    DeregisterSuccess: "Successfully deregistered",
    RegisterSuccess: (name, chatTarget) => `Yay! You have successfully registered as ${name}! Have fun chatting with your match`,
    StatusHint: "Type /mortal to see who your mortal is!",
    StatusMessage: (name, mortalName) => `Hi ${name}! Have fun chatting with yout match!`,
    AlreadyRegisteredError: (name) => `Already registered as ${name}`,
    RegisterFailedGeneralError: (code) => `Failed to register with code ${code}`,
    HelpMessage: "This bot allows you to communicate with your match anonymously.\nRegister with the code given to you by typing\n`/r <code>`\nOnce registered, you can send messages to your match just by sending them here just like any other Telegram chat. Currently supported message types are text, stickers, photos and videos.",
    RegisteredNotifier: (chatTarget) => `Your match has registered with the bot on Telegram. Happy chatting!`,
    NotRegistered: "Not registered",
};
