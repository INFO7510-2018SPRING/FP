import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './bankLogin.html';

Template.investorLogin.events({
    'click .login'(event){
       Meteor.loginWithPassword("username", "password");
    }
});