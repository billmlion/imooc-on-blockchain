const path = require('path')
const assert = require('assert')
const Web3 = require('web3')
const ganache = require('ganache-cli')
const BigNumber = require('bignumber.js')


const web3 = new Web3(ganache.provider())

const CourseList = require(path.resolve(__dirname, '../src/compiled/CourseList.json'))
const Course = require(path.resolve(__dirname, '../src/compiled/Course.json'))

let accounts
let courseList
let course

describe('测试课程的智能', () => {
    before(async () => {
        // 测试前的数据初始化
        accounts = await web3.eth.getAccounts()
        console.log(accounts)
        //1.虚拟部署一个合约
        courseList = await new web3.eth.Contract(JSON.parse(CourseList.interface))
            .deploy({ data: CourseList.bytecode })
            .send({
                //最後一個為創建者
                from: accounts[9],
                gas: '5000000'
            })
    })


    it('合约部署成功', async () => {
        assert.ok(courseList.options.address)
    })

    it('测试添加课程', async () => {
        const oldaddress = await courseList.methods.getCourse().call()
        assert.equal(oldaddress.length, 0)

        await courseList.methods.createCourse(
            '蜗牛的React课程',
            'react+redux+reactrouter4开发招聘app',
            web3.utils.toWei('8'),
            web3.utils.toWei('2'),
            web3.utils.toWei('4'),
            '图片的hash'
        )
            .send({
                from: accounts[0],
                gas: '5000000'
            })
        const address = await courseList.methods.getCourse().call()
        assert.equal(address.length, 1)
    })


    it('添加课程的属性', async () => {
        const [address] = await courseList.methods.getCourse().call()
        course = await new web3.eth.Contract(JSON.parse(Course.interface), address)
        const name = await course.methods.name().call()
        const content = await course.methods.content().call()
        const target = await course.methods.target().call()
        const fundingPrice = await course.methods.fundingPrice().call()
        const price = await course.methods.price().call()
        const img = await course.methods.img().call()
        const count = await course.methods.count().call()
        const isOnline = await course.methods.isOnline().call()
        assert.equal(name, '蜗牛的React课程')
        assert.equal(content, 'react+redux+reactrouter4开发招聘app')
        assert.equal(target, web3.utils.toWei('8'))
        assert.equal(fundingPrice, web3.utils.toWei('2'))
        assert.equal(price, web3.utils.toWei('4'))
        assert.equal(img, '图片的hash')
        assert.equal(count, 0)
        assert.ok(!isOnline)

    })


    //TODO:
    //1.ceo才能删除
    //2.索引正确
    it('删除功能', async () => {
        await courseList.methods.createCourse(
            '蜗牛的Vue课程',
            'vue也是个好框架',
            web3.utils.toWei('8'),
            web3.utils.toWei('2'),
            web3.utils.toWei('4'),
            '图片的hash1'
        )
            .send({
                from: accounts[0],
                gas: '5000000'

            })
        const address = await courseList.methods.getCourse().call()
        assert.equal(address.length, 2)

        //1.ceo才能删除
        //2.索引正确
        try {
            await courseList.methods.removeCourse(1).send({
                from: accounts[9],
                gas: '5000000'
            })
            // assert.ok(false)
        } catch (e) {
            console.log(e)
            assert.equal(e.results.reason, 'ceo')
        }

        const address1 = await courseList.methods.getCourse().call()
        assert.equal(address1.length, 1)
    })

    // TODO:??? 合約require約束測試未完成
    it('判断是不是ceo', async () => {
        const isCeo1 = await courseList.methods.isCeo().call({ from: accounts[9] })
         //sb,兼职傻逼---methods.isCeo.call
        const isCeo2 = await courseList.methods.isCeo().call({ from: accounts[0] })
        assert.ok(isCeo1)
        assert.ok(!isCeo2)
    })

    it('金钱转换', () => {
        assert.equal(web3.utils.toWei('2'), '2000000000000000000')

    })

    it('课程购买', async () => {
        await course.methods.buy().send({
            from: accounts[2],
            value: web3.utils.toWei('2')
        })
        const value = await course.methods.users(accounts[2]).call()
        const count = await course.methods.count().call()
        assert.equal(value, web3.utils.toWei('2'))
        assert.equal(count, 1)

        const detail = await course.methods.getDetail().call({ from: accounts[0] })
        assert.equal(detail[9], 0)
        // console.log(detail)

        const detail1 = await course.methods.getDetail().call({ from: accounts[2] })
        assert.equal(detail1[9], 1)

        const detail3 = await course.methods.getDetail().call({ from: accounts[3] })
        assert.equal(detail3[9], 2)
    })


    it('还没上线，不入账', async () => {
        //   web3.eth.getBalance(accounts[0]).then(console.log);
        const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
        await course.methods.buy().send({
            from: accounts[3],
            value: web3.utils.toWei('2')
        })
        const newBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
        const diff = newBlance.minus(oldBlance)
        // console.log(oldBlance + ':' + newBlance)
        assert.equal(diff, 0)
    })


    it('还没上线，不能上传视频', async () => {
        try {
            await course.methods.addVideo('video的hash')
                .send({
                    from: accounts[0],
                    gas: '5000000'
                })
            //  assert.ok(false)
        } catch (e) {
            // console.log(e.message)
            // console.log(e)
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }
    })

    it('课程不能重复购买', async () => {

        try {
            await course.methods.buy()
                .send({
                    from: accounts[2],
                    value: web3.utils.toWei('2')
                })
            assert.ok(false)
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }

    })

    it('课程必须是众筹价格', async () => {
        try {
            await course.methods.buy()
                .send({
                    from: accounts[3],
                    value: web3.utils.toWei('2')
                })
            // assert.ok(false)
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }
    })

    it('众筹上线后，钱到账', async () => {
        const oldBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

        //8 众筹价是2，需要买4次就可以上线
        try {
            await course.methods.buy()
                .send({
                    from: accounts[4],
                    value: web3.utils.toWei('2')
                })
            await course.methods.buy()
                .send({
                    from: accounts[5],
                    value: web3.utils.toWei('2')
                })
            // assert.ok(false)
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }

        const count = await course.methods.count().call()
        const isOnline = await course.methods.isOnline().call()
        assert.equal(count, 4)
        assert.ok(isOnline)
        const newBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))
        const diff = newBlance.minus(oldBlance)
        assert.equal(diff, web3.utils.toWei('8'))
    })

    it('课程必须是线上价格的2倍', async () => {
        try {
            await course.methods.buy()
                .send({
                    from: accounts[6],
                    //线上价格的2倍
                    value: web3.utils.toWei('4')
                })
            // assert.ok(false)
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }
        const count = await course.methods.count().call()
        assert.equal(count, 5)
    })


    it('上线之后购买 有分成收益', async () => {
        const oldCeoBlance = new BigNumber(await web3.eth.getBalance(accounts[9]))
        const oldOwnerBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

        try {
            await course.methods.buy()
                .send({
                    from: accounts[7],
                    //线上价格的2倍
                    value: web3.utils.toWei('4')
                })
            // assert.ok(false)
        } catch (e) {
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }

        const newCeoBlance = new BigNumber(await web3.eth.getBalance(accounts[9]))
        const newOwnerBlance = new BigNumber(await web3.eth.getBalance(accounts[0]))

        const diffCeo = newCeoBlance.minus(oldCeoBlance)
        const diffOwner = newOwnerBlance.minus(oldOwnerBlance)
        // const count = await course.methods.count().call()
        assert.equal(diffCeo, web3.utils.toWei('0.4'))
        assert.equal(diffOwner, web3.utils.toWei('3.6'))
    })

    it('上线后，可以上传视频', async () => {
        try {
            await course.methods.addVideo('video的hash')
                .send({
                    from: accounts[0],
                    gas: '5000000'
                })
            //  assert.ok(false)
        } catch (e) {
            // console.log(e.message)
            // console.log(e)
            assert.equal(e.message, 'VM Exception while processing transaction: revert')

        }
        const video = await course.methods.video().call()
        assert.equal(video, 'video的hash')
    })


})