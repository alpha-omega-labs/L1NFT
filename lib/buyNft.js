import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import {
  nftaddress, nftmarketaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export async function buyNft({
  nft,
  onSuccess,
}) {
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)

  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
  const transaction = await contract.createMarketSale(nftaddress, nft.itemId, {
    value: price
  })
  await transaction.wait()
  onSuccess && onSuccess()
}
