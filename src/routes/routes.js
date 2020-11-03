'use strict';
const config = require("../config");
const util = require('util');
const createError = require('http-errors');
const { create } = require("domain");
const asyncHandler = require('express-async-handler');
const User = require('../model/user.js');


const gameInfoCollection = require("../server").gameInfoCollection;

module.exports = function (app) {

/*     //// ▶▶ enable cors ◀◀ ////
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }); */

    //// ▶▶ Register a new user ◀◀ ////
    app.post('/user/registration/', asyncHandler(async (req,res, next)=>{
       
        
        const params = req.body;
        console.log("Recieved registration request: %s", params);

        const username = params.username
        if (!username) { next(createError(createError.BadRequest, "No username found in JSON body")) }
  
        console.log("Request to register w/ username: %s", username);

        User.exists(username, (err, result)=>{
            var answer = new Object;
            if(err != undefined) {
                console.error("Error looking for existing user", err); 
                next(createError(500, "Unable to verify registration"));
            } else {
                if(result.exists) {
                    // User name is in use
                    console.log("Registration error. Name in use: %s", username);
                    res.status(409);
                    answer.success = false;
                    answer.code = 409;
                    answer.message = "Username is in use";
                    res.send(answer)  

                } else {
                    // User name is not in use
                    console.log("Proceeding to register w/ username: %s", username);
                    var infant = new User(req.body);
                    infant.registerNew((err, result) => {
                        if (err) {
                            console.err("Registration error:", err);
                            res.status(500);
                            answer.success = false;
                            answer.code = 500;
                            answer.message = err
                            res.send(answer)                      
                        } else {
                            res.status(200);
                            var answer = new Object();
                            answer.success = true;
                            res.send(answer);
                        }                                            
                    });
                    
                }
            }
     }
    )
    
    }));


       //// ▶▶ Register a new user ◀◀ ////
       app.get('/services', asyncHandler(async (req,res, next)=>{
           var services = {};
           services.active = config.active;
           services.secure = config.secure;
           services.name = config.server_name;
           res.status(200);
           res.send(JSON.stringify(services));
       }));

};

