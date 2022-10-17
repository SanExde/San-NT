require('./set.js')

/**
* THANKS TO...
* Adiwajshing (Created Baileys)
* Danzz Coding (My Self)
*/

// Module
const { default: DanzzConnect, DisconnectReason, useSingleFileAuthState, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState(`./${sessionName}.json`)
const { Boom } = require('@hapi/boom')
var axios = require('axios')
var fs = require('fs')
var yargs = require('yargs/yargs')
var chalk = require('chalk')
var path = require('path')
var figlet = require('figlet')
var pino = require('pino')
var _ = require('lodash')
var FileType = require('file-type')
var PhoneNumber = require('awesome-phonenumber')

listcolor = ['aqua','red','blue','purple','magenta']
const randomcolor = listcolor[Math.floor(Math.random() * (listcolor.length))]
spc1 = '         '
spc2 = '\n                           '
spc3 = '                   '
spc4 = '               '

//lib
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc')
const {
    color
} = require('./lib/color')

//lowdb
var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}

const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`database/data.json`)
)

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

// Save Data
if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)

async function startDanzz() {
console.log(color(figlet.textSync('San Xd', {
		font: 'Small',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
	    width: 90,
		whitespaceBreak: true
        }), `${randomcolor}`))
console.log(color(`${spc2}           [ CREATOR BY: SAN XD ]` ,`${randomcolor}`))
console.log(color(`${spc4}                       < =============================== >`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Hai         : i.m ${namabot}`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Bot Version : 1.0.0`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Library     : Baileys Multi Device`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Status      : Online!`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Owner       : ${namaowner}`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Author      : SanXd`, `${randomcolor}`))
console.log(color(`${spc3}                    [•]`, `${randomcolor}`), color(`Base Ori By : SanXd`, `${randomcolor}`))
console.log(color(`${spc4}                       < =============================== >`, `${randomcolor}`))
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const Danzz = DanzzConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['SanXd','Chrome','3.0.0'],
        auth: state,
        version
    })
    
store.bind(Danzz.ev)

