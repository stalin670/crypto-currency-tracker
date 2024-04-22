import React, { useEffect,useState} from 'react'
import { HistoricalChart } from '../Config/api'
import { CurrencyState } from '../Context/CryptoContext'
import "../App.css"
import { CircularProgress } from '@mui/material'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'

import DaysButton from './DaysButton'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

export default function CoinChart({coin}) {
    const [chartData, setChartData] = useState(null)
    const [days, setDays] = useState(1)
    const {currency}=CurrencyState();

    

    const fetchChartData=async ()=>{
        setChartData(null)
        const url=HistoricalChart(coin.id,days,currency)
        const response=await fetch(url);
        const data=await response.json();
        setChartData(data.prices);
    }

    // useEffect(() => {
    //   fetchChartData()
    // }, [])

    useEffect(() => {
        fetchChartData()
      }, [currency,days])
    
       const chartDays = [
        {
          label: "24 Hours",
          value: 1,
        },
        {
          label: "30 Days",
          value: 30,
        },
        {
          label: "3 Months",
          value: 90,
        },
        {
          label: "1 Year",
          value: 365,
        },
      ];

  return (
   <div id="chartContainer">
        {chartData?<><Line data={{
                labels:chartData.map((coin)=>{
                    const date=new Date(coin[0]);
                    let time=date.getHours();
                    time=(time>12?(time-12+"PM"):(time+"AM"));
                    return (days===1?time:date.toLocaleDateString());
                }),
                datasets:[
                    {
                        data:chartData.map((coin)=>coin[1]),
                        label: `Price (Past ${days} days) in ${currency}`,
                        borderColor:"#EEBC1D"
                    }
                ]
               
            }
            
            } options={
              {
                elements:{point:{radius:1,hoverRadius:2}}
              }
              } redraw={true} ></Line>
            <div id="daysBtnContainer">
                {chartDays.map((day)=>{
                    return <DaysButton key={day.value} label={day.label} selected={day.value===days} value={day.value}
                    setDays={setDays}/>
                })}
            </div>
            </>
            
        :<CircularProgress size={240} thickness={1.1} sx={{color:"gold"}}></CircularProgress>}
        
   </div>
  )
}
