const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})


function calculator(){
    console.log('Квадратне рівняння ax^2 + bx +c')
    rl.question('Введiть коєфіцієнт a: ', (num1) => {
        rl.question('Введiть коєфіцієнт b: ', (num2)=> {
            rl.question('Введiть коєфіцієнт c: ', (num3)=> {
                a = parseFloat(num1)
                b = parseFloat(num2)
                c = parseFloat(num3)
                
                let D = b**2 - (4*a*c)
                console.log(D)

                if (D < 0){
                    console.log('Коренів немає')
                }
                else{
                    let x1 = (-b + Math.sqrt(D)) / (2*a)
                    let x2 = (-b - Math.sqrt(D)) / (2*a)

                    console.log(`Корінь x1 - ${x1}`)
                    console.log(`Корінь x2 - ${x2}`)
                }

                rl.close()
            })
        })
    })
}

calculator()