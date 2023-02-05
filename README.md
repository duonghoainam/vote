# vote
## install and run project (owner of the vote still be me)
### 1: make sure you are using **node version 14 or 16**
### 1: clone project
### 1: run command "npm install"
### 1: install and use **goerli test network** on metamask
### 1: run command "npm run dev"

## install and run project (if you want to be the owner)
### 1: make sure you are using **node version 14 or 16**
### 1: clone project
### 1: run command "npm install"
### 1: install and use **goerli test network** on metamask
### 1: delete file "context/Create.json"
### 1: run command "npm install --save-dev hardhat"
### 1: replace **etherscan apiKey** and **goerli url, accounts** of yours in "hardhat.config.js"
### 1: run command "npx hardhat run --network goerli scripts/deploy.js"
### 1: copy the genarate of **constract address** that you have just deployed and replace **VotingAddress** in "context/constants.js" by that
### 1: copy file "artifacts\contracts\VotingContract.sol\Create.json" to "context/Create.json"
### 1: run command "npx hardhat verify --network goerli constract <constract  address>"
### 1: replace **pinata_api_key** and **pinata_secret_api_key** of yours in "Voter.js"
### 1: run command "npm run dev"
