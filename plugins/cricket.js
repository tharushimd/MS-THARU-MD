const Aqua = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const axios = require('axios');
const cheerio = require("cheerio");
const Config = require('../config');
let wk = Config.WORKTYPE == 'public' ? false : true
const Language = require('../language');
const Lang = Language.getString('scrapers');
var SDESC = ''
if (Config.LANG == 'EN')  SDESC = 'It sends live cricket matches score links from cricbuzz.'
if (Config.LANG == 'SI')  SDESC = 'එය cricbuzz සජීවී ලකුණු පුවරු ලින්ක් ගෙන එයි.'

var GDESC = ''
if (Config.LANG == 'EN')  GDESC = 'it sends cricket matches live score'
if (Config.LANG == 'SI')  GDESC = 'එය ක්‍රිකට් තරග වල සජීවී ලකුණු ගෙන එයි'

var NEED_LINK = ''
if (Config.LANG == 'EN')  NEED_LINK = '*🧜‍♀️🧜‍♂️Please provide a link from cricbuzz.com.*\n*The .getcric command also provides the same link.*'
if (Config.LANG == 'SI')  NEED_LINK = '*🧜‍♀️🧜‍♂️කරුණාකර cricbuzz.com වෙතින් ලින්ක් එකක් ලබා දෙන්න.* \n*.getcric විධානය මගින්ද එම ලින්ක් ලබා ගත හැකිය.*'


Aqua.addCommand({ pattern: 'getcric$ ?(.*)', fromMe: wk, desc:SDESC, deleteCommand: false }, async (message, match) => {
	
var load = await message.client.sendMessage(message.jid,Lang.SEARCHING,MessageType.text, {quoted: message.data});

	
const srch = await axios.get('https://www.cricbuzz.com/api/html/matches-menu')
const $ = cheerio.load(srch.data)

			let tit = [];
			let lin = [];
      const result = [];
      const res = $('div.cb-mtch-all > a')
      $('div.cb-mtch-all > a').each(function(c, d) {
       const name = $(d).text().trim()
				tit.push(name); })
          $('div.cb-mtch-all > a') .each(function(e, f) {     const url1 =  $(f).attr('href') 
        lin.push(url1);})
       for ( let i = 0; i < res.length; i++) {
        result.push({
				title: tit[i],
				link: lin[i],
                })
                
			}
            
	    
	 get_result = result 
 srh_data = ""
        for (var x of get_result) {
        srh_data += `🏏  Match : *${x.title}*\n`
        srh_data += `🖇️  Link :` + 'https://cricbuzz.com' + x.link + `\n`
        srh_data += `─────────────────\n\n`
        }

await message.client.sendMessage(message.jid, '╔═══════════════╗\n║  *🎾AQUA Cricbuzz Search🎾* ║\n╚═══════════════╝\n\n' + srh_data,MessageType.text, {quoted: message.data});
  return await message.client.deleteMessage(message.jid, {id: load.key.id, remoteJid: message.jid, fromMe: true})
  }
  )
Aqua.addCommand({ pattern: 'cric ?(.*)', fromMe: wk, desc:GDESC, deleteCommand: false}, async (message, match) => {

        if (!match[1]) return await message.client.sendMessage(message.jid,NEED_LINK,MessageType.text)
	if (!match[1].includes('cricbuzz.com')) return await message.client.sendMessage(message.jid,NEED_LINK,MessageType.text)
       const id = match[1].replace("https://www.cricbuzz.com/live-cricket-scores/","")
       const id2 = id.replace("https://m.cricbuzz.com/live-cricket-scores/","")
       const id3 = id2.replace("https://cricbuzz.com/live-cricket-scores/","")
        await axios
          .get(`https://sanuwa-cricket.vercel.app/cri.php?url=https://www.cricbuzz.com/live-cricket-scores/${id3}`)
          .then(async (response) => {
           
       if (response.data.livescore.title == 'Data Not Found') {
             const msg = '*⛔The Match Did Not Start or Invaild Match ID*'
             await message.client.sendMessage(message.jid, msg, MessageType.text, { quoted: message.data });
       }else if (response.data.livescore.batsman == 'Data Not Found'){ 
           const tmone = response.data.livescore.teamone
           const teamone = tmone.replace("Data Not Found","not yet")
           const tmtwo = response.data.livescore.teamtwo
           const teamtwo = tmtwo.replace("Data Not Found","not yet")
           
             const msgg = '*' + response.data.livescore.title + '*\n\n```' + response.data.livescore.update + '```\n──────────────\n\n🏏' + teamone + '\n\n🏏' + teamtwo + '\n──────────────'
              await message.client.sendMessage(message.jid, msgg, MessageType.text, { quoted: message.data }); 
           
           
       }else {  
           
           const bowler1 = response.data.livescore.bowler
           const bowlerone = bowler1.replace("Data Not Found","_")
           const bowler1over = response.data.livescore.bowlerover
           const bowleroneover = bowler1over.replace("Data Not Found","")
           
           const bowler2 = response.data.livescore.bowlertwo
           const bowlertwo = bowler2.replace("Data Not Found","_")
           const bowler2over = response.data.livescore.bowletworover
           const bowlertwoover = bowler2over.replace("Data Not Found","")
           const bowlertworuns = response.data.livescore.bowlertworuns
           const bowler2run = bowlertworuns.replace("Data Not Found","")
            const mesg = `*${response.data.livescore.title}*\n━━━━━━━━━━━━━━━\n_${response.data.livescore.update}_\n☬ *${response.data.livescore.current}*\n${response.data.livescore.runrate}\n─────────────\n\n​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n🏏BATTING\n*👨‍🦰 ${response.data.livescore.batsman}: ${response.data.livescore.batsmanrun}${response.data.livescore.ballsfaced}\n4s: ${response.data.livescore.fours}\n6s: ${response.data.livescore.sixes}\nsr: ${response.data.livescore.sr}\n*👨‍🦰 ${response.data.livescore.batsmantwo}*: ${response.data.livescore.batsmantworun}${response.data.livescore.batsmantwoballsfaced}\n4s: ${response.data.livescore.batsmantwofours}\n6s: ${response.data.livescore.batsmantwosixes}\nsr: ${response.data.livescore.batsmantwosr}\n───────────────\n🅿️Partnership: ${response.data.livescore.partnership}\n─────────────\n🥎BOWLING*\n*👨‍🦰 ${bowlerone}: ${response.data.livescore.bowlerruns}-${response.data.livescore.bowlerwickets} (${bowleroneover})\n*👨‍🦰 ${bowlertwo}*: ${bowler2run}-${response.data.livescore.bowlertwowickets} (${bowlertwoover})\n─────────────\n🎳LAST WICKET\n${response.data.livescore.lastwicket}\n─────────────`
        
          

        await message.client.sendMessage(message.jid,mesg, MessageType.text, { quoted: message.data })}
        
        })
        
           
      }) 
