module.exports = {
    getAllTitles: function(req, res, next){
        try {

            subDomain = req.headers.host.split('.');
            //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
            let db = req.app.locals.clients;
            let rclient = req.app.locals.rclients;
            var token = req.cookies.token;
            rclient.hgetall(token, async function(err, resp){
                if(err) throw err;
                let rclientresp = await resp
                console.log(rclientresp)
                if(rclientresp.subdomain == subDomain[0] && rclientresp.isLogged == 1){
                    db.query('select id, title from '+subDomain[0]+'.ppl_title', async function(err, result){
                        if(err) {
                            console.log(err);
                            
                        } else {
                            let results = await result.rows
                            console.log(results);
                            //res.json({status:"OK", message:"Get All Titles", data: results})
                            res.render('ppltitles/index')
                            
                        }
                    })
                } else {
                    res.json({status: 404, message:"Token Missing", data: "Login again for your tenant"})
                }
            })
        } catch(e){
            console.log(e);
            
        }
    },

    addTitleInDb: function(req, res, next){
        try{
            subDomain = req.headers.host.split('.');
            let db = req.app.locals.clients;
            let rclient = req.app.locals.rclients;
            var token = req.cookies.token;

            rclient.hmget(token, 'subdomain', async function(err, object) {
                if(err) {
                  console.error(err);
                } else {
                    let obj = await object
                  console.log(obj[0]);
                  console.log(req.body.inputTitle)
                  if(subDomain[0] == obj[0]){
                    const text = 'insert into '+subDomain[0]+'.ppl_title(title) values($1) returning *'
                    var values = [req.body.inputTitle]
                    db.query(text, values, async function(err, result){
                        if(err){
                            console.log(err);
                            
                        } else {
                            let resp = await result
                          //  console.log(resp)
                            res.json({status:"Added Title", message: "added", data:resp.rows[0].id})
                        }
                    })
                  }
                //   const text = 'INSERT INTO '+subDomain[0]+'(name, email) VALUES($1, $2) RETURNING *'
                //     const values = ['brianc', 'brian.m.carlson@gmail.com']
                }
              });
        }catch(e){
            console.log(e);
            
        }
    }
}