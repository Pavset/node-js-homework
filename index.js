const { Telegraf } = require('telegraf') //імпортування Telegraf
const sqlite3 = require('sqlite3').verbose() // імпорт sqlite3

const bot = new Telegraf('6373366804:AAE5_alofKpDkRmufoFt3XjEIhcOJufKUgM')//створення бота

const db = new sqlite3.Database('db.sqlite3')//створення бази даних


// створення таблиці User
function createUserTable(){
    const query = `CREATE TABLE Users(
        id INTEGER PRIMARY KEY,
        status varchar(255),
        friend int
    );`
    db.run(query)
}
// createUserTable()

//додавання користувача 
function addUser(id){
    const query = `INSERT INTO Users (id, status) VALUES(?,?)`
    db.run(query, [id,"in_search"])
}

//отримання даних користувача з таблиці
function getUser(id, callback){
    const query = `SELECT status, friend FROM Users WHERE id = ${id}`
    db.get(query, (err, res) => {
        callback(res)
    } )
}

//оновлення статусу користувача
function updateStatus(id, status){
    const query = `UPDATE Users SET status = '${status}' WHERE id = ${id}`
    db.run(query)
}


//оновлення статусу співрозмовника
function updateFriend(id, friend){
    const query = `UPDATE Users SET friend = ${friend} WHERE id = ${id}`
    db.run(query)
}

//отримання користувача з стаусом in_search
function getInSearchUsers(id, callback){
    const query = `SELECT id FROM Users WHERE status = 'in_search' AND id <> ${id}`
    db.all(query, (err, res) => {
        callback(res)
    })
}

//пошук користувача
function findFriend(id){
    getInSearchUsers(id,(res)=>{
        if (res.length > 0){//перевірка чи існує такий користувач
            const index = Math.floor(Math.random()*res.length)
            const randomUser = res[index]
            updateStatus(id, 'meet')
            updateStatus(randomUser.id, 'meet')
            updateFriend(id, randomUser.id)
            updateFriend(randomUser.id, id)
            bot.telegram.sendMessage(randomUser.id,"Співрозмовника знайдено. Можете спілкуватись")
            bot.telegram.sendMessage(id,"Співрозмовника знайдено. Можете спілкуватись")
        }
    })
}

//якщо користувач запустив бота
bot.start((ctx) =>{
    getUser(ctx.from.id, (res) => {
        if (res){
            if(res.status == "standart"){
                updateStatus(ctx.from.id, "in_search");
                ctx.reply('Шукаємо співрозмовника')
                findFriend(ctx.from.id)
            } else if(res.status == "in_search"){
                ctx.reply('Ми вже шукаємо співрозмовника')
            } else if(res.status == "meet"){
                ctx.reply('У вас вже є співрозмовник напишіть /stop щоб зупинити бесіду')
            }
        } else{
            addUser(ctx.from.id)
            ctx.reply('Шукаємо співрозмовника')
            findFriend(ctx.from.id)
        }
    })
})

//прервання розмови
bot.command("stop", (ctx)=>{
    getUser(ctx.from.id, (res)=>{
        if (res){
            if (res.status == "meet"){
                updateStatus(ctx.from.id, "standart")
                updateFriend(ctx.from.id, null)
                updateStatus(res.friend, 'standart')
                updateFriend(res.friend, null)
                ctx.reply('Розмову закінчено.')
                bot.telegram.sendMessage(res.friend,'Співрозмовник завершив бесіду.')
            } else{
                ctx.reply("У вас немає співрозмовника.")
            }
        }
    })
})
// відправка повідомлень
bot.on('text',(ctx)=>{
    getUser(ctx.from.id,(res)=>{
        if (res){
            if (res.status == 'meet'){
                bot.telegram.sendMessage(res.friend,ctx.message.text)
            } else {
                ctx.reply('З ким ви спілкуєтесь?')
            }
        } else {
            ctx.reply('Напишіть /start щоб знайти співрозмовника.')
        }
    })
})

bot.launch()  

