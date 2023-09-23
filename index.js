const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function calculator(){
    
    rl.question('Введiть висоту прямокутника: ', (num1) => {
        rl.question('Введіть довжину прямокутника: ', (num2)=> {
        num1 = parseInt(num1)
        num2 = parseInt(num2)
        let sum = num1+num2
        console.log(`Периметр прямокутника - ${sum*2}`)
        rl.close()
        })
    })
}

calculator()