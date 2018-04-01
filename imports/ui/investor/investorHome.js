import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './investorHome.html';

Template.investorHome.events({
    'click .logout'(event){
        Meteor.logout();
    }
});