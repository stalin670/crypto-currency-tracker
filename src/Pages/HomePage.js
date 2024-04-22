import React from 'react'
import "../App.css"
import CoinsTableContainer from '../Components/CoinsTableContainer'

import TrendingList from '../Components/TrendingList'

export default function HomePage() {
  return (
    <>
    <div id="homeBanner">
        <div id="bannerContent">
            <div id="bannerTitle">Coin Edge</div>
            <div id="tagline">The Easiest Way to Stay Informed About Your Crypto Assets.</div>
            <TrendingList/>
        </div>
    </div>
    <CoinsTableContainer/>
    </>
  )
}
