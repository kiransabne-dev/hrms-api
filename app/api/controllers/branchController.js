module.exports = {
    getAllBranches: function(req, res, next){
        try{
            subDomain = req.headers.host.split('.');
            //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
            let db = req.app.locals.clients;
            let rclient = req.app.locals.rclients;
            var token = req.cookies.token;
            rclient.hmget(token, 'subdomain', 'roles', async function(err, resp){
                if(err){
                    console.log(err);
                    
                } else {
                    let response = await resp
                    console.log(response)
                    if(response[0] == subDomain[0]){
                        if(req.method == 'GET'){

                        db.query('select branch_id, branch_name, branch_location from '+subDomain[0]+'.branch', async function(err, resp){
                            if(err){
                                console.log(err);
                                
                            } else {
                                let result = await resp.rows;
                               // res.render('branches/index')
                               res.json({status:"OK", message:"branch list", data:result})
                            }
                        })
                        } else {
                            const text = 'insert into '+subDomain[0]+'.branch(branch_id, branch_name, branch_location, business_id) values($1, $2, $3, $4) returning *'
                            var values = [req.body.branch_id, req.body.branch_name, req.body.branch_location, req.body.branchCompanySelect]
                            db.query(text,values, async function(err, result){
                                if(err){
                                    console.log(err);
                                    
                                } else {
                                    let results = await result.rows
                                    console.log(results)
                                    res.json({status:"OK", message:"branch data", data: results})

                                }
                            })

                        }

                    } else {
                        //todo redirect to login page
                    }
                }
            })


        }catch(e){
            console.log(e);
            
        }
    },
    getBranchForCompany: function(req, res, next){
        subDomain = req.headers.host.split('.');
        let db = req.app.locals.clients;
        let rclient = req.app.locals.rclients;
        var token = req.cookies.token;
        console.log(req.body.business_id)
        db.query("select branch_id, branch_name, branch_location, business_id from "+subDomain[0]+".branch where business_id = '"+req.body.business_id+"'", async function(err, result){
            if(err){
                console.log(err);
                
            } else {
                let results = result.rows
                console.log(results);
                res.json({status:"OK", message:"Branch List Compnay Wise", data:results})

            }
        })
    }
}