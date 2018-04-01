FlowRouter.route('/', {
    name: 'main',
    action() {
        BlazeLayout.render('main');
    }
});

FlowRouter.route('/investorLogin',{
    name: 'investorLogin',
    action(){
        BlazeLayout.render('investorLogin');
    }
});

// FlowRouter.route('/landing', {
//     name: 'landing',
//     action(){
//         BlazeLayout.render('framework',{main: 'useraccounts'});
//     }
// });

