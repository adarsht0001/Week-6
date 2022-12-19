var db=require('../config/connection')
var collection=require('../config/collection')
const { response } = require('../app')
const { colours } = require('nodemon/lib/config/defaults')
var objectID=require('mongodb').ObjectId
var bcrypt=require('bcrypt')

module.exports={
    viewUser:()=>{
        return new Promise(async(resolve, reject) => {
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectID(userId)}).then((response)=>{
                console.log(response);
                resolve(response)
            })

        })
    },
    getUserDetails:(user)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectID(user)}).then((response)=>{
                resolve(response);
            })
        })
    },
    updateDetails:(userId,userDetails)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({email:userDetails.email}).then((response)=>{
                if(response){
                    resolve(response)
                }
                else{
                    db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectID(userId)},{
                        $set:{
                            name:userDetails.name,
                            email:userDetails.email
                        }
                    }).then((response)=>{
                        resolve(response)
                    })
                }
            })
        })
    },
    doSignup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            
            db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email}).then((response) => {
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
    }
}