import { getBankContract, getPublicOffersContract, readAsList, randHash, rejectRequest as _rejectRequest, approveRequest as _approveRequest } from './commons'

const auditorPubKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='

const makeBuyOffer = ({ i, stockId, unitPrice, shares, requestId, buyer }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  const hash = randHash()
  console.log(requestId, hash)
  console.log('params: ', stockId, unitPrice, shares, buyer, requestId, hash)
  return bankContract.methods.makeBuyOffer(stockId, unitPrice, shares, buyer, requestId, hash).send({ privateFor: [auditorPubKey] })
    .on('transactionHash', console.log)
    .then(() => publicOffersContract.methods.makeBuyOffer(stockId, unitPrice, shares, hash).send())
}

const makeSellOffer = ({ i, stockId, unitPrice, shares, requestId, seller }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  const hash = randHash()
  return bankContract.methods.makeSellOffer(stockId, unitPrice, shares, seller, requestId, hash).send({ privateFor: [auditorPubKey] })
    .then(() => publicOffersContract.methods.makeSellOffer(stockId, unitPrice, shares, hash).send())
}

export const approveRequest = ({ iBank, type, offer, address, _id }) => {
  _approveRequest({ _id })
  const args = {
    stockId: parseInt(offer.stockId),
    unitPrice: parseInt(offer.unitPrice),
    shares: parseInt(offer.shares),
    i: iBank,
    requestId: _id
  }
  if (type === 'sell') {
    args.buyer = address
    return makeBuyOffer(args)
  } else {
    args.seller = address
    return makeSellOffer(args)
  }
}

export const rejectRequest = ({ _id }) => {
  _rejectRequest({ _id })
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
