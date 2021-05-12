import Chart from 'react-apexcharts'
import React from "react";

class LineChart extends React.Component {
  constructor(props) {
    super(props);


    let series = []
    if (Array.isArray(this.props.ydata[0])){
      series = [
        {
        name: 'Protein', // Bad code :(
        data: this.props.ydata[0]
        },
        {
        name: 'Fat',
        data: this.props.ydata[1]
        }
      ]
    }
    else {
      series = [
        {
          name: this.props.title,
          data: this.props.ydata
        }
      ]
    }

    this.state =  {
      options: {
        chart: {
          id: this.props.title,
          width: '10%'
        },
        xaxis: {
          categories: this.props.xdata
        },
        title: {
          text: this.props.title,
          align: 'left',
          margin: 10,
          offsetX: 0,
          offsetY: 0,
          floating: false,
          style: {
            fontSize:  '14px',
            fontWeight:  'bold',
            fontFamily:  undefined,
            color:  '#263238'
          },
      }
      },
      series: series
    }
  }

  
  render() {
    
    return (
      <Chart
      options={this.state.options}
      series={this.state.series}
      type="line"
      width="400"
    />    )
  }
}

export default LineChart;
