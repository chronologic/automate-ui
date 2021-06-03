import React from "react";
import styled from "styled-components";
import { useWallet } from "use-wallet";

import Connect from "./Connect";
import Connected from "./Connected";

interface IProps {
  className: string;
}

function WalletConnector({ className = "" }: Partial<IProps>) {
  const wallet = useWallet();

  return (
    <Container className={className}>
      {wallet.status === "connected" ? (
        <Connected wallet={wallet} />
      ) : (
        <Connect wallet={wallet} />
      )}
    </Container>
  );
}

const Container = styled.div``;

export default WalletConnector;
