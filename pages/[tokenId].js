import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import { useRouter } from 'next/router'

import { Item } from '../components/Item'

import { buyNft } from '../lib/buyNft'

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function NFTView() {

  const router = useRouter();

  const { tokenId } = router.query

  const [nft, setNft] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    tokenId && loadNFT()
  }, [ tokenId ])

  async function loadNFT() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)

    const data = await marketContract.fetchMarketItems()
    const found = data.find(item => item.tokenId.toNumber() === parseInt(tokenId))

    const getData = async () => {

      const [tokenUri, owner] = await Promise.all([
        tokenContract.tokenURI(tokenId),
        tokenContract.ownerOf(tokenId)
      ])

      try {
        return {
          owner,
          ...(await axios.get(tokenUri)).data,
        }
      } catch(error) {
        return {}
      }
    }

    const nftData = await getData(tokenId);

    nftData && setNft({
      getData,
      ...await getData(),
      ...found,
      inMarket: Boolean(found),
      price: found ? ethers.utils.formatUnits(found.price.toString(), 'ether') : 0,
    });

    setLoadingState('loaded')
  }

  if (!nft) {
    return <></>
  }

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '800px', flex: 1 }}>
        <div className="pt-4">
          {nft &&
          <Item
            item={nft}
            buyNft={() => buyNft({ nft, onSuccess: () => loadNFT() })}
            //onClick={() => router.push(`/${nft.itemId}`)}
            onTools={() => router.push(`/${tokenId}/tools`)}
            onVR={() => router.push(`/${tokenId}/vrtools`)}
          />}
        </div>
      </div>
    </div>
  )
}
