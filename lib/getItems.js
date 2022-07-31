import axios from 'axios'

import { getMarketContract } from './getMarketContract'

export const getItems = async () => {
  const marketContract = getMarketContract()
  const items = await marketContract.fetchMarketItems()
  return items.map(item => ({
    ...item,
    inMarket: true,
  }));
}