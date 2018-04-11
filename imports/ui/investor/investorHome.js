import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './investorHome.html';
import './investorAction.js';

Template.investorHome.events({
    'click .logout'(event){
        Meteor.logout();
    }
});

Template.investorHome.helpers({
    investorStockList:[
        { stockName: 'Amazon' , price: "150", buyNumber: "100"},
        { stockName: 'Google' , price: "150", sellNumber: "100"},
        { stockName: 'FaceBook' , price: "150", buyNumber: "100"},
        { stockName: 'Apple' , price: "150", sellNumber: "100"},
        { stockName: 'Linked' , price: "150", buyNumber: "100"},
        { stockName: 'Dell' , price: "150", sellNumber: "100"},
        { stockName: 'Leveno' , price: "150", buyNumber: "100"},
        { stockName: 'Apple' , price: "150", buyNumber: "100"},
    ],

    investorHistoryList:[
        { stockName: 'Amazon' ,status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalPrice: "15000"},
        { stockName: 'Google' , status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalPrice: "15000"},
        { stockName: 'FaceBook' ,status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalPrice: "15000"},
        { stockName: 'Apple' , status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalPrice: "15000"},
    ]
});