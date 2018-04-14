import { getBankContract, getPublicOffersContract, readAsList } from './commons'

const auditorPubKey = 'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo='

export const makeBuyOffer = ({ i, stockId, unitPrice, shares, buyer }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  return bankContract.methods.makeBuyOffer(stockId, unitPrice, shares, buyer).send({ privateFor: auditorPubKey })
    .then(() => publicOffersContract.methods.makeBuyOffer(stockId, unitPrice, shares)).send()
}

export const makeSellOffer = ({ i, stockId, unitPrice, shares, seller }) => {
  const bankContract = getBankContract(i)
  const publicOffersContract = getPublicOffersContract(i)
  return bankContract.methods.makeSellOffer(stockId, unitPrice, shares, seller).send({ privateFor: auditorPubKey })
    .then(() => publicOffersContract.methods.makeSellOffer(stockId, unitPrice, shares)).send()
}

export const getBuyOfferList = ({ i }) => {
  const bankContract = getBankContract(i)
  return readAsList(bankContract, 'buyOfferCounter', 'buyOffers')
}

export const getSellOfferList = ({ i }) => {
  const bankContract = getBankContract(i)
  return readAsList(bankContract, 'sellOfferCounter', 'sellOffers')
}
