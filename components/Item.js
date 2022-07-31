import { useEffect, useState, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'

import { ContentBox } from './ContentBox'
import { Molecule } from './Molecule'
import { getMolFormat } from '../lib/getMolFormat'

import { FILESIZE_LIMIT_ANALYSIS_BUTTON } from '../etc/settings'

import styled from 'styled-components'

const Actions = styled.div`
display: flex;
& > button {
  flex: 1;
  margin: 0 5px;
  font-size: 12px;
}
`

export const Item = ({
  children,
  list,
  item: {
    getData,
    inMarket,
    ...item
  },
  innerRef,
  buyNft,
  onClick,
  onTools,
  onVR,
}) => {

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const [ data, setData ] = useState();

  useEffect(() => {
    if (!inView || data) {
      return;
    }

    (async () => {

      const data = await getData();
      const { format , size } = await getMolFormat(data.image)

      setData({
        ...item,
        ...(await getData()),
        format,
        size,
      })
    })()
  }, [ Boolean(inView) ])

  const show = data?.size < FILESIZE_LIMIT_ANALYSIS_BUTTON

  return(
  <div className="border shadow rounded-xl overflow-hidden" ref={ref} style={{ width: '100%' }}>
  <ContentBox>
    {data && <Molecule list={list} src={data?.image}/>}
  </ContentBox>
  <div className="p-4">
    <p style={{ height: '64px' }} className="text-2xl font-semibold">{data?.name}</p>
    <div style={{ height: '70px', overflow: 'hidden' }}>
      <p className="text-white lowercase text-justify">{data?.description}</p>
    </div>
  </div>
  <div className="p-4 bg-black">
    {inMarket && <p className="text-2xl mb-4 font-bold text-white">{data?.price} L1</p>}
    {!inMarket && <p className="text-2xl mb-4 font-bold text-white">Already bought or not for sale</p>}

    <Actions>
      {inMarket && buyNft && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={() => buyNft(data)}>Accio</button>}
      {onClick && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onClick}>View</button>}
      {show && data.format !== 'cif' && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onTools}>Analysis</button>}
      {show && data.format !== 'cif' && <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={onVR}>Bioverse</button>}
    </Actions>
  </div>

  {!list &&
  <div className="p-4 bg-black" style={{ wordBreak: 'break-all' }}>
    {data?.owner && data.owner !== '0x0000000000000000000000000000000000000000' && <p><strong>Owner</strong> {data.owner}</p> || <p>No current owner</p>}
    {data?.seller && <p><strong>Seller</strong> {data.seller}</p>}
  </div>
  }

  </div>
  )
}
