import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", function () {
  let ballotContract: Ballot;

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect((await ballotContract.proposals(index)).voteCount).to.be.equal(0);
      };
    });

    it("sets the deployer address as chairperson", async function () {
      const accounts = await ethers.getSigners();
      const deployer = accounts[0].address;
      const chairperson = await ballotContract.chairperson()
      expect(deployer).to.be.eq(chairperson)
      });


    it("sets the voting weight for the chairperson as 1", async function () {
      // chairperson address
      const chairperson = await ballotContract.chairperson()
      const voteParticipation = await ballotContract.voters(chairperson)
      // const chairpersonRightToVote = await ballotContract.giveRightToVote(chairperson)
      expect(voteParticipation.weight).to.be.eq(1);
    });
  });
// ----------------------------------------------------------------------------------------------------------------//
  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      const signers = await ethers.getSigners()
      const newVoter = signers[1].address 
      const chairperson = await ballotContract.chairperson()
      await ballotContract.giveRightToVote(newVoter)
      const voteParticipation = await ballotContract.voters(newVoter)
      // const chairpersonRightToVote = await ballotContract.giveRightToVote(chairperson)
      expect(voteParticipation.weight).to.be.eq(1);  
    });

    it("can not give right to vote for someone that has voted", async function () {
      const signers = await ethers.getSigners();

      await ballotContract.giveRightToVote(signers[2].address);

      await ballotContract
        .connect(signers[2])
        .vote(2);

      await expect(ballotContract.giveRightToVote(signers[2].address)).to.be.revertedWith("The voter already voted.");
    });

    it("can not give right to vote for someone that has already voting rights", async function () {
      const signers = await ethers.getSigners();

      await ballotContract.giveRightToVote(signers[3].address);

      await expect(ballotContract.giveRightToVote(signers[3].address)).to.be.reverted;
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {

    it("should register the vote", async () => {
      const signers = await ethers.getSigners();
      const account4 = signers[4]
      await ballotContract.giveRightToVote(account4.address)
      await ballotContract
        .connect(account4)
        .vote(0)
      await expect((await ballotContract.voters(account4.address)).voted).to.equal(true);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    // TODO
    it("should transfer voting power", async () => {
      const signers = await ethers.getSigners();
      const account4 = signers[4]
      const delegated = signers[2]
      await ballotContract.giveRightToVote(account4.address)
      await ballotContract
        .connect(account4)
        .delegate(signers[2].address);
    
      await expect((await ballotContract.voters(account4.address)).delegate).to.be.eq(delegated.address);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {

    it("should revert", async () => {
      const signers = await ethers.getSigners();
      const attacker = signers[3]
      await expect(ballotContract
        .connect(attacker)
        .giveRightToVote(attacker.address)).to.be.revertedWith('Only chairperson can give right to vote.');
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    // TODO
    it("should revert", async () => {
      const signers = await ethers.getSigners();
      const attacker = signers[3]
      await expect(ballotContract
        .connect(attacker)
        .vote(3)).to.be.revertedWith('Has no right to vote');

    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    // TODO
    it("should revert", async () => {
      const signers = await ethers.getSigners();
      const attacker = signers[3]
      await expect(ballotContract
        .connect(attacker)
        .delegate(attacker.address)).to.be.revertedWith('Self-delegation is disallowed.');

    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    // TODO
    it("should return 0", async () => {
      expect(await ballotContract
        .winningProposal()).to.be.eq(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return 0", async () => {
      await ballotContract.vote(1);
      expect(await ballotContract
        .winningProposal()).to.be.equal(1);
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    // TODO
    it("should return name of proposal 0", async () => {     
      const winnerName = await ballotContract.winnerName()
      expect(ethers.utils.parseBytes32String(winnerName)).to.be.eq(PROPOSALS[0]);
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    // TODO
    it("should return name of proposal 0", async () => {
      await ballotContract.vote(0);
      const winnerName= await ballotContract.winnerName()
      expect(ethers.utils.parseBytes32String(winnerName)).to.be.eq(PROPOSALS[0]);

    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {

    it("should return the name of the winner proposal", async () => {
      const accounts = await ethers.getSigners();
      await ballotContract.giveRightToVote(accounts[1].address);
      await ballotContract.giveRightToVote(accounts[2].address);
      await ballotContract.giveRightToVote(accounts[3].address);
      await ballotContract.giveRightToVote(accounts[4].address);
      await ballotContract.giveRightToVote(accounts[5].address);

      await ballotContract.connect(accounts[0]).vote(1);
      await ballotContract.connect(accounts[1]).vote(1);
      await ballotContract.connect(accounts[2]).vote(0);
      await ballotContract.connect(accounts[3]).vote(2);
      await ballotContract.connect(accounts[4]).vote(0);

      const winnerName = await ballotContract.winnerName();
      expect(ethers.utils.parseBytes32String(winnerName)).to.eq(PROPOSALS[0]);       

    });
  });
});