module.exports = {
    addNewEmployeeQuick: function(req, res, next){
        var domain = req.headers.host;
        subDomain = domain.split('.');
        //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
        let db = req.app.locals.clients;
        let rclient = req.app.locals.rclients;
    },

    quickAddForm: function(req, res, next){
        var domain = req.headers.host;
        subDomain = domain.split('.');
        //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
        let db = req.app.locals.clients;
        let rclient = req.app.locals.rclients;
        res.render('employee/quickadd') 
    }
}