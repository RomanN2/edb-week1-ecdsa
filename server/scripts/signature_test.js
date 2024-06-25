const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = "08500f7658f7ace98cbb9603ae300891aaa144ac6b93a3d640b9161caa9b645d";

const messageHash = keccak256(utf8ToBytes("a message to test how signature works"));
console.log(`message hash: ${messageHash}`);

const signature = secp.secp256k1.sign(messageHash, privateKey);
console.log(`signature: ${signature}`);

const publicKey = secp.secp256k1.getPublicKey(privateKey, false);
console.log("public key: ", toHex(publicKey));

const validSig = secp.secp256k1.verify(signature, messageHash, toHex(publicKey));
console.log(`is signature valid: ${validSig}`);