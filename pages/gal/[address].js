import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { useRouter } from 'next/router'

import { List } from '../../components/List'

import { getItems } from '../../lib/getItems'
import { decorateItems } from '../../lib/decorateItems'

export default function MyAssets() {

  const router = useRouter();
  const { address } = router.query

  const [nfts, setNfts] = useState([])

  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    address && loadNFTs()
  }, [ address ])

  async function loadNFTs() {
    const items = await decorateItems(await getItems())
    setNfts(items.filter(item => item.owner === address))
    setLoadingState('loaded')
  }

  return (
  <>
    {nfts.length && <List items={nfts} loadItems={loadNFTs} hideBuy /> || ''}
    {!nfts.length &&
    <>
      <div className="flex justify-center py-10">
        <p>You don't own any molecule yet. Feel free to mint a new molecule:</p>
      </div>
    </>
    }
  </>
  )
}
