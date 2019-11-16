//部署合约到ropsten测试环境

const path = require('path')
const Web3 = require('web3')
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs')

const contractPath = path.resolve(__dirname, '../src/compiled/CourseList.json')
const { interface, bytecode } = require(contractPath)

const provider = new HDWalletProvider('shoe nut spy clap squeeze artefact sunny gorilla awake milk away lawsuit',
    'https://ropsten.infura.io/v3/4596285aa3b54016aec5caa075fd0976')


const web3 = new Web3(provider);//由于紧接自执行函数，必须加分号，否则出错TypeError: (intermediate value) is not a function




(async () => {
    console.log('自执行')
    const accounts = await web3.eth.getAccounts()
    console.log('合约部署的账号' + accounts)
    console.time('合约部署消耗时间')
    const reslut = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({
            from: accounts[0],
            gas: '5000000'
        })

    console.timeEnd('合约部署消耗时间')
    console.log(reslut.options.address)
    const contractAddress = reslut.options.address
    console.log('合约部署成功' ,contractAddress)
    console.log('合约查看地址',`https://ropsten.etherscan.io/address/${contractAddress}`)

    const addressFile = path.resolve(__dirname,'../src/address.js')
    fs.writeFileSync(addressFile,"export default " + JSON.stringify(contractAddress))
    console.log("地址写入成功", addressFile)
})()