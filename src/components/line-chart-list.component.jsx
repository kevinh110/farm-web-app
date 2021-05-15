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
      const {data_container, id} = this.props;

      const query = `SELECT * FROM c WHERE c.Animal_ID = "${id}" ORDER BY c.datesql`

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