import Chart from 'react-apexcharts'
import React from "react";

class LineChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      series: [{
        name: 'series-1',
        data: this.props.ydata
      }]
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
