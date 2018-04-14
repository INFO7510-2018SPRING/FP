#!/usr/bin/env node

const fs = require('fs')
const Web3 = require('web3')
const yaml = require('js-yaml')

const tmPubKeys = [
  'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=',
  'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
  'oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=',
  'R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=',
  'UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y='
]
const walletAddresses = [
  '0xed9d02e382b34818e88b88a309c7fe71e65f419d',
  '0xca843569e3427144cead5e4d5999a3d0ccf92b8e',
  '0x0fbdc686b912d7722dc86510934589e0aaf3b55a',
  '0x9186eb3d20cbd1f5f992a950d808c4495153abd5',
  '0x0638e1574728b6d862dd5d3a3e0942c3be47d996'
]

const auditor = { tmPubKey: tmPubKeys[0], walletAddress: walletAddresses[0] }
const bank1 = { tmPubKey: tmPubKeys[1], walletAddress: walletAddresses[1] }
const bank2 = { tmPubKey: tmPubKeys[2], walletAddress: walletAddresses[2] }
const bank3 = { tmPubKey: tmPubKeys[3], walletAddress: walletAddresses[3] }

const web3s = [1, 2, 3, 4, 5].map(i => new Web3(`http://localhost:2200${i}`))
const auditorWeb3 = web3s[0]

const loadContract = name => ({
  abi: JSON.parse(fs.readFileSync(`./build/${name}_sol_${name}.abi`)),
  data: '0x' + fs.readFileSync(`./build/${name}_sol_${name}.bin`).toString()
})

const BankContract = loadContract('Bank')
BankContract.instances = new Array(4)

const StockContract = loadContract('Stock')

const PublicOffersContract = loadContract('PublicOffers')
PublicOffersContract.instances = new Array(4)

const fixtures = yaml.safeLoad(fs.readFileSync('./fixtures.yaml'))
const defaultOptions = {
  from: auditor.walletAddress,
  gas: 1000000000,
  gasPrice: 0
}

const deployStockContract = () => new auditorWeb3.eth.Contract(StockContract.abi)
  .deploy({ data: StockContract.data })
  .send(defaultOptions)
  .then(instance => {
    StockContract.instance = instance
    const address = instance.options.address
    console.log(`Stock contract mined: ${address}`)
    instance.options = Object.assign(instance.options, defaultOptions)
    return Promise.all(fixtures.Stock.map(
      stock => {
        console.log('Adding stock: ', stock)
        return instance.methods.addStock(stock.name).send()
          .then(() => instance.methods.stocks(stock.id).call())
          .then(res => console.log(`Getting stocks ${stock.id}: ${JSON.stringify(res)}`))
      }
    ))
  })

const deployPublicOffersContract = () => new auditorWeb3.eth.Contract(PublicOffersContract.abi)
  .deploy({ data: PublicOffersContract.data })
  .send(defaultOptions)
  .then(instance => {
    const address = instance.options.address
    console.log(`PublicOffers contract mined: ${address}`)
    PublicOffersContract.instances[0] = instance
    PublicOffersContract.instances[0].options = Object.assign(instance.options, defaultOptions)
    let arr = [1, 2, 3]
    arr.map(i => {
      const publicOffersContract = new web3s[i].eth.Contract(PublicOffersContract.abi, address)
      publicOffersContract.options = Object.assign(publicOffersContract.options, { gas: 1000000000, gasPrice: 0, from: walletAddresses[i] })
      PublicOffersContract.instances[i] = publicOffersContract
    })
    return Promise.all(
      [bank1, bank2, bank3].map((bank, i) => {
        console.log(`Adding bank ${i + 1} to publicOffers`)
        return instance.methods.addBank(bank.walletAddress).send()
          .then(() => instance.methods.banks(bank.walletAddress).call())
          .then(res => console.log(`Getting banks ${i + 1}: ${JSON.stringify(res)}`))
      })
    )
  })

