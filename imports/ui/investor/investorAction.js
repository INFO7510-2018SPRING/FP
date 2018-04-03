import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './investorAction.html';

// console.log(FlowRouter.current().queryParams)
// Template.investorAction.helpers({
//     stockActionInfoList:[
//         {stockName: FlowRouter.current().queryParams, action: FlowRouter.getQueryParam('action'), number: FlowRouter.getQueryParam('number'), price: FlowRouter.getQueryParam('price')},
//         {stockName: 'Amazon', action: "Sell", number: 100, price: 100},
//     ]
// });