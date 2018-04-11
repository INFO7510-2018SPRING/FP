import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './bankHome.html';

Template.bankHome.events({
    'click .logout'(event){
        Meteor.logout();
    }
});

Template.bankHome.helpers({
    customerTransactionList:[
        { date: "09-10-2016", status: "Confirmed", stockName: 'Amazon' , price: "150", buyNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Google' , price: "150", sellNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'FaceBook' , price: "150", buyNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Apple' , price: "150", sellNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Linked' , price: "150", buyNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Dell' , price: "150", sellNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Leveno' , price: "150", buyNumber: "100", totalPrice: "15000"},
        { date: "09-10-2016", status: "Confirmed", stockName: 'Apple' , price: "150", buyNumber: "100", totalPrice: "15000"},
    ],

    sumerizeTransactionList:[
        { stockName: 'Amazon' ,status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalAmount: "100"},
        { stockName: 'Google' , status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalAmount: "100"},
        { stockName: 'FaceBook' ,status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalAmount: "100"},
        { stockName: 'Apple' , status: 'Pending', number: "100", price: "150", date: "03-04-2017", totalAmount: "100"},
    ]
});