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

export const getBuyOffer = ({ iBank, hash, id }) => {
  console.log(`getting buy offer ${iBank} ${hash} ${id}`)
  const bankContract = getBankContract(0, iBank)
  const p = id === undefined ? bankContract.methods.buyOfferIds(hash).call() : Promise.resolve(id)
  return p.then(id => bankContract.methods.buyOffers(id).call())
}

export const getSellOfferList = ({ iBank }) => {
  const bankContract = getBankContract(0, iBank)
  return readAsList(bankContract, 'sellOfferCounter', 'sellOffers')
}

export const getSellOffer = ({ iBank, hash, id }) => {
  console.log(`getting sell offer ${iBank} ${hash} ${id}`)
  const bankContract = getBankContract(0, iBank)
  const p = id === undefined ? bankContract.methods.sellOfferIds(hash).call() : Promise.resolve(id)
  return p.then(id => bankContract.methods.sellOffers(id).call())
}

export const matchOffer = ({ iSellBank, sellOfferId, iBuyBank, buyOfferId, publicSellOfferId, publicBuyOfferId }) => {
  const sellBankContract = getBankContract(0, iSellBank)
  const buyBankContract = getBankContract(0, iBuyBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pSell = publicOffersContract.methods.sellOffers(sellOfferId).call()
    .then(({ privateHash }) => sellBankContract.methods.sellOfferIds(privateHash).call())
    .then(offerId => sellBankContract.methods.matchSellOffer(offerId).send({ privateFor: [tmPubKeys[iSellBank]] }))
  const pBuy = publicOffersContract.methods.buyOffers(buyOfferId).call()
    .then(({ privateHash }) => buyBankContract.methods.buyOfferIds(privateHash).call())
    .then(offerId => buyBankContract.methods.matchBuyOffer(offerId).send({ privateFor: [tmPubKeys[iBuyBank]] }))
  const pPublic = publicOffersContract.methods.matchOfferPair(publicBuyOfferId, publicSellOfferId).send()
  return Promise.all([pSell, pBuy, pPublic])
}

export const cancelBuyOffer = ({ iBank, publicOfferId }) => {
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pPrivate = publicOffersContract.methods.buyOffers(publicOfferId).call()
    // FIXME
    .then(({ privateHash }) => bankContract.methods.buyOfferIds(privateHash).call())
    .then(privateId => bankContract.methods.cancelBuyOffer(parseInt(privateId)).send({ privateFor: tmPubKeys[iBank] }))
  const pPublic = publicOffersContract.methods.cancelBuyOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}

export const cancelSellOffer = ({ iBank, publicOfferId }) => {
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  const pPrivate = publicOffersContract.methods.sellOffers(publicOfferId).call()
    // FIXME
    .then(res => { console.log(res.privateHash); return res })
    .then(({ privateHash }) => bankContract.methods.sellOfferIds(privateHash).call())
    .then(privateId => bankContract.methods.cancelSellOffer(parseInt(privateId)).send({ privateFor: tmPubKeys[iBank] }))
  const pPublic = publicOffersContract.methods.cancelSellOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}
