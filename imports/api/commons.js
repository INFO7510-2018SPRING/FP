const fs = require('fs')
const path = require('path')

const Web3 = require('web3')

const getContractDir = () => {
  const root = path.dirname(path.dirname(path.dirname(path.dirname(path.dirname(process.cwd())))))
  return path.join(root, 'imports/contracts')
}

const deployedJSONPath = path.join(getContractDir(), 'deployedContractAddress.json')
const deployed = JSON.parse(fs.readFileSync(deployedJSONPath))

const walletAddresses = [
  '0xed9d02e382b34818e88b88a309c7fe71e65f419d',
  '0xca843569e3427144cead5e4d5999a3d0ccf92b8e',
  '0x0fbdc686b912d7722dc86510934589e0aaf3b55a',
  '0x9186eb3d20cbd1f5f992a950d808c4495153abd5',
  '0x0638e1574728b6d862dd5d3a3e0942c3be47d996'
]

const getAbi = name => {
  const abiPath = path.join(getContractDir(), `build/${name}_sol_${name}.abi`)
  return JSON.parse(fs.readFileSync(abiPath))
}

const getWeb3 = i => {
  i = i || 4
  return new Web3(`http://localhost:2200${i + 1}`)
}

const getOptions = i => ({ from: walletAddresses[i], gasPrice: 0, gas: 1000000000 })

export const getStockContract = i => {
  const web3 = getWeb3(i)
  return new web3.eth.Contract(getAbi('Stock'), deployed.stock, getOptions(i))
}

export const getBankContract = (i, j) => {
  const web3 = getWeb3(i)
  if (j === undefined) {
    j = i
  }
  return new web3.eth.Contract(getAbi('Bank'), deployed.bank[j], getOptions(i))
}

export const getPublicOffersContract = i => {
  const web3 = getWeb3(i)
  return new web3.eth.Contract(getAbi('PublicOffers'), deployed.publicOffers, getOptions(i))
}

export const readAsList = (contract, counter, mapping) => contract.methods[counter]().call()
  .then(i => {
    return Promise.all(
      new Array(parseInt(i)).fill(undefined)
        .map((_, idx) => contract.methods[mapping](idx + 1).call())
    ).then(x => {
      console.log(`readAsList, ${counter}: ${i}, mapping: ${mapping} \n`, x)
      return x
    })
  })