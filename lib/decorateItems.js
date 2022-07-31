import axios from 'axios'
import { ethers } from 'ethers'

import { nftaddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
const provider = new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")

const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

export const decorateItems = async (items) => {

  return await Promise.all(items.map(async (i, index) => {

    return {
      ...i,
      price: ethers.utils.formatUnits(i.price.toString(), 'ether'),
      itemId: i.itemId.toNumber(),
      seller: i.seller,
      sold: i.sold,
      tokenId: i.tokenId.toNumber(),

      getData: async () => {

        const [tokenUri, owner] = await Promise.all([
          tokenContract.tokenURI(i.tokenId),
          tokenContract.ownerOf(i.tokenId)
        ])

        try {
          return {
            ...(await axios.get(tokenUri)).data,
            owner,
          }
        } catch(error) {
          return {}
        }
      },
    }

  }))
}