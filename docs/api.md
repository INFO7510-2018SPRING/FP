# API
## 1. Public Scope
### getStockList()
Read the public state tree and get all the stocks.
#### Input
N/A
#### Output
List of Stock
#### Example
> TBD

### getPublicOfferList()
Read the public state tree and get all the pending offers.
#### Input
N/A
#### Output
List of pending offers, without information of investor
#### Example
> TBD

### getBankList()
Read the public state tree and get all the banks.
#### Input
N/A
#### Output
List of bank
#### Example 
> TBD

## 2. Investor Scope
### getBalance()
Read the private state tree and get his/her balance for an authenticated investor.
#### Input
N/A
#### Output
current balance
#### Example
```js
getBalance().then(console.log())  // 1000
```

### getOwnedStockList()
Read the private state tree and get the stock he/she owned for an authenticated investor.
#### Input
N/A
#### Output
List of stock
#### Example
> TBD

### makeOffer(offerInfo)
Modify the private state and make a sell or buy offer to his/her bank for an authenticated investor.
#### Input
```
offerInfo: { stock: <Stock>, type: "Buy"|"Sell", shares: <Number>, unitPrice: <Number> }
```
#### Output
Result object
#### Example
```js
let offerInfo = {/* TBD */}
makeOffer(offerInfo).then(console.log) // see https://github.com/trufflesuite/truffle-contract#making-a-transaction-via-a-contract-function
```

### getOfferHistory()
Read the private state and get his/her own offer history list for an authenticated investor
#### Input
N/A
#### Output
List of offer, with investor's information
#### Example
> TBD

## 3. Bank Scope
### createInvestorAccount(accountInfo)
Create an investor account under an authenticated bank.
#### Input
```
accountInfo: { initialBalance: <Number>, initialStockInfo: { stock: <Stock>, shares: <Number> }, /* TBD */ }
```
#### Output
Result object
#### Example
> TBD

### getInvestorOfferHistory()
Read the private state and get all the offer history of whom belongs to an authenticated bank, including investor's information.
#### Input
N/A
#### Output
List of offer history
```
[
    {
        stock: <Stock>, 
        type: "Buy"|"Sell", 
        shares: <Number>,
        unitPrice: <Number>,
        investor: { address: <Address>, /* other fields TBD */ }
    }
]
```
#### Example
> TBD

### sendPendingOffers(offerIDs)
Send offers to exchange.  
Modify both public(create offer on public state tree) and private(mark offer on private state tree as sent) state tree.
#### Input
List of offer IDs
#### Output
Result object
#### Example
```js
sendPendingOffers(['0x1a2b3c...', '0x4d5e6f...']).then(console.log)
```

## 4. Auditor Scope
### createBank(bankInfo)
Modify public state tree and create new bank
#### Input
```
bankInfo: { bankName: <String>, /* other fields TBD */ }
```
#### Output
Result Obj
#### Example
```js
createBank({bankName: 'jpmorgan', /* ... */}).then(console.log)
```

### approveOfferPair(pair)
Approve a pair of buy offer and sell offer.  
Modify offer on both public and private tree, mark them as settled.
#### Input
```
pair: { buyOfferID: <Address>, sellOfferID: <Address> }
```
#### Output
Result Obj
#### Example
```js
approveOfferPair({buyOfferID: '0x1a2b3c...', sellOfferID: '0x4d5e6f...'}).then(console.log)
```

### rejectOffer(offerID)
Reject an offer.  
Modify offer on both public and private tree, mark them as rejected.
#### Input
```
offerID: <Address>
```
#### Output
Result obj
#### Example
```js
rejectOffer('0x1a2b3c...').then(console.log)
```

### getInvestorOfferHistory()
Read from the private state tree and get all investor offers, including investor's information
#### Input
N/A
#### Output
List of offer history
```
[
    {
        stock: <Stock>, 
        type: "Buy"|"Sell", 
        shares: <Number>,
        unitPrice: <Number>,
        investor: { address: <Address>, /* other fields TBD */ }
    }
]
```
### Example
> TBD
