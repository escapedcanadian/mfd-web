'use strict';
const server = require('../server.js'); 
var config = require("../config");
const axios = require('axios');

class User {
    constructor(data) {
        this.data = this.sanitize(data);
        data.doc = {
            type: "user",
            created: Math.floor(new Date().getTime() / 1000),
            schema: "0.1"
            }
    }

    sanitize(data) {
        return data;
    }

    // Attempt to register w/ server
    registerNew(callback) {
        server.gameInfoCollection.insert(User.key(this.data.username), this.data, {}, (err, result) => {
            var sgRequest = {};
            sgRequest.name = this.data.username;
            sgRequest.password = this.data.password;
            sgRequest.admin_channels = [],
            sgRequest.admin_roles = [],
            sgRequest.email = "",
            sgRequest.disabled = false

            server.sgAdmin.post(
                "_user/",
                sgRequest
            ).then ((response)=>{
                console.log(response);
                callback(null, result);
            }).catch((err)=>{
                if(err.response.status === 409) {
                    err.message = "SyncGateway user already exists";
                }
                callback(err, null)
            });

 
         })
    }

    get asDoc() {
        return this.data;
    }

    static key(username) {
        return 'user:'.concat(username);
    }

    static exists(username, callback) {
        
        server.gameInfoCollection.exists(User.key(username), {}, (err, result) => {
           callback(err, result);
        })
    }
}

module.exports = User
