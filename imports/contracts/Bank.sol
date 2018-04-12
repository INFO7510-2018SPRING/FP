pragma solidity ^0.4.19;

import "../../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol";

// Bank contract is owned and deployed by Auditor, should be privateFor that bank
contract Bank is Ownable {
    function Bank(address _bankAddress) public {
        bankAddress = _bankAddress;
    }

    modifier onlyBank() {
        require(msg.sender == bankAddress);
        _;
    }

    address public bankAddress;

    uint public balance;
    uint public frozenBalance;
    mapping (uint => uint) public stockShares;
    mapping (uint => uint) public frozenStockShares;
    function setBalance(uint _balance) public onlyOwner {
        balance = _balance;
    }
    function setStockShare(uint _stockId, uint _shares) public onlyOwner {
        stockShares[_stockId] = _shares;
    }

    struct Offer {
        uint id;
        address investor;
        uint stockId;
        uint unitPrice;
        uint shares;
        OfferState state;
    }
    enum OfferState { Created, Matched, Canceled }

    mapping (uint => Offer) public buyOffers;
    uint public buyOfferCounter;

    mapping (uint => Offer) public sellOffers;
    uint public sellOfferCounter;
    
    // When the bank makes a buy offer
    // 1. An offer with state of `Created` will be created.
    // 2. The totalPrice will be frozen from its balance.
    function makeBuyOffer(uint _stockId, uint _unitPrice, uint _shares, address _buyer) onlyBank public {
        uint totalPrice = _unitPrice * _shares;
        assert(_unitPrice == totalPrice / _shares);
        require(balance >= totalPrice);
        balance -= totalPrice;
        frozenBalance += totalPrice;

        buyOfferCounter++;
        buyOffers[buyOfferCounter] = Offer({
            id: buyOfferCounter,
            investor: _buyer,
            stockId: _stockId,
            unitPrice: _unitPrice,
            shares: _shares,
            state: OfferState.Created
        });
    }
    
    // When the bank makes a sell offer
    // 1. An offer with state of `Created` will be created.
    // 2. The stock shares will be frozen from its stockShares.
    function makeSellOffer(uint _stockId, uint _unitPrice, uint _shares, address _seller) onlyBank public {
        require(stockShares[_stockId] >= _shares);
        stockShares[_stockId] -= _shares;
        frozenStockShares[_stockId] += _shares;

        sellOfferCounter++;
        sellOffers[sellOfferCounter] = Offer({
            id: sellOfferCounter,
            investor: _seller,
            stockId: _stockId,
            unitPrice: _unitPrice,
            shares: _shares,
            state: OfferState.Created
        });
    }

    // When the auditor approves and matches a buyOffer
    // 1. The state of the offer will be modified to `Matched`.
    // 2. The totalPrice will be deducted from the frozenBalance.
    function matchBuyOffer(uint _offerId) public onlyOwner {
        Offer storage offer = buyOffers[_offerId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Matched;

        uint totalPrice = offer.unitPrice * offer.shares;
        frozenBalance -= totalPrice;
        stockShares[offer.stockId] += offer.shares;
    }

    // When the auditor approves and matches a sellOffer
    // 1. The state of the offer will be modified to `Matched`.
    // 2. The shares will be deducted from the frozenStockShares.
    function matchSellOffer(uint _offerId) public onlyOwner {
        Offer storage offer = sellOffers[_offerId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Matched;

        uint totalPrice = offer.unitPrice * offer.shares;
        balance += totalPrice;
        frozenStockShares[offer.stockId] -= offer.shares;
    }

    // When the auditor cancels a buyOffer
    // 1. The state of the offer will be modified to `Canceled`.
    // 2. The totalPrice will be returned from frozenBalance to balance.
    function cancelBuyOffer(uint _offerId) public onlyOwner {
        Offer storage offer = buyOffers[_offerId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Canceled;

        uint totalPrice = offer.unitPrice * offer.shares;
        frozenBalance -= totalPrice;
        balance += totalPrice;
    }

    // When the auditor cancels a sellOffer
    // 1. The state of the offer will be modified to `Canceled`
    // 2. The shares will be returned from frozenStockShares to stockShares.
    function cancelSellOffer(uint _offerId) public onlyOwner {
        Offer storage offer = sellOffers[_offerId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Canceled;

        frozenStockShares[offer.stockId] -= offer.shares;
        stockShares[offer.stockId] += offer.shares;
    }
}