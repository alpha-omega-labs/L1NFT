import { useEffect, useState, useRef } from 'react'

import { ethers } from 'ethers'

import axios from 'axios'

import styled from 'styled-components'

import { useRouter } from 'next/router'

import { buyNft } from '../../lib/buyNft'

import {
  nftaddress, nftmarketaddress
} from '../../config'

import NFT from '../../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../../artifacts/contracts/Market.sol/NFTMarket.json'

const Header = styled.header`
text-align: center;
margin-top: 32px;

& h1 {
  font-size: 1.5em;
}

& h1, & h2 {
  margin: 10px 0;
}
`

const Footer = styled.footer`
display: flex;
padding: 15px;

& button {
  flex: 1;
  margin: 0 7.5px;
}
`

export default function NFTView() {

  const router = useRouter();
  const el = useRef();

  const { tokenId } = router.query

  const [nft, setNft] = useState()
  const [loadingState, setLoadingState] = useState('not-loaded')

  const [ file, setFile ] = useState();
  const [ size, setSize ] = useState();

  useEffect(() => {
    el.current && setSize([el.current.offsetWidth, el.current.offsetHeight])
  }, [ nft ])

  useEffect(() => {

    tokenId && (async () => {
      const provider = new ethers.providers.JsonRpcProvider("https://rpcb.genesisL1.org")
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, provider)
      const data = await marketContract.fetchMarketItems()
      const found = data.find(item => item.itemId.toNumber() === parseInt(tokenId))

      console.log(found)

      const getData = async () => {
        const tokenUri = await tokenContract.tokenURI(tokenId)
        try {
          return (await axios.get(tokenUri)).data
        } catch(error) {
          return {}
        }
      }

      const nftData = {
        ...found,
        price: found && ethers.utils.formatUnits(found.price.toString(), 'ether'),
        getData,
        ...await getData(),
      }

      nftData && setNft(nftData);

      setFile(nftData.image);
    })()

  }, [ tokenId ])

  if (!nft) {
    return ''
  }

  return (
  <>
    <Header>
      <h1>{nft?.name}</h1>
      <h3>{nft?.description}</h3>
    </Header>

    <div className="flex justify-center" style={{ flex: 1, display: 'flex' }} ref={el}>
      {file && size &&
      <iframe
        allowFullScreen={true}
        src={`https://vrmol.net/index.html?type=cif&id=${file}&panelShow=1&mainMode=13&vrmode=vr`}
        style={{ border: 'none', flex: 1 }}
      />
      }
    </div>

    <Footer>
      {buyNft && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => buyNft({ nft })}>Accio ({nft.price} L1)</button>}
      <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => router.push(`/${nft.itemId}`)}>View</button>
      <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => router.push(`/${nft.itemId}/tools`)}>Analysis</button>
    </Footer>
  </>
  )
}
