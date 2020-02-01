module.exports = {
    getAndAddCompanyInfo: function(req, res, next){
        try{
            subDomain = req.headers.host.split('.');
            //check subdomain size and it should be 3 then select 0 the emelemnt of the subdomain array
            let db = req.app.locals.clients;
            let rclient = req.app.locals.rclients;
            var token = req.cookies.token;
            rclient.hmget(token, 'subdomain', 'roles', 'tenant_id', async function(err, obj){
                if(err) throw err;
                let response = await obj
                if(response[0] == subDomain[0]){
                    if(req.method == 'GET'){
                        db.query('select business_id, tenant_id, business_name, email, mobile_number, registration_id, main_address, active from '+subDomain[0]+'.business_info', async function(err, result){
                            if(err){
                                console.log(err);
                                
                            } else {
                                let results = result.rows
                                console.log(results)
                                res.json({status:"OK", message:"Company details", data: results})
                               // res.render('company/index')
                                
                            }
                        })
                    } else if(req.method == 'POST'){
                        console.log(response[2]);
                        
                        const text = 'insert into '+subDomain[0]+'.business_info(tenant_id, business_name, email, mobile_number, registration_id, main_address) values($1, $2, $3, $4, $5, $6) returning *'
                        var values = [response[2], req.body.business_name, req.body.email, req.body.mobile_number, req.body.registration_id, req.body.main_address]
                        db.query(text, values, async function(err, result){
                            if(err){
                                console.log(err);
                                
                            } else {
                                let results = await result.rows
                                res.json({status:'OK', message:'Company Inserted', data: results})
                            }
                        })
                    } else {
                        res.render('users/login')
                    }
                } else {
                    //todo redirect to login
                }
            })
        } catch(e){
            console.log(e)
        }
    }
}


// b_id integer NOT NULL DEFAULT nextval('diamond.business_info_b_id_seq'::regclass),
//     business_id uuid DEFAULT uuid_generate_v4(),
//     tenant_id uuid NOT NULL,
//     business_name character varying(1000) COLLATE pg_catalog."default" NOT NULL,
//     created_by integer NOT NULL DEFAULT 0,
//     created_timestamp timestamp without time zone NOT NULL DEFAULT now(),
//     updated_by integer,
//     email character varying COLLATE pg_catalog."default" NOT NULL,
//     phone character varying COLLATE pg_catalog."default",
//     mobile_number character varying COLLATE pg_catalog."default" NOT NULL,
//     registration_id character varying COLLATE pg_catalog."default" NOT NULL,
//     main_address character varying COLLATE pg_catalog."default" NOT NULL,
//     active character varying(1) COLLATE pg_catalog."default" NOT NULL DEFAULT 'Y'::character varying,