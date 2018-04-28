pragma solidity ^0.4.18;


contract Receipt {
    struct TxDetail {

        string offer
        address investor
        string iBank   
   }
mapping (uint=> TxDetail) public txdetailInfo;
uint public txdetailID=0;
string hashOutput='';
event TxCreatedEvent(

        uint txdetailID,
        address investor,
        string iBank,
        address addressiBank    
);


function setReceipt (

string _offer,
address _investor
string _iBank   
)

{
    var receiptInfo= txdetailInfo[txdetailID];
    receiptInfo.offer=_offer;
    receiptInfo.investor=_investor;
    receiptInfo.iBank=_iBank;

}
event printHashoutputEvent(string hashOutput);

function setHashOutput ()
{
    hashOutput = sha3(TxCreatedEvent(txdetailID, investor, iBank, msg.sender)); 
    printHashoutputEvent(hashOutput);
}



}    