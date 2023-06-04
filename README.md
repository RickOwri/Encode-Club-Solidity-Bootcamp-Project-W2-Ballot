# Week03 - Project
Form groups of 3 to 5 students
Develop and run scripts for “Ballot.sol” within your group to give voting rights casting votes, delegating votes and querying results
Write a report with each function execution and the transaction hash, if successful, or the revert reason, if failed
Submit your code in a github repository in the form

# scripts
- deploying
- givevoting rights
- casting votes
- delegating votes
- querying results

# 1. Deploying
input
```
clear; yarn run ts-node --files scripts/BallotDeploy.ts Chocolate Strawberry Vanilla Coconut
```

output
```
Connected to the address 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
Alchemy API key length:32
Connected to the Block number 3458301
Balance is 496590966484091177 WEI
Deploying Ballot contract
Proposals: 
Proposal N. 1: Chocolate
Proposal N. 2: Strawberry
Proposal N. 3: Vanilla
Proposal N. 4: Coconut
The ballot contract was deployed at the address 0x88dFBd6F5e43C63fa12B9799cf00Aa1E2Abb9670 at the block number 3458302
The chaiperson for this ballot is 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
```
https://sepolia.etherscan.io/tx/0x5a66fb077584806ce312678146deba60b879506fa0043af31c900da181ab023a

# 2. Give voting right
input 
```
clear; clear; yarn run ts-node --files scripts/BallotGiveVotingRight.ts
```

output
```
Connected to the address 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
Alchemy API key length:32
Connected to the Block number 3458383
Balance is 494922942476307065 WEI
The chaiperson for this ballot is 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
Transaction completed at block 3458384 with hash 0xc784cc83a132cdc87c42e34adae7a3eddc7ba7e39ca1e228d38466dfe2ade8f7
```
https://sepolia.etherscan.io/tx/0x1c9c1e8fe3b11a43a0f4864cdfc7f40b33d72bc11db2f6411c7084e6cee5da0e

# 3. Delegating right to voting

input
```
clear; yarn run ts-node --files scripts/BallotGiveVotingRicght.ts Chocolate Strawberry Vanilla Coconut
```

output
```
Connected to the address 0x3F5b2e7c258C7b29A03731c49217D3fA6d47beBd
Alchemy API key length:32
Connected to the Block number 3458557
Balance is 1000000000000000 WEI
The chaiperson for this ballot is 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
The delegator for this ballot is [object Object] and his delegated is 0x2471B1373F20f52e5ce6Cd0D08b4cE56a75acc44
Transaction completed at block 3458558 with hash 0x3d221e6e82a860db6e0f756d27c14025dc4ea00fd69d81e3cc5854f9b5e1eb6c
```
https://sepolia.etherscan.io/tx/0x9b6fcc935c4e61c3bf13f6fb0a6e361d67c61786a6f8334e5d0a91289db409cd


# 4. casting vote

input
```
clear; yarn run ts-node --files scripts/Ballot.ts Chocolate Strawberry Vanilla Coconut
```

output
```
Connected to the address 0x2471B1373F20f52e5ce6Cd0D08b4cE56a75acc44
Alchemy API key length:32
Connected to the Block number 3458783
Balance is 500000000000000 WEI
The chaiperson for this ballot is 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
The voter for this ballot is 0x2471B1373F20f52e5ce6Cd0D08b4cE56a75acc44
Voter 0x2471B1373F20f52e5ce6Cd0D08b4cE56a75acc44 voted for Proposal 0
Transaction completed at block 3458785 with hash 0xb119dc16002585a320337e3f1ef86d61bc39798751e7f57f87536d833bc7f66e
```
https://sepolia.etherscan.io/tx/0xed3155d8784df8c0aa740c1d9c4b8c8241b30db5238381eb40b90de6dadda10c

# 5. Querying result
input
```
clear; yarn run ts-node --files scripts/BallotCastingVote.ts
```

output
```
Connected to the address 0x3F5b2e7c258C7b29A03731c49217D3fA6d47beBd
Alchemy API key length:32
Connected to the Block number 3458822
Balance is 360861499350687 WEI
The chaiperson for this ballot is 0xc8e653ea3F2245C640506659180a3F2a2189AfB3
The voter for this ballot is 0x3F5b2e7c258C7b29A03731c49217D3fA6d47beBd
The winning proposal is Chocolate
```
