import { useState } from 'react';
import { withApplicationContext } from '../contexts/Application';
import type { PurseInfo } from '../service/Offers';
import type { KeplrUtils } from '../contexts/Provider';
import { ibcAssets } from '../util/ibc-assets';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  TransferTab,
  SKIPTransactionStatus,
  ThemeContextProvider,
  WalletClientContextProvider,
  SkipTransactionSummary,
} from '@leapwallet/elements';
import '@leapwallet/elements/styles.css';

export enum IbcDirection {
  Deposit,
  Withdrawal,
}

interface LeapIbcTransferProps {
  isShowing?: boolean;
  purse?: PurseInfo;
  // direction: IbcDirection;
  // handleClose: () => void;
  keplrConnection?: KeplrUtils;
}

export const LeapIbcTransfer = ({
  isShowing,
  purse,
  keplrConnection,
  // handleClose,
  // direction,
}) => {
  const ibcAsset =
    typeof purse?.brandPetname === 'string'
      ? ibcAssets[purse.brandPetname]
      : undefined;

  const purseBalance = purse?.currentAmount.value;

  console.log('ibcAsset', ibcAsset);
  console.log('purseBalance', purseBalance);

  const [showTxnSummary, setShowTxnSummary] = useState(false);
  const [txnSummary, setTxnSummary] = useState<SkipTransactionSummary | null>(
    null,
  );

  return (
    <Dialog open={isShowing} onClose={close}>
      <ThemeContextProvider theme="dark">
        <WalletClientContextProvider
          value={{
            walletClient: keplrConnection,
            connectWallet: () => console.log('connect wallet handler'),
            userAddress: keplrConnection.address,
          }}
        >
          <DialogTitle>IBC Transfer</DialogTitle>
          <DialogContent>
            {!showTxnSummary ? (
              <TransferTab
                onTxnComplete={(summary: SkipTransactionSummary) => {
                  console.log('summary', summary);
                  setTxnSummary(summary);
                  setShowTxnSummary(true);
                }}
              />
            ) : (
              <SKIPTransactionStatus
                {...txnSummary}
                onClose={() => {
                  setShowTxnSummary(false);
                  setTxnSummary(null);
                }}
              />
            )}
          </DialogContent>
        </WalletClientContextProvider>
      </ThemeContextProvider>
    </Dialog>
  );
};

export default withApplicationContext(LeapIbcTransfer, context => ({
  keplrConnection: context.keplrConnection,
}));
