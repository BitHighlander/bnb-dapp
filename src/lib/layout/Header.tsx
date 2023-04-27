import {
  Box,
  Flex,
  Avatar,
  AvatarBadge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel
} from "@chakra-ui/react";
import { KeepKeySdk } from "@keepkey/keepkey-sdk";
import { useEffect, useState } from "react";

import KEEPKEY_ICON from "lib/assets/png/keepkey.png";

const spec = "http://localhost:1646/spec/swagger.json";
const configKeepKey: any = {
  pairingInfo: {
    name: "KeepKey-Template",
    imageUrl:
      "https://www.keepkey.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fkeepkey_logo.407f5aca.png&w=3840&q=100",
    basePath: spec,
    url: "https://keepkey-template.vercel.app/",
  },
};

const Header = () => {
  const [keepkeyConnected, setKeepKeyConnected] = useState(false);
  const [keepkeyError, setKeepKeyError] = useState(false);
  const [features, setKeepKeyFeatures] = useState({});

  const onStart = async function () {
    try {
      const apiKey = localStorage.getItem("apiKey") || "1234";
      configKeepKey.apiKey = apiKey;

      // init
      const sdk = await KeepKeySdk.create(configKeepKey);
      localStorage.setItem("apiKey", configKeepKey.apiKey);

      const featuresKK = await sdk.system.info.getFeatures();
      // eslint-disable-next-line no-console
      console.log("features: ", featuresKK);
      if (featuresKK) {
        setKeepKeyConnected(true);
      }
      setKeepKeyFeatures(featuresKK);
      // setKeepKeyConnected(true);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setKeepKeyError("Bridge is offline!");
    }
  };

  // onStart()
  useEffect(() => {
    onStart();
  }, []); // once on startup

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="center"
      gridGap={2}
    >
      <Box marginLeft="auto">
        <Menu>
          <MenuButton
            as={Button}
            rounded="full"
            variant="link"
            cursor="pointer"
            minW={200}
          >
            <Avatar size="lg" src={KEEPKEY_ICON}>
              {keepkeyConnected ? (
                <AvatarBadge boxSize="1.25em" bg="green.500" />
              ) : (
                <AvatarBadge boxSize="1.25em" bg="red.500" />
              )}
            </Avatar>
          </MenuButton>
          <MenuList>
            {/* <MenuItem>{state.username}</MenuItem> */}
            {/* <MenuDivider /> */}
            {/* <MenuItem> */}
            {/*  <SimpleGrid columns={3} rows={1}> */}
            {/*    <Card align="center" onClick={() => setContextWallet("native")}> */}
            {/*      <CardBody> */}
            {/*        <Avatar src={PIONEER_ICON}> */}
            {/*          {nativePaired ? ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
            {/*              </div> */}
            {/*          ) : ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="red.500" /> */}
            {/*              </div> */}
            {/*          )} */}
            {/*        </Avatar> */}
            {/*      </CardBody> */}
            {/*      <small>Pioneer</small> */}
            {/*    </Card> */}
            {/*    <Card align="center" onClick={() => setContextWallet("metamask")}> */}
            {/*      <CardBody> */}
            {/*        <Avatar src={METAMASK_ICON}> */}
            {/*          {metamaskPaired ? ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
            {/*              </div> */}
            {/*          ) : ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="red.500" /> */}
            {/*              </div> */}
            {/*          )} */}
            {/*        </Avatar> */}
            {/*      </CardBody> */}
            {/*      <small>MetaMask</small> */}
            {/*    </Card> */}
            {/*    <Card align="center" onClick={() => setContextWallet("keepkey")}> */}
            {/*      <CardBody> */}
            {/*        <Avatar src={KEEPKEY_ICON}> */}
            {/*          {keepkeyPaired ? ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="green.500" /> */}
            {/*              </div> */}
            {/*          ) : ( */}
            {/*              <div> */}
            {/*                <AvatarBadge boxSize="1.25em" bg="red.500" /> */}
            {/*              </div> */}
            {/*          )} */}
            {/*        </Avatar> */}
            {/*      </CardBody> */}
            {/*      <small>KeepKey</small> */}
            {/*    </Card> */}
            {/*  </SimpleGrid> */}
            {/* </MenuItem> */}
            <Accordion defaultIndex={[0]} allowMultiple>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Box as="span" flex="1" textAlign="left">
                      <small>features:</small>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <small>
                    version: {features?.major_version}.{features?.minor_version}
                    .{features?.patch_version}
                  </small>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            {/* <MenuItem>context: {user.context || "not Paired"}</MenuItem> */}
            {/* <MenuDivider /> */}
            {/* <MenuItem>Total Value(usd): {user.totalValueUsd}</MenuItem> */}
          </MenuList>
        </Menu>
      </Box>
    </Flex>
  );
};

export default Header;
