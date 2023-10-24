const { Telegraf } = require('telegraf')
const db = require('./database.js')

const bot = new Telegraf('6391908459:AAHp4r1QDDsR18TQLrBgsNWUomwxM9JOWk4')

bot.start((ctx)=>{
    db.getInfoUser(ctx.from.id,(rows)=>{
        if (rows == undefined) {
            db.setUserToTable(ctx.from.id,ctx.from.username)
        }
    })
    ctx.reply(`Привіт, ${ctx.from.username}`,{
        reply_markup: {
            inline_keyboard: [
                [ { text: "Додати своє посилання", callback_data: "link" } ], 

                [ { text: "Шукати посилання", callback_data: "search" } ], 
                
                [ { text: "Скільки у мене монет?", callback_data: "coins" } ] 
            ]
        }
    })

})

bot.action('coins',(ctx)=>{
    db.getInfoUser(ctx.from.id,(rows)=>{
        if (rows == undefined){
            db.setUserToTable(ctx.from.id,ctx.from.username)
        }
        ctx.reply(`У вас ${rows.coins} монет`)
    })
})

bot.command('search',(ctx)=>{  // пошук каналу(посиланя)
    db.getInfoUser(ctx.from.id,(rows)=>{
            
        if (rows != undefined) {
            // if (rows.status != 'search'){
                // db.updateStatus(ctx.from.id,'search')
                db.searchLink(ctx.from.id,bot)
                
            // }
        } else {
            db.setUserToTable(ctx.from.id,ctx.from.username)
            // db.updateStatus(ctx.from.id,'search')
            db.searchLink(ctx.from.id,bot)
        }
    })
    ctx.reply(`Шукаємо канал у таблиці.`)
})

bot.action('search',(ctx)=>{  // пошук каналу(посиланя)
    db.getInfoUser(ctx.from.id,(rows)=>{
            
        if (rows != undefined) {
            // if (rows.status != 'search'){
                // db.updateStatus(ctx.from.id,'search')
                db.searchLink(ctx.from.id,bot)
                
            // }
        } else {
            db.setUserToTable(ctx.from.id,ctx.from.username)
            // db.updateStatus(ctx.from.id,'search')
            db.searchLink(ctx.from.id,bot)
        }
    })
    ctx.reply(`Шукаємо канал у таблиці.`)
})

bot.command('coins',(ctx)=>{
    db.getInfoUser(ctx.from.id,(rows)=>{
        if (rows == undefined){
            db.setUserToTable(ctx.from.id,ctx.from.username)
        }
        ctx.reply(`У вас ${rows.coins} монет`)
    })
})

//определение новоприбівших 

bot.action('apply', async (ctx)=>{
    if (ctx.update.callback_query.message.text.includes('http')){
        try {
            const checkMember = await ctx.telegram.getChatMember(ctx.update.callback_query.message.text.replace('https://t.me/','@'),ctx.from.id)
        if (checkMember.status == 'left'){
            bot.telegram.deleteMessage(ctx.from.id,ctx.update.callback_query.message.message_id)
            ctx.reply('Ви повинні приєднатися до каналу щоб отримати монети.')
        } else {
            bot.telegram.deleteMessage(ctx.from.id,ctx.update.callback_query.message.message_id)
            db.getInfoUser(ctx.from.id,(rows)=>{
                db.updateCoin(ctx.from.id,rows.coins+5)
                ctx.reply(`Вам додали +5 монет, тепер у вас є ${rows.coins}`)
            })
           
        }
    } catch(err){
        console.log(err)
        ctx.reply('Виникла помилка. Можливо канал не знайден або приватний (або власник не додав бота до каналу)')
    } 
        
} else {
    try {
        const checkMember = await ctx.telegram.getChatMember(ctx.update.callback_query.message.text.replace('https://t.me/','@'),ctx.from.id)
        console.log(checkMember)
    if (checkMember.status == 'left'){
        ctx.reply('Ви повинні приєднатися до каналу щоб отримати монети.')
    } else {
        
        bot.telegram.deleteMessage(ctx.from.id,ctx.update.callback_query.message.message_id)
        db.getInfoUser(ctx.from.id,(rows)=>{
            db.updateCoin(ctx.from.id,rows.coins+5)
            ctx.reply(`Вам додали +5 монет, тепер у вас є ${rows.coins+5}`)
        })
       
    }
} catch(err){
    console.log(err)
    ctx.reply('Виникла помилка. Можливо канал не знайден або приватний (або власник не додав бота до каналу)')
} 
    
}
})