Danzz.ev.on('messages.upsert', async chatUpdate => {

        try {
        mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!Danzz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        m = smsg(Danzz, mek, store)
        require("./scripts")(Danzz, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Group Update
    Danzz.ev.on('groups.update', async pea => {
    //console.log(pea)
    try {
    for(let ciko of pea) {
    // Get Profile Picture Group
       try {
       ppgc = await Danzz.profilePictureUrl(ciko.id, 'image')
       } catch {
       ppgc = 'https://tinyurl.com/yx93l6da'
       }
       let wm_fatih = { url : ppgc }
       if (ciko.announce == true) {
       Danzz.send5ButImg(ciko.id, `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (ciko.announce == false) {
       Danzz.send5ButImg(ciko.id, `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (ciko.restrict == true) {
       Danzz.send5ButImg(ciko.id, `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (ciko.restrict == false) {
       Danzz.send5ButImg(ciko.id, `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else {
       Danzz.send5ButImg(ciko.id, `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${ciko.subject}*`, `Group Settings Change Message`, wm_fatih, [])
     }
    }
    } catch (err){
    console.log(err)
    }
    })

    Danzz.ev.on('group-participants.update', async (anu) => {
        console.log(anu)
        try {
            let metadata = await Danzz.groupMetadata(anu.id)
            let participants = anu.participants
            for (let num of participants) {
                // Get Profile Picture User
                try {
                    ppuser = await Danzz.profilePictureUrl(num, 'image')
                } catch {
                    ppuser = 'https://tinyurl.com/yx93l6da'
                }

                // Get Profile Picture Group
                try {
                    ppgroup = await Danzz.profilePictureUrl(anu.id, 'image')
                } catch {
                    ppgroup = 'https://tinyurl.com/yx93l6da'
                }

                if (anu.action == 'add') {
                    Danzz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Hai Kak👋 @${num.split("@")[0]}\nSelamat Datang Di ${metadata.subject}\n\n*INTRO*\n- Nama:\n- Umur:\n- Askot:\n\nJangan Lupa Baca Deskripsi Ya Kak` })
                } else if (anu.action == 'remove') {
                    Danzz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `Selamat Tinggal👋 @${num.split("@")[0]}\nKeluar Dari Grup ${metadata.subject}\n\nKalo Balik Lagi Bawa Gorengan Yo:v` })
                } else if (anu.action == 'promote') {
                    Danzz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Promote From ${metadata.subject}` })
                } else if (anu.action == 'demote') {
                    Danzz.sendMessage(anu.id, { image: { url: ppuser }, mentions: [num], caption: `@${num.split('@')[0]} Demote From ${metadata.subject}` })
              }
            }
        } catch (err) {
            console.log(err)
        }
    })
	
    Danzz.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    Danzz.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = Danzz.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    Danzz.getName = (jid, withoutContact  = false) => {
        id = Danzz.decodeJid(jid)
        withoutContact = Danzz.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = Danzz.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === Danzz.decodeJid(Danzz.user.id) ?
            Danzz.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    Danzz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await Danzz.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await Danzz.getName(i + '@s.whatsapp.net')}\nFN:${await Danzz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	Danzz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    Danzz.setStatus = (status) => {
        Danzz.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
	
    Danzz.public = true

    Danzz.serializeM = (m) => smsg(Danzz, m, store)

    Danzz.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); Danzz.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startDanzz(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startDanzz(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); Danzz.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); Danzz.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startDanzz(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startDanzz(); }
            else Danzz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        console.log('Connected...', update)
    })

    Danzz.ev.on('creds.update', saveState)

    // Add Other
      
      /** Resize Image
      *
      * @param {Buffer} Buffer (Only Image)
      * @param {Numeric} Width
      * @param {Numeric} Height
      */
      Danzz.reSize = async (image, width, height) => {
       let jimp = require('jimp')
       var oyy = await jimp.read(image);
       var kiyomasa = await oyy.resize(width, height).getBufferAsync(jimp.MIME_JPEG)
       return kiyomasa
      }      
      
      /** Send Button 5 Location
       *
       * @param {*} jid
       * @param {*} text
       * @param {*} footer
       * @param {*} location
       * @param [*] button
       * @param {*} options
       */
      Danzz.send5ButLoc = async (jid , text = '' , footer = '', lok, but = [], options = {}) =>{
       let resize = await Danzz.reSize(lok, 300, 150)
       var template = generateWAMessageFromContent(jid, {
       "templateMessage": {
       "hydratedTemplate": {
       "locationMessage": {
       "degreesLatitude": 0,
       "degreesLongitude": 0,
       "jpegThumbnail": resize
       },
       "hydratedContentText": text,
       "hydratedFooterText": footer,
       "hydratedButtons": but
       }
       }
       }, options)
       Danzz.relayMessage(jid, template.message, { messageId: template.key.id })
      }

      /**
      *
      * @param {*} jid
      * @param {*} url
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      */
     Danzz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return Danzz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return Danzz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return Danzz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return Danzz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return Danzz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }

    /** Send List Messaage
      *
      *@param {*} jid
      *@param {*} text
      *@param {*} footer
      *@param {*} title
      *@param {*} butText
      *@param [*] sections
      *@param {*} quoted
      */
        Danzz.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
        let sections = sects
        var listMes = {
        text: text,
        footer: footer,
        title: title,
        buttonText: butText,
        sections
        }
        Danzz.sendMessage(jid, listMes, { quoted: quoted })
        }

    /** Send Button 5 Message
     * 
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} button
     * @returns 
     */
        Danzz.send5ButMsg = (jid, text = '' , footer = '', but = []) =>{
        let templateButtons = but
        var templateMessage = {
        text: text,
        footer: footer,
        templateButtons: templateButtons
        }
        Danzz.sendMessage(jid, templateMessage)
        }

    /** Send Button 5 Image
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} image
     * @param [*] button
     * @param {*} options
     * @returns
     */
    Danzz.send5ButImg = async (jid , text = '' , footer = '', img, but = [], buff, options = {}) =>{
        let resize = await Danzz.reSize(buff, 300, 150)
        let message = await prepareWAMessageMedia({ image: img, jpegThumbnail: resize }, { upload: Danzz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        imageMessage: message.imageMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            Danzz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Video
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Video
     * @param [*] button
     * @param {*} options
     * @returns
     */
    Danzz.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], buff, options = {}) =>{
        let resize = await Danzz.reSize(buff, 300, 150)
        let message = await prepareWAMessageMedia({ video: vid, jpegThumbnail: resize }, { upload: Danzz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            Danzz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Gif
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Gif
     * @param [*] button
     * @param {*} options
     * @returns
     */
    Danzz.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], buff, options = {}) =>{
        let resize = await Danzz.reSize(buff, 300, 150)
        let a = [1,2]
        let b = a[Math.floor(Math.random() * a.length)]
        let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true, jpegThumbnail: resize, gifAttribution: b}, { upload: Danzz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            Danzz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} buttons 
     * @param {*} caption 
     * @param {*} footer 
     * @param {*} quoted 
     * @param {*} options 
     */
    Danzz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        Danzz.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    
    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendText = (jid, text, quoted = '', options) => Danzz.sendMessage(jid, { text: text, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
	let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await Danzz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await Danzz.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await Danzz.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendTextWithMentions = async (jid, text, quoted, options = {}) => Danzz.sendMessage(jid, { text: text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await Danzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await Danzz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	
    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @param {*} attachExtension 
     * @returns 
     */
    Danzz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    Danzz.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
        
	return buffer
     } 
    
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} filename
     * @param {*} caption
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    Danzz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await Danzz.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif')
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await Danzz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }

    /**
     * 
     * @param {*} jid 
     * @param {*} message 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    Danzz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
		if (options.readViewOnce) {
			message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
			vtype = Object.keys(message.message.viewOnceMessage.message)[0]
			delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
			delete message.message.viewOnceMessage.message[vtype].viewOnce
			message.message = {
				...message.message.viewOnceMessage.message
			}
		}

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
		let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await Danzz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }

    Danzz.cMod = (jid, copy, text = '', sender = Danzz.user.id, options = {}) => {
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === Danzz.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }


    /**
     * 
     * @param {*} path 
     * @returns 
     */
    Danzz.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)        
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    return Danzz
}

startDanzz()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
