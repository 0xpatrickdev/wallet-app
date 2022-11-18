/**
 * FIXME need to restore this test.
 *
 * Lots of problems with libsodium-wrappers in Jest:
 * https://stackoverflow.com/questions/64012897/creating-an-encrypted-secret-with-libsodium-in-a-jest-unit-test-fails-typeerror
 * https://stackoverflow.com/questions/73088159/importing-libsodium-wrappers-in-jest-throws-the-error-cannot-read-properties-of
 *
 * Tried mocking libsodium-wrappers (https://jestjs.io/docs/manual-mocks) but CRA prevents that
 * https://stackoverflow.com/questions/65626653/create-react-app-doesnt-properly-mock-modules-from-mocks-directory
 *
 */
import { toBase64 } from '@cosmjs/encoding';
import {
  SwingsetMsgs,
  SwingsetConverters,
  toAccAddress,
} from '../util/keyManagement';

const addrToBase64 = a => toBase64(toAccAddress(a));

test('convert spendAction toAmino/fromAmino for Ledger signing', () => {
  const converter =
    SwingsetConverters[SwingsetMsgs.MsgWalletSpendAction.typeUrl];
  const owner = 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp';
  const spendAction = '{give:1, want:1}';
  expect(
    converter.toAmino({ spendAction, owner: addrToBase64(owner) }),
  ).toStrictEqual({
    owner: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
    // note spend_action, not spendAction
    // per golang/cosmos/proto/agoric/swingset/msgs.proto
    spend_action: '{give:1, want:1}',
  });

  expect(
    converter.fromAmino({
      owner: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
      spend_action: '{give:1, want:1}',
    }),
  ).toStrictEqual({ spendAction, owner: addrToBase64(owner) });
});

test('convert provision toAmino/fromAmino for Ledger signing', () => {
  const converter = SwingsetConverters[SwingsetMsgs.MsgProvision.typeUrl];

  const nickname = 'my wallet';
  const powerFlags = ['SMART_WALLET'];
  const address = 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp';
  expect(
    converter.toAmino({
      nickname,
      powerFlags,
      address: addrToBase64(address),
      submitter: addrToBase64(address),
    }),
  ).toStrictEqual({
    address: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
    nickname: 'my wallet',
    powerFlags: ['SMART_WALLET'],
    submitter: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
  });

  expect(
    converter.fromAmino({
      address: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
      nickname: 'my wallet',
      powerFlags: ['SMART_WALLET'],
      submitter: 'agoric168rp3ugmpu0jtla5wjkdlqg20rpv65xxzkh8yp',
    }),
  ).toStrictEqual({
    nickname,
    powerFlags,
    address: addrToBase64(address),
    submitter: addrToBase64(address),
  });
});
