 # Stock Settlement problem using blockchain


 (Built as part of INFO 7510 - Smart Contract Application Engineering in Spring'18 under guidance of Prof. Kal Bugrara and Qi Lu)
 
 
:small_red_triangle:   A solution to post trading services of stock exchange made between customers providing a verifiable chain of trust through a private and public distributed ledger technology :small_red_triangle:
 

 
 :moneybag:  :moneybag:  :moneybag:

### Background:
Blockchain-based equity post trade processes solution: A unique way to trade stocks and liquid capital to add accountability to the ecosystem by:
- Enabling digital signing of stocks by an authorised bank in a network of custodian banks
- Tracing and signing of a buy/sell request by an investor to a bank privately using Quorum

(*unique feature- The interaction of banks is based on a federated blockchain which is not hosted on any public chain. This was made possible by the use of Quorum- A permissioned implementation of Ethereum providing data privacy*)

### Motivation for project:
```diff
 +Duration between trade execution and settlement
```
Despite investors being able to see traded assets in their accounts shortly after transaction, settlement occurs in t+3 days which limits actions to the investor

```diff
 +Inconsistent data
```
Frequent data changes between custodian banks, clearing houses and exchanges lead to manual validation of data which is error prone

```diff
 +Vulnerability to illegit tampering
```
Since the databases are not decentralised and immutable, there have been cases where exchanges and brokers have denied services or performed incorrect operations maliciously or with innocuous intents 


### Technologies:
```
Solidity (Ethereum platform), Quorum API ,React-JS, uPort API, Ant.design, uport-connect
```
### USP of our project/novelty:
:star2: :star2: :star2:
- We are providing transparency and tracebility privately between banks and investors by using Quorum which is a hard fork of ethereum that supports private transactions

- With this implementation, we have reduced settlement time through downstream, post trade automation by a verifiable chain of trust and efficienncy enhancements

- Real time immediate confirmation as a receipt to private transaction between banks

- Trustable transaction history between custodian banks for buy and sell offers in a public chain open to the nodes (such as banks) 

### Use case:

<img src="./public/donate_panther.png" width="250px" height="250px"/>


### How to use

1. Clone repo and cd into it
2. Register your own uPort app from [here](https://developer.uport.me/myapps.html)
3. Create `src/Key.json`  and put your uPort signer into it like `{"uPortSigner": "YOUR_KEY"}`
4. ```yarn```
5. ```yarn start```
8. ```cd src && truffle console```
9. Inside truffle console, ```migrate```, note if you deploy this app to the mainnet, it will cost you real money.
10. Modify address in `init_contract.js`
11. Inside truffle console, ```exec init_contract.js```


### Authors

1. Zhongjie(Eric) He
2. Parth Gargava
3. Yun chen

### License

This project is licensed under the MIT License - see the LICENSE.md file for details

### Acknowledgments:

We thank Northeastern University along with course faculty for giving us the opportunity to build stock settlement solution on blockchain application. :heart:



