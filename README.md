# vote
## install and run project (owner of the vote still be me)
### 1: make sure you are using **node version 14 or 16**
### 2: clone project
### 3: run command "npm install"
### 4: install and use **goerli test network** on metamask
### 5: run command "npm run dev"
----------------------------------------------------------------------------------------------------------------------
## install and run project (if you want to be the owner)
### 1: make sure you are using **node version 14 or 16**
### 2: clone project
### 3: run command "npm install"
### 4: install and use **goerli test network** on metamask
### 5: delete file "context/Create.json"
### 6: run command "npm install --save-dev hardhat"
### 7: replace **etherscan apiKey -> etherscan key** and **goerli url -> infura api key, accounts -> private key of metaMask** of yours in "hardhat.config.js"
### 8: run command "npx hardhat run --network goerli scripts/deploy.js"
### 9: copy the genarate of **constract address** that you have just deployed and replace **VotingAddress** in "context/constants.js" by that
### 10: copy file "artifacts\contracts\VotingContract.sol\Create.json" to "context/Create.json"
### 11: run command "npx hardhat verify --network goerli constract <constract  address>"
### 12: replace **pinata_api_key** and **pinata_secret_api_key** of yours in "Voter.js"
### 13: run command "npm run dev"
