const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('db.sqlite3')


function createTableUsers(){
    const query = `CREATE TABLE Users(
        id INTEGER PRIMARY KEY,
        username varchar(255),
        status varchar(255),
        coins int,
        link str,
        expires date
    );`
    db.run(query)
}

function setUserToTable(id,username){
    const query = `INSERT INTO Users (id, username, status,coins) VALUES(?, ?, 'active',10000)` 
    db.run(query,[id,username],(err)=>{
        if (err){
            console.error(err)
        }
    })
}

function getInfoUser(id,callback){
    const query = `SELECT * FROM Users WHERE id = ${id}`
    db.get(query,(err,rows)=>{
        callback(rows)
    })
}

function updateCoin(id,coins){
    const query = `UPDATE Users SET coins = ${coins} WHERE id = ${id}`
    db.run(query)
}

function updateStatus(id,status){
    const query = `UPDATE Users SET status = '${status}' WHERE id = ${id}`
    db.run(query)
}

function addExpiresDate(id,days){
    const expiresDate = new Date()
    expiresDate.setMinutes(expiresDate.getMinutes() + days) 
    const query = `UPDATE Users SET expires = '${expiresDate}' WHERE id = ${id}` 
    db.run(query)
}

function checkDate(bot){
    const query = `SELECT expires, id FROM Users`
    db.all(query,(err,res)=>{
        for (let row of res){
            if (new Date() >= new Date(row.expires) && row.expires != null){
                bot.telegram.sendMessage(row.id,'У вас закінчилися підписка.')
                const query = `UPDATE Users SET expires = null, link = null, status = 'active'`
                db.run(query)
                
                
            }
        }

    })
}

function getLinkFromUsers(id,  callback){
    const query = `SELECT * FROM Users WHERE status = 'subscribed' AND id <> ${id}`
    db.all(query, (err, res) => {

        callback(res)
    })
}

// 
// 
// 


function userOnChat(id, bot){
    getInfoUser(id,(rows)=>{
        for (let link of rows.joined){
            console.log(bot.telegram.getChatMember(link, id))
        }
    }) 
}



function searchLink(id, bot){ // ищем рандом ссылку
    getLinkFromUsers(id, async (res)=>{
        if (res.length > 0){
            const index = Math.floor(Math.random()*res.length)
            const randomUser = res[index]
            // if (randomUser.link.includes('http')){
            //     try {
            //         const checkMember = await bot.telegram.getChatMember(randomUser.link.replace('https://t.me/','@'),id)
            //         if (!checkMember){
            bot.telegram.sendMessage(id,randomUser.link,{reply_markup: {
                inline_keyboard: [
                    [ { text: "Підтвердити", callback_data: "apply" } ] // 50
                ]
            }})
            //         } else {
            //             searchLink(id,bot)
                        
            //         }
            //     } catch(err){
            //         console.log(err)
            //     }
            // } else {
            //     try {
            //         const checkMember = await bot.telegram.getChatMember(randomUser.link.replace('t.me/','@'),id)
            //         if (!checkMember){
                        
            //             bot.telegram.sendMessage(id,randomUser.link)
            //         } else {

            //             searchLink(id,bot)
            //         }
            //     } catch(err){
            //         console.log(err)
            //     }
                
            // }
            
            updateStatus(id, 'active')


        } else {
            bot.telegram.sendMessage(id,'Ми не змогли знайти посилання :(')
        }
    })
}

function addLink(id,link){
    const query = `UPDATE Users SET link = '${link}' WHERE id = ${id}`
    db.run(query)
}

const query = "SELECT name FROM sqlite_master WHERE type='table' AND name='Users';"; //находим базу
db.all(query, function(err, rows) {
    if (rows.length > 0) {
        console.warn("Table has already connected");
    } else {
        console.error('Table has not found')
        createTableUsers()
        console.log("Table has connected to the database");
    }
});



module.exports = {
    createTableUsers: createTableUsers,
    setUserToTable: setUserToTable,
    getInfoUser: getInfoUser,
    updateCoin: updateCoin,
    updateStatus: updateStatus,
    getLinkFromUsers: getLinkFromUsers,
    searchLink: searchLink,
    addLink: addLink,
    addExpiresDate: addExpiresDate,
    checkDate: checkDate,
    userOnChat: userOnChat
}