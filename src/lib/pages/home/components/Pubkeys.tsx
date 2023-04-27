import {
  Grid,
  Card,
  CardBody,
  Box,
  CardHeader,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import React, { useEffect } from "react";

const Pubkeys = () => {
  const [pubkeys, setPubkeys] = React.useState([]);

  const onStart = async function () {
    try {
      const spec = "http://localhost:1646/spec/swagger.json";
      const apiKey = localStorage.getItem("apiKey") || "1234";
      const config = {
        apiKey,
        pairingInfo: {
          name: "KeepKey-template Demo App",
          imageUrl:
            "https://github.com/BitHighlander/keepkey-desktop/raw/master/electron/icon.png",
          basePath: spec,
          url: "http://localhost:1646",
        },
      };
      // init
      const sdk = await KeepKeySdk.create(config);
      if (config.apiKey !== apiKey)
        localStorage.setItem("apiKey", config.apiKey);

      // eslint-disable-next-line no-console
      console.log("apiKey: ", config.apiKey);

      // Unsigned TX
      const paths = [
        {
          symbol: "BTC",
          address_n: [2147483732, 2147483648, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "ETH",
          address_n: [2147483692, 2147483708, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "RUNE",
          address_n: [2147483692, 2147484579, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "ATOM",
          address_n: [2147483692, 2147483766, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "OSMO",
          address_n: [2147483692, 2147483766, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "BNB",
          address_n: [2147483692, 2147484362, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "BCH",
          address_n: [2147483692, 2147483793, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "LTC",
          address_n: [2147483692, 2147483650, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
        {
          symbol: "DOGE",
          address_n: [2147483692, 2147483651, 2147483648],
          coin: "Bitcoin",
          script_type: "p2pkh",
          showDisplay: false,
        },
      ];
      const pubkeysQuery = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < paths.length; i++) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-await-in-loop
        const pubkey = await sdk.system.info.getPublicKey(paths[i]);
        // eslint-disable-next-line no-console
        console.log(pubkey);
        const pubkeyInfo: any = paths[i];
        pubkeyInfo.xpub = pubkey.xpub;
        pubkeysQuery.push(pubkeyInfo);
      }
      // eslint-disable-next-line no-console
      console.log(pubkeysQuery);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setPubkeys(pubkeysQuery);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  return (
    <Grid textAlign="center" gap={2}>
      {pubkeys.map((pubkey: any) => (
        <Card>
          <CardHeader>
            <Heading size="md">Extended Public Key Info</Heading>
          </CardHeader>

          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Symbol
                </Heading>
                {pubkey.symbol}
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Address_n
                </Heading>
                {pubkey.address_n.toString()}
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Coin
                </Heading>
                {pubkey.coin}
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Script Type
                </Heading>
                {pubkey.script_type}
              </Box>
              <Box>
                <Heading size="xs" textTransform="uppercase">
                  Xpub
                </Heading>
                {pubkey.xpub}
              </Box>
            </Stack>
          </CardBody>
        </Card>
      ))}
    </Grid>
  );
};

export default Pubkeys;
