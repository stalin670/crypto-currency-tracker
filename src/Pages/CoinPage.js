import { Button, LinearProgress } from '@mui/material';
import HTMLReactParser from 'html-react-parser';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SingleCoin } from '../Config/api';
import { CryptoState, CurrencyState, SymbolState } from '../Context/CryptoContext'
import CoinChart from '../Components/CoinChart';
import {db} from '../firebase'
import { doc,setDoc } from 'firebase/firestore';


export default function CoinPage() {
  const {id}=useParams()
  

  const {currency}=CurrencyState();
  const {symbol}=SymbolState();

  const [coin, setCoin] = useState(null)

  

  const {user,watchlist,coinId,setCoinId,setAlert}=CryptoState()
  setCoinId(id)
 

  const fetchCoin=async ()=>{
    const url=SingleCoin(id);
    const response=await fetch(url);
    const data=await response.json();
    setCoin(data);
  }

  useEffect(() => {
      fetchCoin();
  }, [coinId])

  function displayMarketCap(market_cap){
    return symbol+Math.round((market_cap/1000000)).toLocaleString()+"M";
  }
  function displayCurrentPrice(current_price){
    return symbol+Math.round((current_price)).toLocaleString();
  }

  async function handleAddToWatchlist(){
    let isInWatchlist=watchlist.includes(id);
    if(!isInWatchlist){
      const docRef=doc(db,"watchlist",user.uid);
      try{
        await setDoc(docRef,{
          coins: watchlist? [...watchlist,id]:[id]
        })
        setAlert({
          open: true,
          message: `${id.toUpperCase()} added to your Watchlist`,
          type: 'success'
        })
      }
      catch(err){
        setAlert({
          open: true,
          message: String(err.message),
          type: 'error'
        })
      }
      
    }
  }

  async function handleRemoveFromWatchlist(){
   
      const docRef=doc(db,"watchlist",user.uid);
      try{
        await setDoc(docRef,{
          coins: watchlist.filter((coin)=>coin!=id)
        })
        setAlert({
          open: true,
          message: `${id.toUpperCase()} removed from your watchlist`,
          type: 'success'
        })
      }
      catch(err){
        setAlert({
          open: true,
          message: String(err.message),
          type: 'error'
        })
      }
     
  
  }
  
  if(!coin) return (<LinearProgress sx={{backgroundColor:"gold"}}></LinearProgress>)
  return (
   
    <div id="coinPageContainer">
      <div id="coinDescriptionSidebar">
        <img src={coin?.image?.large}  id="sidebarImg" alt={coin?.name} />
        <div id="sidebarName">{coin?.name}</div>
        <div id="sidebarDescription">{HTMLReactParser(String(coin?.description?.en.split('. ')[0]))}</div>
        <div id="sidebarInfoContainer">
          <span className="sidebarInfo"><span className="sidebarInfoHead">Rank:</span>{coin?.market_cap_rank}</span>
          <span className="sidebarInfo"><span className="sidebarInfoHead">Current Price:</span>{displayCurrentPrice(coin?.market_data?.current_price[currency.toLowerCase()])}</span>
          <span className="sidebarInfo"><span className="sidebarInfoHead">Market Cap:</span>{displayMarketCap(coin?.market_data?.market_cap[currency.toLowerCase()])}</span>
        </div>
        {user && <Button variant='contained' onClick={!watchlist.includes(id)?handleAddToWatchlist: handleRemoveFromWatchlist} id={!watchlist.includes(id)?"addToWatchlistBtn":"removeFromWatchlistBtn"}>{!watchlist.includes(id)?"Add to Watchlist":"Remove From Watchlist"}</Button>}
      </div>
      <CoinChart coin={coin}/>
    </div>
  )
}
