const bcrypt = require('bcrypt')

module.exports = {
    loginForTenantProcess: function(req, res, next){
       // console.log('loginForTenantProcess')
        var domain = req.headers.host,
        subDomain = domain.split('.');
        //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
        let db = req.app.locals.clients;
        let rclient = req.app.locals.rclients;

        const query = {
            // give the query a unique name
            name: 'fetch-tenant',
            text: 'SELECT tenant_id, subdomain, active FROM public.tenant_info WHERE subdomain = $1',
            values: [subDomain[0]],
          }
        db.query(query)
        .then(function(result){
            //console.log(query)
            var rowsSets = result.rows
            console.log(rowsSets)
            if(req.method == 'GET') {
                res.render('users/login')
            }
            if(req.method == 'POST') {
                var token = req.cookies.token
                rclient.hgetall(token, async function (error, obj){
                    if(error) throw error;

                    let response = await obj
                   // console.log('redis values',response);
                    if(response == null){
                        //if values is null
                        const loginstmt = {
                            name: 'fetch-user',
                            text: 'select user_id, employee_id, user_first_name, user_last_name, user_email, password, mobile_number, roles, business_id from '+subDomain[0]+'.users where user_id = $1',
                            values: [req.body.userId]
                        }
                        db.query(loginstmt)
                        .then(function(result){
                            console.log('login result ====> ', result.rows[0].password);
                            if(bcrypt.compareSync(req.body.password, result.rows[0].password)){
                                //password matches
                                //upload user data in redis cache
                                var userData = {
                                    tenant_id: rowsSets[0].tenant_id,
                                    subdomain: subDomain[0],
                                    active: rowsSets[0].active,
                                    user_id: result.rows[0].user_id,
                                    e_id: result.rows[0].employee_id,
                                    fn: result.rows[0].user_first_name,
                                    ln: result.rows[0].user_last_name,
                                    email: result.rows[0].user_email,
                                    password: result.rows[0].password,
                                    mn: result.rows[0].mobile_number,
                                    roles: result.rows[0].roles,
                                    b_id: result.rows[0].business_id,
                                    isLogged: 1

                                }
                                rclient.hmset(token, userData, async function(err, rres){
                                    if(err){
                                        console.log(err);
                                        
                                    } else {
                                        console.log(rres);
                                        let redisRes = await rres
                                        console.log(redisRes);
                                        rclient.expire(token, 31556952000)

                                        console.log(typeof(redisRes));
                                        if(redisRes === 'OK'){
                                            res.redirect('/dashboard')
                                        }
                                        
                                    }
                                })
                            }
                        }).catch(function(e){
                            console.log(e);
                            
                        })

                    } else {
                        console.log(response.password)
                        if(bcrypt.compareSync(req.body.password, response.password)){
                            let setLoggedIn = {
                                isLogged: 1
                            }
                            rclient.hmset(token, setLoggedIn, async function(err, rres){
                                if(err){
                                    console.log(err);
                                    
                                } else {
                                    console.log(rres);
                                    let redisRes = await rres
                                    console.log(redisRes);
                                    console.log(typeof(redisRes));
                                    if(redisRes === 'OK'){
                                        //res.render('users/dashboard')
                                        res.redirect('/dashboard')
                                    }
                                    
                                }
                            })
                        }
                    }
                    
                })
            }
        })
        .catch(function(e){
            console.log(query)

            console.log(e);
            
        })
    }
}