if(Meteor.isClient){
    Accounts.onLogin(function(){
        if(true){
            FlowRouter.go('investor-home');
        }
    });

    Accounts.onLogout(function(){
        FlowRouter.go('main');
    });
}


FlowRouter.route('/', {
    name: 'main',
    action() {
        BlazeLayout.render('main');
    }
});

FlowRouter.route('/investor',{
    name: 'investor',
    action(){
        if(Meteor.userId()){
            FlowRouter.go('investor-home');
        }
        BlazeLayout.render('investorLogin');
        
    }
});

FlowRouter.route('/investor-home',{
    name: 'investor-home',
    action(){
       BlazeLayout.render('investorHome');
    }
});

FlowRouter.route('/investor-action',{
    name: 'investor-action',
    action(params, queryParams){
        console.log(queryParams);
        BlazeLayout.render('investorAction', {data: queryParams});
    }
});
// FlowRouter.route('/landing', {
//     name: 'landing',
//     action(){
//         BlazeLayout.render('framework',{main: 'useraccounts'});
//     }
// });

