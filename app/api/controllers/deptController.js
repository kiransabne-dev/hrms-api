module.exports = {
    getAndAddDept: function(req, res, next){
        try{
            subDomain = req.headers.host.split('.');
            //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
            let db = req.app.locals.clients;
            let rclient = req.app.locals.rclients;
            var token = req.cookies.token;
            rclient.hmget(token, 'subdomain', 'roles', async function(err, obj){
                if(err){
                    console.log(err);
                    
                } else {
                    let response = await obj
                    if(response[0] == subDomain[0]){
                        if(req.method == 'GET'){
                            db.query('select dept_id, dept_name, dept_location, branch_id from '+subDomain[0]+'.dept', async function(err, result){
                                if(err){
                                    console.log(err)
                                } else {
                                    let results = await result.rows

                                }
                            })
                        } else if(req.method == 'POST'){
                            const text = 'insert into '+subDomain[0]+'.dept (dept_id, dept_name, branch_id) values ($1, $2, $3) returning * '
                            var values = [req.body.dept_id, req.body.dept_name, req.body.branch_id]
                            db.query(text, values, function(err, result){
                                if(err){
                                    console.log(err);
                                    
                                } else {
                                    let results = await result.rows
                                }
                            })
                        } else {
                            //todo redirect to login controller
                        }
                    }
                }
            })            
        } catch(e){
            console.log(e);
            
        }
    }
}