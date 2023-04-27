import type { ImageProps } from "@chakra-ui/react";
import {
  chakra,
  keyframes,
  forwardRef,
  usePrefersReducedMotion,
} from "@chakra-ui/react";
import * as React from "react";

import logo from "lib/assets/png/bnb.png";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Logo = forwardRef<ImageProps, "img">((props, ref) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} infinite 20s linear`;

  return <chakra.img animation={animation} src={logo} ref={ref} {...props} />;
});
