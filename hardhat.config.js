require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: "NIVIIMK6J6MW72MUD5IAE7IEBNRCN3DDKW",
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    goerli: {
      url: "https://goerli.infura.io/v3/7b0668bb1cbf4557892a221c43170d8e",
      accounts: [
        "e7f32ed7cea70d3d8e1b4ce4c776f367b65ac82def4f2ae773dbab5d1c6f7a40",
      ],
    },
  },
};
