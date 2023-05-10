import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// 
const CONTRACT_ADDRESS = "0x88dFBd6F5e43C63fa12B9799cf00Aa1E2Abb9670"
const COMPAGNON = "0x3F5b2e7c258C7b29A03731c49217D3fA6d47beBd"

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Connected to the address ${wallet.address}`);
  console.log(`Alchemy API key length:` + process.env.ALCHEMY_API_KEY?.length);
  const provider = new ethers.providers.InfuraProvider(
    "sepolia",
    process.env.INFURA_API_KEY
  );
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected to the Block number ${lastBlock?.number}`);
  const signer = wallet.connect(provider);    
  const balance = await signer.getBalance();
  console.log(`Balance is ${balance} WEI`);

  const proposals = process.argv.slice(2);
 
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(CONTRACT_ADDRESS);
  const chairperson = await ballotContract.chairperson();
  
  console.log(`The chaiperson for this ballot is ${chairperson}`);
  const giveRightToVoteTx = await ballotContract.giveRightToVote(COMPAGNON);

  console.log(`The Right to vote will be given to ${COMPAGNON}`)
  const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
  
  console.log(
    `Transaction completed at block ${giveRightToVoteTxReceipt.blockNumber} with hash ${giveRightToVoteTxReceipt.blockHash}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});