import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// 
const CONTRACT_ADDRESS = "0x88dFBd6F5e43C63fa12B9799cf00Aa1E2Abb9670"
// const COMPAGNON = "0x3F5b2e7c258C7b29A03731c49217D3fA6d47beBd"
// const COMPAGNON_DELEGATED = "0x2471B1373F20f52e5ce6Cd0D08b4cE56a75acc44"

const VOTED_PROPOSAL = 0

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

  // Can I connect from another wallet
  /// - does all the accounts in my wallet are connected to the same sepolia account ? 
  const signer = wallet.connect(provider);    
  const balance = await signer.getBalance();
  console.log(`Balance is ${balance} WEI`);

  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.attach(CONTRACT_ADDRESS);
  const chairperson = await ballotContract.chairperson();
  console.log(`The chaiperson for this ballot is ${chairperson}`);
  
  console.log(`The voter for this ballot is ${wallet.address}`)
  
  const result = await ballotContract.winnerName();
  
  console.log(`The winning proposal is ${ethers.utils.parseBytes32String(result)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});