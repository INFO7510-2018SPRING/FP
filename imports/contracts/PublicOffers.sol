pragma solidity ^0.4.21;

import "./Ownable.sol";

// PublicOffer contract is owned and deployed by Auditor, should be public
contract PublicOffer is Ownable {
    struct Offer {
        uint id;
        uint stockId;
        uint unitPrice;
        uint shares;
        address bank;
        OfferState state;
    }
    enum OfferState { Created, Matched, Canceled }

    mapping (uint => Offer) public buyOffers;
    uint public buyOfferCounter;

    mapping (uint => Offer) public sellOffers;
    uint public sellOfferCounter;
    
    mapping (address => bool) public banks;
    uint public bankCounter;

    modifier onlyBanks() {
        require(banks[msg.sender]);
        _;
    }

    function addBank(address _bank) public onlyOwner {
        banks[_bank] = true;
    }

    function removeBank(address _bank) public onlyOwner {
        banks[_bank] = false;
    }

    function makeBuyOffer(uint _stockId, uint _unitPrice, uint _shares) public onlyBanks {
        buyOfferCounter++;
        buyOffers[buyOfferCounter] = Offer({
            id: buyOfferCounter,
            stockId: _stockId,
            unitPrice: _unitPrice,
            shares: _shares,
            bank: msg.sender,
            state: OfferState.Created
        });
    }

    function makeSellOffer(uint _stockId, uint _unitPrice, uint _shares) public onlyBanks {
        sellOfferCounter++;
        sellOffers[sellOfferCounter] = Offer({
            id: sellOfferCounter,
            stockId: _stockId,
            unitPrice: _unitPrice,
            shares: _shares,
            bank: msg.sender,
            state: OfferState.Created
        });
    }

    function matchOfferPair(uint _buyOfferId, uint _sellOfferId) public onlyOwner {
        Offer storage buyOffer = buyOffers[_buyOfferId];
        require(buyOffer.state == OfferState.Created);

        Offer storage sellOffer = sellOffers[_sellOfferId];
        require(sellOffer.state == OfferState.Created);

        buyOffer.state = OfferState.Matched;
        sellOffer.state = OfferState.Matched;
    }

    function cancelSellOffer(uint _sellOfferId) public onlyOwner {
        Offer storage offer = sellOffers[_sellOfferId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Canceled;
    }

    function cancelBuyOffer(uint _buyOfferId) public onlyOwner {
        Offer storage offer = buyOffers[_buyOfferId];
        require(offer.state == OfferState.Created);
        offer.state = OfferState.Canceled;
    }
}