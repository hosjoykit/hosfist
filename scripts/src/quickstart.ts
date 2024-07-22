/**
 * This example shows how to use the Aptos client to create accounts, fund them, and transfer between them.
 */
 
import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey,Serializer, InputViewFunctionData, TypeTag, TypeTagSigner } from "@aptos-labs/ts-sdk";

const privateKey = '0xc7ebe9d4a6c9fee76c11a90a3054004dbf561a65830834125db756fb8d822868'
const private2Key = '0xe3f096e6fe723be9b8dc5cf186f6b06a24521156e5fa42649b15068406952fb8'

async function example() {
  console.log(
    "This example will create two accounts (Alice and Bob), fund them, and transfer between them.",
  );
  // Setup the client
  const config = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(config);
  // Generate two account credentials
  // Each account has a private key, a public key, and an address
  
  const alice = Account.fromPrivateKey({privateKey: new Ed25519PrivateKey(privateKey)})
  const bAccount = Account.fromPrivateKey({privateKey: new Ed25519PrivateKey(private2Key)})

  await fetch(`https://faucet.testnet.aptoslabs.com/mint?amount=100000000&address=${bAccount.accountAddress.toString()}`, {
    method: 'post'
  })
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const value = await aptos.getAccountAPTAmount({
    accountAddress: alice.accountAddress
  })

  console.log(`value=====${value}`)



  const txSimple = await aptos.transaction.build.simple({
    sender: alice.accountAddress,
    data: {
      function: `0xcf73c47627692657a648ac78aa2230682348442220defc728dde653e9efe3066::hosfist::bet_handler`,
      functionArguments: [1]
    }
  })
  

  const pendingTxn = await aptos.signAndSubmitTransaction({
    signer: alice,
    transaction: txSimple,
  })
  const response = await aptos.waitForTransaction({
    transactionHash: pendingTxn.hash,
  });
  
  console.log(((response as any).events as any[]).find(item => item.type === '0xcf73c47627692657a648ac78aa2230682348442220defc728dde653e9efe3066::hosfist::BetLog'))


  const value1 = await aptos.getAccountAPTAmount({
    accountAddress: alice.accountAddress
  })
  console.log(`value1=====${value1}`)

 
}
 
example();