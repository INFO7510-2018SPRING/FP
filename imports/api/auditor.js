import { getBankContract, readAsList, getPublicOffersContract, rejectRequest, approveRequest } from './commons'

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
  const bankContract = getBankContract(0, iBank)
  const p = id === undefined ? bankContract.methods.buyOfferIds(hash).call() : Promise.resolve(id)
  return p.then(id => bankContract.methods.buyOffers(id).call())
}

export const getSellOfferList = ({ iBank }) => {
  const bankContract = getBankContract(0, iBank)
  return readAsList(bankContract, 'sellOfferCounter', 'sellOffers')
}

export const getSellOffer = ({ iBank, hash, id }) => {
  const bankContract = getBankContract(0, iBank)
  const p = id === undefined ? bankContract.methods.sellOfferIds(hash).call() : Promise.resolve(id)
  return p.then(id => bankContract.methods.sellOffers(id).call())
}

export const matchOffer = ({ iSellBank, iBuyBank, publicSellOfferId, publicBuyOfferId }) => {
  const sellBankContract = getBankContract(0, iSellBank)
  const buyBankContract = getBankContract(0, iBuyBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  let offerId
  const pSell = publicOffersContract.methods.sellOffers(publicSellOfferId).call()
    .then(({ privateHash }) => sellBankContract.methods.sellOfferIds(privateHash).call())
    .then(_offerId => {
      offerId = parseInt(_offerId)
    })
    .then(() => sellBankContract.methods.matchSellOffer(offerId).send({ privateFor: [tmPubKeys[iSellBank]] }))
    .then(() => sellBankContract.methods.sellOffers(offerId).call())
    .then(({ requestId }) => requestId && approveRequest({ _id: requestId, fromAuditor: true }))
  const pBuy = publicOffersContract.methods.buyOffers(publicBuyOfferId).call()
    .then(({ privateHash }) => buyBankContract.methods.buyOfferIds(privateHash).call())
    .then(_offerId => {
      offerId = parseInt(_offerId)
      console.log('buy offerId to be matched', offerId)
    })
    .then(() => buyBankContract.methods.matchBuyOffer(offerId).send({ privateFor: [tmPubKeys[iBuyBank]] }))
    .then(() => buyBankContract.methods.buyOffers(offerId).call())
    .then(({ requestId }) => requestId && approveRequest({ _id: requestId, fromAuditor: true }))
  const pPublic = publicOffersContract.methods.matchOfferPair(publicBuyOfferId, publicSellOfferId).send()
  return Promise.all([pSell, pBuy, pPublic])
}

export const cancelBuyOffer = ({ iBank, offer }) => {
  const publicOfferId = offer.id
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  let privateId
  const pPrivate = publicOffersContract.methods.buyOffers(publicOfferId).call()
    // FIXME
    .then(x => { console.log('privateHash: ', x.privateHash); return x })
    .then(({ privateHash }) => bankContract.methods.buyOfferIds(privateHash).call())
    .then(_privateId => {
      privateId = parseInt(_privateId)
      console.log('privateId to be canceled: ', privateId)
    })
    .then(() => bankContract.methods.cancelBuyOffer(privateId).send({ privateFor: [tmPubKeys[iBank]] }))
    .then(() => bankContract.methods.buyOffers(privateId).call())
    .then(({ requestId }) => requestId && rejectRequest({ _id: requestId }))
  const pPublic = publicOffersContract.methods.cancelBuyOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}

export const cancelSellOffer = ({ iBank, offer }) => {
  const publicOfferId = offer.id
  const bankContract = getBankContract(0, iBank)
  const publicOffersContract = getPublicOffersContract(0)
  // TODO: validation
  let privateId
  const pPrivate = publicOffersContract.methods.sellOffers(publicOfferId).call()
    // FIXME
    .then(({ privateHash }) => bankContract.methods.sellOfferIds(privateHash).call())
    .then(_privateId => {
      privateId = parseInt(privateId)
    })
    .then(() => bankContract.methods.cancelSellOffer(privateId).send({ privateFor: [tmPubKeys[iBank]] }))
    .then(() => bankContract.methods.sellOffers(privateId).call())
    .then(({ requestId }) => requestId && rejectRequest({ _id: requestId }))
  const pPublic = publicOffersContract.methods.cancelSellOffer(publicOfferId).send()
  return Promise.all([pPrivate, pPublic])
}
