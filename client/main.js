import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import '../imports/ui/investor/investorLogin.js';


import './main.html';
Template.main.helpers({
  stocks: [
    { stockName: 'Amazon' , buyNumber: "100"},
    { stockName: 'Google' , buyNumber: "100"},
    { stockName: 'FaceBook' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},
    { stockName: 'Apple' , buyNumber: "100"},
    { stockName: 'Linked' , buyNumber: "100"},
    { stockName: 'Dell' , buyNumber: "100"},
    { stockName: 'Leveno' , buyNumber: "100"},

  ]
});

