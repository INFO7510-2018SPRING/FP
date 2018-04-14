import { getBankContract, readAsList, getPublicOffersContract } from './commons'

const tmPubKeys = [
  'BULeR8JyUWhiuuCMU/HLA0Q5pzkYT+cHII3ZKBey3Bo=',
  'QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc=',
  'oNspPPgszVUFw0qmGFfWwh1uxVUXgvBxleXORHj07g8=',
  'R56gy4dn24YOjwyesTczYa8m5xhP6hF2uTMCju/1xkY=',
  'UfNSeSGySeKg11DVNEnqrUtxYRVor4+CvluI8tVv62Y='
]

export const getBuyOfferList = ({ iBank }) => {
  const bankContract = getBankContract(0, iBank)
  return readAsList(bankContract, 'buyOfferCounter', 'buyOffers')
}

export const getSellOfferList = ({ iBank }) => {
  const bankContract = getBankContract(0, iBank)
  return readAsList(bankContract, 'sellOfferCounter', 'sellOffers')
}

export const matchOffer = ({ iSellBank, sellOfferId, iBuyBank, buyOfferId, publicSellOfferId, publicBuyOfferId }) => {
  const sellBankContract = getBankContract(0, iSellBank)
  const buyBankContract = getBankContract(0, iBuyBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pSell = sellBankContract.methods.matchSellOffer(sellOfferId).send({ privateFor: [tmPubKeys[iSellBank]] })
  const pBuy = buyBankContract.methods.matchBuyOffer(buyOfferId).send({ privateFor: [tmPubKeys[iSellBank]] })
  const pPublic = publicOffersContract.methods.matchOfferPair(publicBuyOfferId, publicSellOfferId).send()
  return Promise.all([pSell, pBuy, pPublic])
}

export const cancelBuyOffer = ({ iBank, offerId, publicOfferId }) => {
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pPrivate = bankContract.methods.cancelBuyOffer(offerId).send({ privateFor: tmPubKeys[iBank] })
  const pPublic = publicOffersContract.methods.cancelBuyOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}

export const cancelSellOffer = ({ iBank, offerId, publicOfferId }) => {
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pPrivate = bankContract.methods.cancelSellOffer(offerId).send({ privateFor: tmPubKeys[iBank] })
  const pPublic = publicOffersContract.methods.cancelSellOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}
