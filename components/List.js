import { useRouter } from 'next/router'
import styled from 'styled-components'

import { Item } from '../components/Item'

import { buyNft } from '../lib/buyNft'

const Grid = styled.div`
display: grid;
grid-auto-columns: max-content; //added
grid-auto-flow: dense; // added

grid-auto-rows: 1fr;
gap: 30px;

grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
column-gap: 30px;
`

export const List = ({
  items,
  loadItems,
  hideBuy,
}) => {

  const router = useRouter();

  return(
  <div className="flex justify-center">
    <div className="px-4" style={{ maxWidth: '1600px', width: '100%', marginTop: '60px' }}>
      <Grid>
        {
          items.map((nft, i) =>
          <Item
            list
            key={i}
            item={nft}
            buyNft={!hideBuy && (() => buyNft({ nft, onSuccess: () => loadItems() }))}
            onClick={() => router.push(`/${nft.tokenId}`)}
            onTools={() => router.push(`/${nft.tokenId}/tools`)}
            onVR={() => router.push(`/${nft.tokenId}/vrtools`)}
          />)
        }
      </Grid>
    </div>
  </div>
  )
}
