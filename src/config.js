import ipfsApi from 'ipfs-api'
import { expression } from '@babel/template'
import { notification, message } from 'antd'
import Web3 from 'web3'
import CourseList from '../src/compiled/CourseList.json'
import Course from '../src/compiled/Course.json'
import address from './address'



let ipfs = ipfsApi("ipfs.infura.io", "5001", { "protocol": "https" })
let ipfsPrefix = "https://ipfs.infura.io:5001/api/v0/cat?arg="


let web3
if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
} else {
    notification.error({
        message: '没有检测到以太坊',
        description: '请安装metaMask或者激活'
    })
}

let courseListContract = new web3.eth.Contract(JSON.parse(CourseList.interface), address)
// let courseContract = new web3.eth.Contract(JSON.parse(Course.interface),address)
let getCourseContract = (addr) => new web3.eth.Contract(JSON.parse(Course.interface), addr)


function saveImageToIpfs(file) {
    const hide = message.loading('上传中')
    return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = async () => {
            const buffer = Buffer.from(reader.result)
            const res = await ipfs.add(buffer)
            console.log(res)
            hide()
            resolve(res[0].hash)
        }
    })
}

export { ipfs, ipfsPrefix, saveImageToIpfs, web3, courseListContract, getCourseContract}