async function checkUserOnChannel(ctx,linkPart,idUser){ // 't.me/' 
    try {
        const checkMember = await ctx.telegram.getChatMember(ctx.message.text.replace(linkPart,'@'),idUser)
        if (!checkMember){
            ctx.reply('Ви повинні додати бота до вашого каналу.')
        } else {
            ctx.reply('Оберіть день',{
                reply_markup: {
                    inline_keyboard: [
                        [ { text: "1 День", callback_data: "1" } ], // 50
                    
                        [ { text: "5 Днів", callback_data: "2" } ], // 100
                        
                        [ { text: "10 Днів", callback_data: "3" } ] // 150
                    ]
                }
            })
        }
    } catch(err){
        console.log(err)
        ctx.reply('Канал не знайден або приватний (або ви не додали бота до вашого каналу)')
    } 
}

async function sendLink(ctx,rows){
    if (rows.status == 'link' && rows.link == null){
        if (ctx.message.text.includes('t.me')){
            if (!ctx.message.text.includes(' ')){
                link = ctx.message.text
                
                // console.log(ctx.message.text.replace('https://t.me/','@'))
                // console.log(ctx.message.text.replace('t.me/','@'))
                if (ctx.message.text.includes('http')){
                    checkUserOnChannel(ctx,'https://t.me/',6391908459)
                    // try {
                    //     const checkMember = await ctx.telegram.getChatMember(ctx.message.text.replace('https://t.me/','@'),6391908459)
                    //     if (!checkMember){
                    //         ctx.reply('Ви повинні додати бота до вашого каналу.')
                    //     } else {
                    //         ctx.reply('Оберіть день',{
                    //             reply_markup: {
                    //                 inline_keyboard: [
                    //                     [ { text: "1 День", callback_data: "1" } ], // 50
                        
                    //                     [ { text: "5 Днів", callback_data: "2" } ], // 100
                                        
                    //                     [ { text: "10 Днів", callback_data: "3" } ] // 150
                    //                 ]
                    //             }
                    //         })
                    //     }
                    // } catch(err){
                    //     console.log(err)
                    //     ctx.reply('Канал не знайден або приватний (або ви не додали бота до вашого каналу)')
                    // }
                } else {
                    checkUserOnChannel(ctx,'t.me/',6391908459)
                    // try {
                    //     const checkMember = await ctx.telegram.getChatMember(ctx.message.text.replace('t.me/','@'),6391908459)
                    //     if (!checkMember){
                    //         ctx.reply('Ви повинні додати бота до вашого каналу.')
                    //     } else {
                    //         ctx.reply('Оберіть день',{
                    //             reply_markup: {
                    //                 inline_keyboard: [
                    //                     [ { text: "1 День", callback_data: "1" } ], // 50
                        
                    //                     [ { text: "5 Днів", callback_data: "2" } ], // 100
                                        
                    //                     [ { text: "10 Днів", callback_data: "3" } ] // 150
                    //                 ]
                    //             }
                    //         })
                    //     }
                    // } catch(err){
                    //     console.log(err)
                    //     ctx.reply('Канал не знайден або приватний (або ви не додали бота до вашого каналу)')
                    // }
                    
                }



                // ctx.reply('Ви додали своє посилання до бази даних')
            } else {
                ctx.reply('Вставляйте посилання без пробілу') //вы повино))
            }
            } else if (ctx.message.text.includes('http')){
                ctx.reply('Вставте посилання, у якого є url https://t.me/') //Ви повинно вставити посилання, у якого має url https://t.me/
            }
    } else if (rows.status == 'link' && rows.link != null){
        if (ctx.message.text.includes('http')){
            try {
                const checkMember = await ctx.telegram.getChatMember(ctx.message.text.replace('https://t.me/','@'),6391908459)
                if (!checkMember){
                    ctx.reply('Ви повинні додати бота до вашого каналу.')
                } else {
                    ctx.reply('Оберіть день',{
                        reply_markup: {
                            inline_keyboard: [
                                [ { text: "1 День", callback_data: "1" } ], // 50
                            
                                [ { text: "5 Днів", callback_data: "2" } ], // 100
                                
                                [ { text: "10 Днів", callback_data: "3" } ] // 150
                            ]
                        }
                    })
                }
            } catch(err){
                console.log(err)
                ctx.reply('Канал не знайден або приватний (або ви не додали бота до вашого каналу)')
            }
        } else {
            try {
                const checkMember = await ctx.telegram.getChatMember(ctx.message.text.replace('t.me/','@'),6391908459)
                if (!checkMember){
                    ctx.reply('Ви повинні додати бота до вашого каналу.')
                } else {
                    ctx.reply('Оберіть день',{
                        reply_markup: {
                            inline_keyboard: [
                                [ { text: "1 День", callback_data: "1" } ], // 50
                            
                                [ { text: "5 Днів", callback_data: "2" } ], // 100
                                
                                [ { text: "10 Днів", callback_data: "3" } ] // 150
                            ]
                        }
                    })
                }
            } catch(err){
                console.log(err)
                ctx.reply('Канал не знайден або приватний (або ви не додали бота до вашого каналу)')
            }
            
        }
    } 
}

