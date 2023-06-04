import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

// const Proposals = ["Proposal 1", "Proposal 2", "Proposal 3"];


// const ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ADDRESS = ethers.Wallet.createRandom();
// const ADDRESS = contractAddress



async function main() {
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    console.log(`Connected to the address ${wallet.address}`);
    console.log(`Alchemy API key length:`+process.env.ALCHEMY_API_KEY?.length);

    // const provider = ethers.getDefaultProvider("goerli");
    // const provider = new ethers.providers.AlchemyProvider(
    //     "goerli",
    //     process.env.ALCHEMY_API_KEY
    //     )

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
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });
    const ballotContractFactory = new Ballot__factory(signer);
    // const ContractFactory = await ethers.getContractFactory("Ballot");
    const ballotContract = await ballotContractFactory.deploy(
        proposals.map(ethers.utils.formatBytes32String)
    );
    const deployTxReceipt = await ballotContract.deployTransaction.wait();
    console.log(
        `The ballot contract was deployed at the address ${ballotContract.address} at the block number ${deployTxReceipt.blockNumber}`
    );
    const chairperson = await ballotContract.chairperson();
    console.log(`The chaiperson for this ballot is ${chairperson}`);
    console.log(`Giving voting right to ${ADDRESS}`);
    const giveRightToVoteTx = await ballotContract.giveRightToVote(ADDRESS);
    const giveRightToVoteTxReceipt = await giveRightToVoteTx.wait();
    console.log(
        `Transaction completed at block ${giveRightToVoteTxReceipt.blockNumber} with hash ${giveRightToVoteTxReceipt.blockHash}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});