var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcrypt')
const { USER_COLLECTION } = require('../config/collection')

module.exports = {
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email }).then((response) => {
                if (response) {
                    resolve(response)
                }
                else {
                    console.log(userData);
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                        resolve(data)
                    })
                }

            })
        })
    },
    doLogin: (userData) => {
        return new Promise(async (resolve, reject) => {

            let loginStatus = false
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("sucess");
                        response.user = user
                        response.status = true
                        resolve(response)
                    }
                    else {
                        console.log("failed");
                        resolve({ status: false })
                    }
                })
            }
            else {
                console.log("failed at bcrypt");
                resolve({ status: false })
            }
        })
    }
}