module.exports = {
    getAndAddDesignation: function(req, res, next){
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
                            db.query('select designation_id, designation_name from '+subDomain[0]+'.designation', async function(err, result){
                                if(err){
                                    console.log(err);
                                    
                                } else {
                                    let results = await result.rows
                                    res.render('designation/index')
                                }
                            })

                        } else if(req.method == 'POST'){
                            const text = 'insert into '+subDomain[0]+'.designation(designation_id, designation_name) values ($1, $2) returning *'
                            var values = [req.body.designation_id, req.body.designation_name]
                            db.query(text, values, async function(err, result){
                                if(err){
                                    console.log(err);
                                    
                                } else {
                                    let results = await result.rows
                                    res.json({status:"OK", message:"Designation Added", data: results})
                                }
                            })
                        } else {
                           // res.render('users/login')
                           //todo redirect to login page
                        }
                    }
                }
            })
            
        }catch(e){
            console.log(e)
        }
    }
}