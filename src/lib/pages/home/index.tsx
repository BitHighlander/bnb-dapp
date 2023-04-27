/*
    KeepKey SDK
    BNB dapp
    Binance Chain native

    notes:
    Address index: 719
    [2147483692, 2147484362, 2147483648, 0, 0] - BNB
    m/44'/714'/0'/0/0

    Tx reference:
    HDwallet

 */

import {
  ChakraProvider,
  extendTheme,
  Box,
  Text,
  VStack,
  Grid,
  Modal,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import axios from "axios";
import { React, useEffect, useState } from "react";

import { Logo } from "./components/Logo";

const BNB_BIP44 = "m/44'/714'/0'/0/0";
const BNB_BIP44_LONG = [2147483692, 2147484362, 2147483648, 0, 0];

const spec = "http://localhost:1646/spec/swagger.json";
const configKeepKey = {
  pairingInfo: {
    name: process.env.SERVICE_NAME || "DGB",
    imageUrl:
      process.env.SERVICE_IMAGE_URL ||
      "https://assets.coincap.io/assets/icons/dgb@2x.png",
    basePath: spec,
    url: "https://digi-dapp.vercel.app/",
  },
};

const Home = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0.000");
  const [amount, setAmount] = useState("0.00000000");
  const [toAddress, setToAddress] = useState("");
  const [txid, setTxid] = useState(null);
  const [signedTx, setSignedTx] = useState(null);
  const [keepkeyConnected, setKeepKeyConnected] = useState(false);
  const [keepkeyError, setKeepKeyError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSend = async function () {
    try {
      // let pioneer = new pioneerApi(configPioneer.spec, configPioneer);
      // pioneer = await pioneer.init();

      // init
      const sdk = await KeepKeySdk.create(configKeepKey);
      localStorage.setItem("apiKey", configKeepKey.apiKey);
      console.log("config: ", configKeepKey.apiKey);

      // amount
      console.log("amount: ", amount);
      const amountSat = parseInt(amount * 100000000);

      // get Account info
      console.log("address: ", address);
      if (!address) throw Error("can not send! address is empty");
      let pubkeyInfo = await axios.get(
        `http://127.0.0.1:9001/api/v1/getAccountInfo/BNB/${address}`
      );
      // eslint-disable-next-line no-console
      console.log("pubkeyInfo: ", pubkeyInfo.data);
      pubkeyInfo = pubkeyInfo.data;
      if (!pubkeyInfo) throw Error("can not send! pubkeyInfo is empty");
      // eslint-disable-next-line no-console
      console.log("pubkeyInfo: ", pubkeyInfo);
      // eslint-disable-next-line no-console
      console.log("pubkeyInfo: ", pubkeyInfo.sequence);
      // eslint-disable-next-line no-console
      console.log("pubkeyInfo: ", pubkeyInfo.account_number);

      // Unsigned TX
      if (!pubkeyInfo.sequence) pubkeyInfo.sequence = "0";
      if (!pubkeyInfo.account_number) pubkeyInfo.account_number = "0";
      const msg = {
        addressNList: BNB_BIP44_LONG,
        tx: {
          msg: [
            {
              inputs: [
                {
                  address,
                  coins: [
                    {
                      amount: amountSat,
                      denom: "BNB",
                    },
                  ],
                },
              ],
              outputs: [
                {
                  address: toAddress,
                  coins: [
                    {
                      amount: amountSat,
                      denom: "BNB",
                    },
                  ],
                },
              ],
            },
          ],
          fee: {
            gas: "0",
            amount: [
              {
                denom: "bnb",
                amount: "100",
              },
            ],
          },
          signatures: [],
          memo: "",
        },
        sequence: pubkeyInfo.sequence,
        accountNumber: pubkeyInfo.account_number,
      };

      const input = {
        signDoc: {
          account_number: pubkeyInfo.account_number.toString(),
          chain_id: "Binance-Chain-Tigris",
          msgs: msg.tx.msg,
          memo: msg.tx.memo ?? "",
          source: "0",
          sequence: msg.sequence,
          fee: {
            amount: [
              {
                amount: "2500",
                denom: "uatom",
              },
            ],
            gas: "250000",
          },
        },
        signerAddress: address,
      };
      // eslint-disable-next-line no-console
      console.log("input: ", input);
      const responseSign = await sdk.bnb.bnbSignTransaction(input);
      // eslint-disable-next-line no-console
      console.log("responseSign: ", responseSign);
      if (!responseSign.serialized)
        throw Error("can not send! responseSign is empty");
      setSignedTx(responseSign.serialized);
    } catch (e) {
      console.error("Error on send!", e);
    }
  };

  const onBroadcast = async function () {
    const tag = " | onBroadcast | ";
    try {
      // eslint-disable-next-line no-console
      console.log("onBroadcast: ");
      if (!signedTx) throw Error("can not broadcast! signedTx is empty");

      const url = "https://dex.binance.org/api/v1/broadcast?sync=true";
      const config = {
        headers: {
          "Content-Type": "text/plain",
        },
      };
      const response = await axios.post(url, signedTx, config);
      // eslint-disable-next-line no-console
      console.log(response.data);
      const txidBroadcast = response.data[0].hash;
      setTxid(txidBroadcast);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(tag, e);
    }
  };

  const onStart = async function () {
    try {
      const apiKey = localStorage.getItem("apiKey");
      configKeepKey.apiKey = apiKey;

      // init
      let sdk;
      try {
        sdk = await KeepKeySdk.create(configKeepKey);
        localStorage.setItem("apiKey", configKeepKey.apiKey);
        // eslint-disable-next-line no-console
        console.log("config: ", configKeepKey.apiKey);
      } catch (e) {
        setKeepKeyError("Bridge is offline!");
      }

      const addressInfo = {
        addressNList: BNB_BIP44_LONG,
        coin: "Binance",
        scriptType: "binance",
        showDisplay: false,
      };

      const responseAddress = await sdk.address.binanceGetAddress({
        address_n: addressInfo.addressNList,
      });
      console.log("responseAddress: ", responseAddress);
      // @ts-ignore
      setAddress(responseAddress.address);

      const resp = await axios.get(
        `http://127.0.0.1:9001/api/v1/getPubkeyBalance/BNB/${responseAddress.address}`
      );
      const balanceRemote = resp.data;
      // eslint-disable-next-line no-console
      console.log("balanceRemote: ", balanceRemote);
      setBalance(balanceRemote);

      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  // onStart()
  useEffect(() => {
    onStart();
  }, []); // once on startup

  const handleInputChangeAmount = (e) => {
    const inputValue = e.target.value;
    setAmount(inputValue);
  };

  const handleInputChangeAddress = (e) => {
    const inputValue = e.target.value;
    setToAddress(inputValue);
  };

  return (
    <Grid gap={4}>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sending BNB</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div>
              amount:{" "}
              <input
                type="text"
                name="amount"
                value={amount}
                onChange={handleInputChangeAmount}
              />
            </div>
            <br />
            <div>
              address:{" "}
              <input
                type="text"
                name="address"
                value={toAddress}
                placeholder=""
                onChange={handleInputChangeAddress}
              />
            </div>
            <br />
            {error ? <div>error: {error}</div> : <div />}
            {txid ? (
              <div>
                txid:{" "}
                <a href={`https://explorer.bnbchain.org/tx/${txid}`}>{txid}</a>
              </div>
            ) : (
              <div />
            )}
            {txid ? (
              <div />
            ) : (
              <div>{signedTx ? <div>signedTx: {signedTx}</div> : <div />}</div>
            )}
          </ModalBody>

          <ModalFooter>
            {!signedTx ? (
              <div>
                <Button colorScheme="green" mr={3} onClick={onSend}>
                  Send
                </Button>
              </div>
            ) : (
              <div />
            )}
            {!txid ? (
              <div>
                {signedTx ? (
                  <div>
                    <Button colorScheme="green" mr={3} onClick={onBroadcast}>
                      broadcast
                    </Button>
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ) : (
              <div />
            )}
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              exit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <VStack spacing={8}>
        {keepkeyError ? (
          <div>
            KeepKey not online!{" "}
            <a href="https://www.keepkey.com/">Download KeepKey Desktop.</a>
          </div>
        ) : (
          <div />
        )}
        {keepkeyConnected ? <div>loading KeepKey....</div> : <div />}
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <div>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>address: {address}</Text>
            <Text>balance: {balance}</Text>
            <Button onClick={onOpen}>Send BNB</Button>
          </div>
        )}
      </VStack>
    </Grid>
  );
};

export default Home;
