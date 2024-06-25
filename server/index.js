const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const { toHex, bytesToHex, hexToBytes } = require("viem");

app.use(cors());
app.use(express.json());

/* Below are three different addresses to test the project:
  
Address 1
  Private key: 08500f7658f7ace98cbb9603ae300891aaa144ac6b93a3d640b9161caa9b645d
  Address: 0x0c46ed7da0eb1c65c6fc5668e8d19f3ee819c9aa

Address 2
  Private key: f694dc43c3547cb9a40999f42bb5d1c668869ce46dbf00f082a9ab7334b4f6fc
  Address: 0xadc55f382387cf18c4031a56b11e5d27d0f37efb

Address 3
  Private key: 9f2032da084f2156b7f3431bfe105a5a78ab2ce16cad726cc95f94109fe3759c
  Address: 0xe31876db25428e3d5fe92d6d673a790a05ae308a
*/

const balances = {
  "0x0c46ed7da0eb1c65c6fc5668e8d19f3ee819c9aa": 100,
  "0xadc55f382387cf18c4031a56b11e5d27d0f37efb": 50,
  "0xe31876db25428e3d5fe92d6d673a790a05ae308a": 75,
};

app.get('/', function (req, res) {
  res.send("Hello there");
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature, amount, recipient, publicKey, sender } = req.body;

  console.log("sender: ", sender);
  console.log("recipient: ", recipient);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const messageHash = keccak256(utf8ToBytes(message));
  const validSig = secp.secp256k1.verify(signature, messageHash, publicKey);
  console.log(`is signature valid: ${validSig}`);

  if (validSig == false) {
    res.status(400).send({ message: "This is not your wallet." });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }

  res.send({balance: 200});
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
