const base64url = require("base64url")
const crypto = require("crypto")
const fs = require("fs")

// JWT = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ"

// ISSUANCE 

const header = {
    "alg": "RS256",
    "typ": "JWT"
}

const payload = {
    "sub": "1234567890",
    "name": "John Doe",
    "admin": true,
    "iat": 1516239022
}

const headerJson = JSON.stringify(header)
const payloadJson = JSON.stringify(payload)
//console.log(headerJson)
//console.log(payloadJson)

const headerBase64Url = base64url(headerJson)
const payloadBase64Url = base64url(payloadJson)
//console.log(headerBase64Url)
//console.log(payloadBase64Url)

const signFunc = crypto.createSign("RSA-SHA256")
signFunc.write(headerBase64Url + '.' + payloadBase64Url)
signFunc.end()

const privKey = fs.readFileSync("./privateKey.pem", "utf8")
const signBase64 = signFunc.sign(privKey, "base64") // this func return the signature as buffer as default
/* console.log(signBase64)
console.log("----") */
const signBase64Url = base64url.fromBase64(signBase64) // it takes a base64 encoded string as input and returns a base64url encoded string. It simply replaces the + and / characters in the input string with - and _, and then removes any trailing ``= characters.
/* console.log(signBase64Url) */

// VERIFICATION

const JWT = `${headerBase64Url}.${payloadBase64Url}.${signBase64Url}` // "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.NHVaYe26MbtOYhSKkoKYdFVomg4i8ZJd8_-RU8VNbftc4TSMb4bXP3l3YlNWACwyXPGffz5aXHc6lty1Y2t4SWRqGteragsVdZufDn5BlnJl9pdR_kdVFUsra2rWKEofkZeIC4yWytE58sMIihvo9H1ScmmVwBcQP6XETqYd0aSHp1gOa9RdUPDvoXQ5oqygTqVtxaDr6wUFKrKItgBMzWIdNZ6y7O9E0DhEPTbE9rfBo6KTFsHAZnMg4k68CDp2woYIaXbmYTWcvbzIuHO7_37GT79XdIwkm95QJ7hYC9RiwrV7mesbY4PAahERJawntho0my942XheVLmGwLMBkQ"

const JWTparts = JWT.split('.')
const headerJWTbase64url = JWTparts[0]
const payloadJWTbase64url = JWTparts[1]
const signJWTbase64url = JWTparts[2]

const verifyFunc = crypto.createVerify("RSA-SHA256")
verifyFunc.write(headerJWTbase64url + '.' + payloadJWTbase64url)
verifyFunc.end()

const pubKey = fs.readFileSync("./publicKey.pem", "utf8")
const isValid = verifyFunc.verify(pubKey, signJWTbase64url, "base64url")
console.log(isValid)
