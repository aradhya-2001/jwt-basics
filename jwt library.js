const jwt = require("jsonwebtoken")
const fs = require("fs")

const pubKey = fs.readFileSync("./publicKey.pem", "utf8")
const prvKey = fs.readFileSync("./privateKey.pem", "utf8")

const payload = {
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true,
    "iat": 1516239022
}

const signedToken = jwt.sign(payload, prvKey, {algorithm: "RS256"})
// console.log(signedToken)

jwt.verify(signedToken, pubKey, {algorithms: ["RS256"]}, (err, payload) => {
    if(!err){
        console.log(payload)
    }else{
        console.error(err)
    }
})
