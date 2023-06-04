import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

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
  const balanceBN = await signer.getBalance();
  
  
  
  
  
  const balance = Number(ethers.utils.formatEther(balanceBN));

  console.log(`Wallet balance ${balance}`);

  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  
  
  
  console.log(`Balance is ${balanceBN} WEI`);

  const proposals = process.argv.slice(2);
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = await ballotContractFactory.deploy(
    proposals.map(ethers.utils.formatBytes32String)
  );
  const deployTxReceipt = await ballotContract.deployTransaction.wait();
  console.log(
    `The ballot contract was deployed at the address ${ballotContract.address} at the block number ${deployTxReceipt.blockNumber}`
  );
  const chairperson = await ballotContract.chairperson();
  console.log(`The chaiperson for this ballot is ${chairperson}`);

//   const lastRead = await contract.getBtcSpotPrice();
//   console.log("Last price:");
//   console.log(ethers.utils.formatUnits(lastRead));

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});