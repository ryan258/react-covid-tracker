import React, { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 0
    }
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0")
      }
    }
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          parser: "MM/DD/YY",
          tooltipFormat: "ll",
        }
      }
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a $ in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a")
          }
        }
      }
    ],
  }
}

function LineGraph({ casesType = "cases" }) {
  const [data, setData] = useState({})

  // https://disease.sh/v3/covid-19/historical/all?lastdays=30
  useEffect(() => {
    const fetchData = async () => {
      await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
      .then(response => response.json())
      .then(data => {
        // console.log('Line Graph data: ', data)
        const chartData = buildChartData(data, casesType);
        // console.log(chartData)

        setData(chartData);
      })
    }

    fetchData()
  }, [casesType])

  // data: [{
  //   x: 10,
  //   y: 20
  // },... lastDataPoint so we can get the difference between 2 dates
  
  const buildChartData = (data, casesType = 'cases') => {
    const chartData = []
    let lastDataPoint;
    
    for (let date in data.cases) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date,
          y: data[casesType][date] - lastDataPoint
        }
        chartData.push(newDataPoint)
      }
      lastDataPoint = data[casesType][date]
    }
    return chartData
  }
  
  
    
  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [{
              data: data,
              backgroundColor: "rgba(204, 16, 52, 0.8)",
              borderColor: "#CC1034"
            }]
          }}
          options={options}
        />
      )}
    </div>
  )
}

export default LineGraph