const deployBankContract = iBank => {
  let bankContract
  const bankFixtures = fixtures['Bank'][iBank.toString()]
  return new auditorWeb3.eth.Contract(BankContract.abi)
    .deploy({
      data: BankContract.data,
      arguments: [walletAddresses[iBank]]
    })
    .send(Object.assign(defaultOptions, {
      privateFor: [tmPubKeys[iBank]]
    }))
    .then(instance => {
      instance.options = Object.assign(instance.options, defaultOptions)
      bankContract = instance
      const address = bankContract.options.address
      console.log(`Contract for bank${iBank} mined: ${address}`)
      BankContract.instances[iBank] = instance
    }).then(() => {
      console.log(`Setting initial balance for bank ${iBank}: ${bankFixtures.balance}`)
      return bankContract.methods.setBalance(bankFixtures.balance).send({ privateFor: [tmPubKeys[iBank]] })
        .then(() => bankContract.methods.balance().call())
        .then(res => console.log(`Getting balance for bank ${iBank}: ${res}`))
    }).then(() => {
      return Promise.all(Object.keys(bankFixtures.stockShares).map(id => {
        const shares = bankFixtures.stockShares[id]
        console.log(`Setting initial stockShares for bank ${iBank}, stock: ${id}, shares: ${shares}`)
        return bankContract.methods.setStockShare(id, shares).send({ privateFor: [tmPubKeys[iBank]] })
          .then(() => bankContract.methods.stockShares(id).call())
          .then(res => console.log(`Getting initial stockShares for bank ${iBank}, stock: ${id}, shares: ${res}`))
      }))
    })
}

const getBankContract = iBank => {
  const address = BankContract.instances[iBank].options.address
  const options = Object.assign(defaultOptions, { from: walletAddresses[iBank] })
  return Promise.resolve(new web3s[iBank].eth.Contract(BankContract.abi, address, options))
}

const makeOffers = iBank => {
  const bankFixtures = fixtures['Bank'][iBank.toString()]
  let bankContract
  return getBankContract(iBank)
    .then(instance => {
      bankContract = instance
    })
    .then(() => {
      console.log(`Making buy offer for bank ${iBank}`)
      return Promise.all(bankFixtures['buy'].map(data => {
        console.log(`\tBuying: ${JSON.stringify(data)}`)
        return bankContract.methods.makeBuyOffer(data.stockId, data.unitPrice, data.shares, data.buyer).send({ privateFor: [auditor.tmPubKey] })
          .then(() => PublicOffersContract.instances[iBank].methods.makeBuyOffer(data.stockId, data.unitPrice, data.shares).send())
          .then(() => PublicOffersContract.instances[iBank].methods.buyOfferCounter().call())
          .then(res => console.log('\tPublicOffersContract.buyOfferCounter:' + res))
      }))
    })
    .then(() => {
      console.log(`Making sell offer for bank ${iBank}`)
      return Promise.all(bankFixtures['sell'].map(data => {
        console.log(`\tSelling: ${JSON.stringify(data)}`)
        return bankContract.methods.makeSellOffer(data.stockId, data.unitPrice, data.shares, data.seller).send({ privateFor: [auditor.tmPubKey] })
          .then(() => PublicOffersContract.instances[iBank].methods.makeSellOffer(data.stockId, data.unitPrice, data.shares).send())
          .then(() => PublicOffersContract.instances[iBank].methods.sellOfferCounter().call())
          .then(res => console.log('\tPublicOffersContract.sellOfferCounter:' + res))
      }))
    })
}

const saveToJSON = () => {
  const deployed = {
    stock: StockContract.instance.options.address,
    bank: BankContract.instances.map(instance => instance.options.address),
    publicOffers: PublicOffersContract.instances[0].options.address
  }
  fs.writeFileSync('./deployedContractAddress.json', JSON.stringify(deployed, null, 2))
  console.log('saved')
}

Promise.resolve()
  .then(() => console.log('=== Stock ==='))
  .then(deployStockContract)
  .then(() => console.log('\n=== PublicOffers ==='))
  .then(deployPublicOffersContract)
  .then(() => console.log('\n=== Bank ==='))
  .then(() => deployBankContract(1))
  .then(() => deployBankContract(2))
  .then(() => deployBankContract(3))
  .then(() => console.log('\n=== Offer ==='))
  .then(() => makeOffers(1))
  .then(() => makeOffers(2))
  .then(() => makeOffers(3))
  .then(() => console.log('\n=== Saving to JSON ==='))
  .then(saveToJSON)
