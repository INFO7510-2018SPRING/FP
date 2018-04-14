import { getStockContract, getPublicOffersContract, readAsList } from './commons'

export const getStockList = ({ i }) => {
  const contract = getStockContract(i)
  return readAsList(contract, 'stockCounter', 'stocks')
}

export const getPublicSellOfferList = ({ i }) => {
  const contract = getPublicOffersContract(i)
  return readAsList(contract, 'sellOfferCounter', 'sellOffers')
}

export const getPublicBuyOfferList = ({ i }) => {
  const contract = getPublicOffersContract(i)
  return readAsList(contract, 'buyOfferCounter', 'buyOffers')
}

export const getBankList = () => Promise.resolve([
  { id: 1, name: 'bank1' },
  { id: 2, name: 'bank2' },
  { id: 3, name: 'bank3' }
])
