import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";
// Use the JWT key
const pinataSDK = require('@pinata/sdk');
const fs = require('fs');

//INTERNAL IMPORT
import { VotingAddress, VotingAddressABI } from "./constants";
const pinata = new pinataSDK('bb9ff49e678faf43fc04', '24cf032814ae6f97b06e08730038774e2e8a51be442746a6b8073a9cf4cc7f37');
// const pinata = new pinataSDK({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4NGM5MzVjMS05NjRlLTQzMGYtYWJiZS0yYTVmMWVjZjg3OTUiLCJlbWFpbCI6Im5hbWRlcHRyYWl1bUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYmI5ZmY0OWU2NzhmYWY0M2ZjMDQiLCJzY29wZWRLZXlTZWNyZXQiOiIyNGNmMDMyODE0YWU2Zjk3YjA2ZTA4NzMwMDM4Nzc0ZTJlOGE1MWJlNDQyNzQ2YTZiODA3M2E5Y2Y0Y2M3ZjM3IiwiaWF0IjoxNjc1NDc3NzMzfQ.lOTFZ5QbzoUrI3Wv2J6Cu7wc8cymR6pWRZR67py66kgyourPinataJWTKey'});
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const ipfsUrl = 'https://gateway.pinata.cloud/ipfs/';

const fetchContract = (signerOrProvider) =>
new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);
  // =========================================================
  //---ERROR Message
  const [error, setError] = useState("");
  const higestVote = [];

  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);
  ///CONNECTING METAMASK
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Install MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      getAllVoterData();
      getNewCandidate();
    } else {
      setError("Please Install MetaMask & Connect, Reload");
    }
  };

  // ===========================================================
  //CONNECT WELATE
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask");

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    getAllVoterData();
    getNewCandidate();
  };
  // ================================================

  //UPLOAD TO IPFS Voter
  const uploadToIPFS = async (file) => {
    try {
      pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        console.log(result);
        }).catch((err) => {
            console.log(err);
        });

          if (file) {
              try {
                  const formData = new FormData()
                  formData.append("file", file)
  
                  const resFile = await axios({
                      method: "post",
                      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                      data: formData,
                      headers: {
                          pinata_api_key: `bb9ff49e678faf43fc04`,
                          pinata_secret_api_key: `24cf032814ae6f97b06e08730038774e2e8a51be442746a6b8073a9cf4cc7f37`,
                          "Content-Type": "multipart/form-data",
                      },
                  })
  
                  console.log(resFile)
                  return ipfsUrl + resFile.data.IpfsHash;
                  // setNftHash(resFile.data.IpfsHash)
              } catch (error) {
                  console.log("Error sending File to IPFS: ", error)
                  return error;
              }
          }
      

      // const readableStreamForFile = fs.createReadStream('./candidate.png');
      // const options = {
      //     pinataMetadata: {
      //         name: "vote",
      //     },
      // };
      // pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
      //     //handle results here
      //     console.log(result);
      //     return result;
      // }).catch((err) => {
      //     //handle error here
      //     console.log(err);
      //     return err;
      // });
      ////////
    //   const a = await pinata.pinFileToIPFS(file);

    //   const added = await client.add({ content: file });
    //   const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      // setImage(url);
    } catch (error) {
      console.log("Error uploading file to IPFS", error);
    }

  };
  //CREATE VOTER----------------------
  const createVoter = async (formInput, fileUrl) => {
    const { name, address, position } = formInput;

    if (!name || !address || !position)
      return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({ name, address, position, image: fileUrl });
    console.log(data);
    // const added = await client.add(data);
    const resJson = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
          pinata_api_key: `bb9ff49e678faf43fc04`,
          pinata_secret_api_key: `24cf032814ae6f97b06e08730038774e2e8a51be442746a6b8073a9cf4cc7f37`,
          "Content-Type": "application/json",
      },
  })

  console.log(resJson)

    const url = ipfsUrl + resJson.data.IpfsHash;

    const voter = await contract.voterRight(address, name, url, fileUrl);
    voter.wait();

    console.log(voter);

    router.push("/voterList");
  };
  // =============================================
  //UPLOAD TO IPFS Candidate
  const uploadToIPFSCandidate = async (file) => {
    // try {
    //   const added = await client.add({ content: file });

    //   const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    //   console.log(url);
    //   return url;
    // } catch (error) {
    //   console.log("Error uploading file to IPFS");
    // }
    if (file) {
      try {
          const formData = new FormData()
          formData.append("file", file)

          const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                  pinata_api_key: `bb9ff49e678faf43fc04`,
                  pinata_secret_api_key: `24cf032814ae6f97b06e08730038774e2e8a51be442746a6b8073a9cf4cc7f37`,
                  "Content-Type": "multipart/form-data",
              },
          })

          console.log(resFile)
          return ipfsUrl + resFile.data.IpfsHash;
          // setNftHash(resFile.data.IpfsHash)
      } catch (error) {
          console.log("Error sending File to IPFS: ", error)
          return error;
      }
  }
  };
  // =============================================

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);
      //VOTR LIST
      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterData(el);
        pushVoter.push(singleVoterData);
        console.log(singleVoterData)
      });

      //VOTER LENGHT
      const voterList = await contract.getVoterLength();
      setVoterLength(voterList.toNumber());
      console.log(voterLength);
    } catch (error) {
      console.log("All data");
    }
  };

  // =============================================

  // =============================================
  ////////GIVE VOTE

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voteredList = await contract.vote(voterAddress, voterId);
      console.log(voteredList);
    } catch (error) {
      setError("Sorry!, You have already voted, Reload Browser");
    }
  };
  // =============================================

  const setCandidate = async (candidateForm, fileUrl, router) => {
    const { name, address, age } = candidateForm;

    if (!name || !address || !age) return console.log("Input Data is missing");

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const data = JSON.stringify({
      name,
      address,
      image: fileUrl,
      age,
    });

    const resJson = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      data: data,
      headers: {
          pinata_api_key: `bb9ff49e678faf43fc04`,
          pinata_secret_api_key: `24cf032814ae6f97b06e08730038774e2e8a51be442746a6b8073a9cf4cc7f37`,
          "Content-Type": "application/json",
      },
  })

  console.log(resJson)

    const ipfs = ipfsUrl + resJson.data.IpfsHash;

    // const added = await client.add(data);

    // const ipfs = `https://ipfs.infura.io/ipfs/${added.path}`;

    const candidate = await contract.setCandidate(
      address,
      age,
      name,
      fileUrl,
      ipfs
    );
    candidate.wait();

    router.push("/");
  };

  const getNewCandidate = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    //---------ALL CANDIDATE
    const allCandidate = await contract.getCandidate();

    //--------CANDIDATE DATA
    allCandidate.map(async (el) => {
      const singleCandidateData = await contract.getCandidateData(el);

      pushCandidate.push(singleCandidateData);
      candidateIndex.push(singleCandidateData[2].toNumber());
    });

    //---------CANDIDATE LENGTH
    const allCandidateLength = await contract.getCandidateLength();
    setCandidateLength(allCandidateLength.toNumber());
  };

//   console.log(error);

  return (
    <VotingContext.Provider
      value={{
        currentAccount,
        connectWallet,
        uploadToIPFS,
        createVoter,
        setCandidate,
        getNewCandidate,
        giveVote,
        pushCandidate,
        candidateArray,
        uploadToIPFSCandidate,
        getAllVoterData,
        voterArray,
        giveVote,
        checkIfWalletIsConnected,
        error,
        candidateLength,
        voterLength,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
