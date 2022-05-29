// modules externo
const inquirer = require('inquirer')
const chalk = require('chalk')

//modules interno 
const fs = require('fs')
const { get } = require('http')
operation()
function operation() {
    inquirer.prompt([
        {
            type:'list',
            name:'action',
            message:'Oque você deseja fazer ?',
            choices:['Cria conta','Consultar Saldo','Depositar','Sacar','Sair'],
        }
    ])
    .then((answer)=>{
        const action = answer['action']
        if(action === 'Cria conta'){
            createAccount()
        }else if(action === 'Consultar Saldo'){
            getAccountBalance()
        }else if(action === 'Depositar'){
            deposit()
        }else if(action === 'Sacar'){
            widthdraw()
        }else{
            msgCongratu('Volte Sempre, Obrigado por usa nosso Banco!')
            process.exit()
        }
    })
    .catch(err => console.log(err))
}
// metodo para cria conta 
function Idaccount(){
    // identificador conta
    let random = Math.random().toString().substr(-6)

    return random
}

//create account
function createAccount(){
    
    const random = Idaccount()
    console.log(chalk.bgGray.white.bold(`Parabéns por escolhe nosso banco`))
    console.log(chalk.green(`Defina as Opções da sua conta a seguir`))
    biuldAccount()
}
function biuldAccount(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Digite um nome para sua conta:'
        }
    ])
    .then((answer)=>{
        const accountName = answer['accountName']
        console.info(accountName)
        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }
        if(fs.existsSync(`accounts/${accountName}.json`)){
            msgErro('Esta conta já existe, escolha outro nome!')
            //console.log(chalk.bgRed.white())
            biuldAccount()
            return
        }
    
        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', 
            function (err){
                console.log(err)
            }
        )
        msgSuccess(`Parabéns sua conta foi Criada.`)
        operation()
    })
    .catch(err=>console.log(err))
    
}

//add an amount to user account
function deposit(){
    inquirer.prompt([
        {
            name:'accountName',
            message:'Qual nome da sua conta ?'
        }
    ])
    .then((answer)=>{
        const accountName = answer['accountName']
        // verify if account exists
        if(!checkAccount(accountName)){
            return deposit()
        }
        inquirer.prompt([
            {
                name:'amount',
                message:'Quanto voce deseja depositar ?'
            }
        ])
        .then((answer)=>{
            const amount = answer['amount']

            //add an amount
            addAmount(accountName, amount)
            operation()            
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

function checkAccount(e){
    if(!fs.existsSync(`accounts/${e}.json`)){
        msgErro('Esta conta não existe, tente novamente!')
        return false
    }

    return true
}

function addAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        msgErro('Ocorreu um erro retorne mais tarde!')
        return deposit()
    }
    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
    fs.writeFileSync(
       `accounts/${accountName}.json`,
       JSON.stringify(accountData),
       function (err){
           console.log(err)
       }
    )
    console.log(msgSuccess(`Foi depositado o valor de ${amount} na sua conta!`))
}

function getAccount(account){
    const accountJson = fs.readFileSync(`accounts/${account}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(accountJson)
}
// show account balance
function getAccountBalance(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual a sua conta ?'
        }
    ])
    .then((answer)=>{
        const accountName = answer['accountName']

        // verifty if account exists
        if(!checkAccount(accountName)){
            return getAccountBalance()
        }
        const accountData = getAccount(accountName)
        msgCongratu(`O saldo da sua conta é de R$ ${accountData.balance}`)
        operation()
    }).catch(err=>console.log(err))
}
// widthdraw an amount from user account
function widthdraw(){
    inquirer.prompt([
        {
            name:'accountName',
            message: 'Qual a sua conta ?'
        }
    ])
    .then((answer)=>{
        const accountName = answer['accountName']

        // verifty if account exists
        if(!checkAccount(accountName)){
            return widthdraw()
        }
        inquirer.prompt([
            {
                name:'widthdrawValue',
                message: 'Quanto deseja saca ?'
            }
        ]).then((answer)=>{
            const widthdrawValue = answer['widthdrawValue']
            removeAmount(accountName, widthdrawValue)
            
            
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
}


function removeAmount(accountName, amount){
    const accountData = getAccount(accountName)

    if(!amount){
        msgErro('Ocorreu um erro retorne mais tarde!')
        return widthdraw()
    }
    if(accountData.balance < amount){
        msgErro('Valor indisponível!')
        return widthdraw()
    }
    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)
    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err){
            console.log(err)
        }
    )
    console.log(msgSuccess(`Foi Sacado o valor de ${amount} da sua conta!`))
        operation()
    
}
function msgErro(e){
    console.log(chalk.bgRed.white.bold(e))
}
function msgSuccess(e){
    console.log(chalk.bgGreen.white(e))
}
function msgCongratu(e){
    console.log(chalk.bgBlue(e))
}