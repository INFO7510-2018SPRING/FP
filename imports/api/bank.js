import { getBankContract, getPublicOffersContract, readAsList, randHash } from './commons'

const auditorPubKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='

export const makeBuyOffer = ({ i, stockId, unitPrice, shares, buyer }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  const hash = randHash()
  return bankContract.methods.makeBuyOffer(stockId, unitPrice, shares, buyer, hash).send({ privateFor: [auditorPubKey] })
    .then(() => publicOffersContract.methods.makeBuyOffer(stockId, unitPrice, shares, hash).send())
}

export const makeSellOffer = ({ i, stockId, unitPrice, shares, seller }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  const hash = randHash()
  return bankContract.methods.makeSellOffer(stockId, unitPrice, shares, seller, hash).send({ privateFor: [auditorPubKey] })
    .then(() => publicOffersContract.methods.makeSellOffer(stockId, unitPrice, shares, hash).send())
}

export const getBuyOfferList = ({ i }) => {
  const bankContract = getBankContract(i)
  return readAsList(bankContract, 'buyOfferCounter', 'buyOffers')
}

export const getSellOfferList = ({ i }) => {
  const bankContract = getBankContract(i)
  return readAsList(bankContract, 'sellOfferCounter', 'sellOffers')
}

export const getInfo = ({ i }) => {
  const bankContract = getBankContract(i)
  return bankContract.methods.balance().call().then(balance => {
    return bankContract.methods.frozenBalance().call().then(frozenBalance => {
      return bankContract.methods.stockShares(1).call().then(stock1 => {
        return bankContract.methods.stockShares(2).call().then(stock2 => {
          return bankContract.methods.frozenStockShares(1).call().then(frozenStock1 => {
            return bankContract.methods.frozenStockShares(2).call().then(frozenStock2 => {
              return { balance, frozenBalance, stockShares: { '1': stock1, '2': stock2 }, frozenStockShares: { '1': frozenStock1, '2': frozenStock2 } }
            })
          })
        })
      })
    })
  })
}
