import { getStockContract, getPublicOffersContract, readAsList } from './commons'

/**
 * @param {Number} i: the ith bank that is reading
 * @returns a promise that resolves an array of stock
 * [
 *   { id: '1', name: 'AMZN' },
 *   { id: '2', name: 'APPL' }
 * ]
 */
export const getStockList = ({ i }) => {
  const contract = getStockContract(i)
  return readAsList(contract, 'stockCounter', 'stocks')
}

/**
 *
 * @param {Number} i: the ith bank that is reading
 * @returns a promise that resolves an array of publicSellOffer
 * [
 *    { bank: "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", id: "1", shares: "10", state: "0", stockId: "2", unitPrice: "8000", blockNumber: "1" }
 * ]
 */
export const getPublicSellOfferList = ({ i }) => {
  const contract = getPublicOffersContract(i)
  return readAsList(contract, 'sellOfferCounter', 'sellOffers')
}

/**
 *
 * @param {Number} i: the ith bank that is reading
 * @returns a promise that resolves an array of publicBuyOffer
 * [
 *    { bank: "0xcA843569e3427144cEad5e4d5999a3D0cCF92B8e", id: "1", shares: "10", state: "0", stockId: "2", unitPrice: "8000", blockNumber: "1" }
 * ]
 */
export const getPublicBuyOfferList = ({ i }) => {
  const contract = getPublicOffersContract(i)
  return readAsList(contract, 'buyOfferCounter', 'buyOffers')
}

export const getBankList = () => Promise.resolve([
  { id: 1, name: 'CHASE' },
  { id: 2, name: 'BOA' },
  { id: 3, name: 'STANDAR' }
])
