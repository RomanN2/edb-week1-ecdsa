import { useState } from "react";
import server from "./server";

import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"; 
import * as secp from "ethereum-cryptography/secp256k1";
import {keccak256} from "ethereum-cryptography/keccak";

function Transfer({ address, privateKey, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const message = "a message to test how signature works";
    const messageHash = keccak256(utf8ToBytes(message));
    console.log(`message hash: ${messageHash}`);

    const signature = secp.secp256k1.sign(messageHash, privateKey).toCompactHex();
    console.log(`signature: ${signature}`);

    const publicKey = secp.secp256k1.getPublicKey(privateKey, false);
    console.log("public key: ", toHex(publicKey));

    const sender = '0x' + toHex(keccak256(publicKey.slice(1)).slice(-20));
    console.log("sender: ", sender);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        message,
        signature,
        amount: parseInt(sendAmount),
        recipient,
        publicKey: toHex(publicKey),
        sender: sender,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
