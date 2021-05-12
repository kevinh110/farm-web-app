import React from 'react'
import LineChart from './line-chart.component'

class LineChartList extends React.Component{
  constructor(props) {
    super(props);
    this.state = { 
      "Conductivity": [],
      "Production": [],
      "Activity": [],
      "Protein": [],
      "Fat": [],
      "dates": []
    };
  }

  async componentDidMount(){
    try {

     const { CosmosClient } = require("@azure/cosmos");
     const endpoint = "https://dairy-project-cosmos.documents.azure.com:443";
     const key = "WNLJbEHT9NTWL9wGygnQMvzX2JUJo5Iv72OPoba9dTyKfbVrf1FjK6vY3XXaN8BPsQ5iC5UTkOQLVJ8UIBEk4A==";
     const client = new CosmosClient({endpoint, key, 
       connectionPolicy: {
         enableEndpointDiscovery: false
       }});


       const { database } = await client.database("dairy-project-database").read();
       const { container : data_container } = await database.container("milk-daily-data").read();

      const query = `SELECT * FROM c WHERE c.Animal_ID = "${this.props.id}" ORDER BY c.datesql`



       const { resources : cow_arr } = await data_container.items
       .query(query)
       .fetchAll();

       const conductivity = []
       const production = []
       const activity = []
       const dates = []
       const protein = []
       const fat = []
       

       for (const item of cow_arr) {
         conductivity.push(parseFloat(item.Conductivity));
         production.push(parseFloat(item["ProdRate(gr/hr)"]));
         activity.push(parseFloat(item["Activity(steps/hr)"]));
         protein.push(parseFloat(item["Protein(%)"]));
         fat.push(parseFloat(item["Fat(%)"]));
         dates.push(item.datesql.split("T")[0]);
       }
       

       this.setState(
        { 
          "Conductivity": conductivity,
          "Production": production,
          "Activity": activity,
          "Protein": protein,
          "Fat": fat,
          "dates": dates
        }
        );
       
    }
    catch (error) {
      console.error(error);
    }
 }
 render(){
   const {dates} = this.state;
   if (dates.length === 0){
     return (
       <div></div>
     )
   }
   else {
     console.log("protein")
    return (
      <div className = 'grid-container'>
       <LineChart title = "Milk Production (gr/hr)" ydata = {this.state["Production"]} xdata = {dates}></LineChart>
       <LineChart title = "Conductivity" ydata = {this.state["Conductivity"]} xdata = {dates}></LineChart>
       <LineChart title = "Activity (steps/hr)" ydata = {this.state["Activity"]} xdata = {dates}></LineChart>
       <LineChart title = "Protein vs. Fat (%)" ydata = {[this.state["Protein"], this.state["Fat"]]} xdata = {dates}></LineChart>
      </div>
    )
   }
   
 }



}
export default LineChartList