// bot.command('linkdel',(ctx)=>{
//     db.getInfoUser(ctx.from.id,(rows)=>{
//         if (rows.link){
//             ctx.reply(`Посилання ${rows.link} було видалено й повернено 10 монет.`) // !!!!!!!!!!!
//             // shadow wzard money bang 
//             db.updateCoin(ctx.from.id,rows.coins+10)
//             db.addLink(ctx.from.id,null)
//         } else {
//             ctx.reply('У вас немає посилання')
//         }
//     })
// })

bot.action('link',(ctx)=>{
    db.getInfoUser(ctx.from.id,(rows)=>{
        if (rows != undefined){
            if (rows.status != 'subscribed'){
                if (rows.status != 'link'){
                    db.updateStatus(ctx.from.id,'link')
                    ctx.reply('Добре! Тепер кидайте своє посилання!')
                } else {
                    ctx.reply('Ви вже писали цю команду, вам потрібно лише скинути посилання')
                }
            } else{
                ctx.reply(`Ви вже підписалися, ви зможете використовувати команду link лише у ${rows.expires}`)
            }



        } else {
            db.setUserToTable(ctx.from.id,ctx.from.username)
            db.updateStatus(ctx.from.id,'link')
            ctx.reply('Добре! Тепер кидайте своє посилання!')
        }
    })
})

bot.command('link',(ctx)=>{
    db.getInfoUser(ctx.from.id,(rows)=>{
        if (rows != undefined){
            if (rows.status != 'subscribed'){
                if (rows.status != 'link'){
                    db.updateStatus(ctx.from.id,'link')
                    ctx.reply('Добре! Тепер кидайте своє посилання!')
                } else {
                    ctx.reply('Ви вже писали цю команду, вам потрібно лише скинути посилання')
                }
            } else{
                ctx.reply(`Ви вже підписалися, ви зможете використовувати команду link лише у ${rows.expires}`)
            }



        } else {
            db.setUserToTable(ctx.from.id,ctx.from.username)
            db.updateStatus(ctx.from.id,'link')
            ctx.reply('Добре! Тепер кидайте своє посилання!')
        }
    })
})

bot.on('text', (ctx)=>{
    db.getInfoUser(ctx.from.id, async (rows)=>{
        if (rows != undefined){ 
            sendLink(ctx,rows)
        } else {
            db.setUserToTable(ctx.from.id,ctx.from.username)
            db.updateStatus(ctx.from.id,'link')
            sendLink(ctx,rows)
        }
    })

})

//ментше

function buyDays (coins, days, ctx){
        db.getInfoUser(ctx.from.id,(rows)=>{
            if (rows != undefined){
                if (rows.status == 'link' && rows.coins >= coins){
                    try{
                        db.addLink(ctx.from.id,link)
                        link = undefined
                    }catch(err){
                        console.log(err)
                        ctx.reply('Виникла помилка. Спробуйте ще раз.')
                    }

                    db.updateCoin(ctx.from.id,rows.coins-coins)
                    db.addExpiresDate(ctx.from.id, days)
                    db.updateStatus(ctx.from.id,'subscribed')
                    ctx.reply('Ви додали своє посилання до бази даних')
                } else if (rows.status == 'link'){
                    ctx.reply(`У вас немає ${coins} монет щоб підписатися`)
                    db.updateStatus(ctx.from.id,'active')
                }
            }
        })
}

bot.action("1",(ctx)=>{ 
    buyDays(50, 1, ctx)
})

bot.action("2",(ctx)=>{ 
    buyDays(100, 5, ctx)
})

bot.action("3",(ctx)=>{ 
    buyDays(150, 10, ctx)
})

setInterval(()=>{db.checkDate(bot)},1000)

bot.launch() 