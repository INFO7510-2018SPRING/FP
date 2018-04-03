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
        { stockName: 'Amazon' , buyNumber: "100"},
        { stockName: 'Google' , sellNumber: "100"},
        { stockName: 'FaceBook' , buyNumber: "100"},
        { stockName: 'Apple' , sellNumber: "100"},
        { stockName: 'Linked' , buyNumber: "100"},
        { stockName: 'Dell' , sellNumber: "100"},
        { stockName: 'Leveno' , buyNumber: "100"},
        { stockName: 'Apple' , buyNumber: "100"},
    ],

    investorHistoryList:[
        { stockName: 'Amazon' , action: 'Buy', number: "100"},
        { stockName: 'Google' , action: 'Sell', number: "100"},
        { stockName: 'FaceBook' , action: 'Buy', number: "100"},
        { stockName: 'Apple' , action: 'Sell', number: "100"},
    ]
});