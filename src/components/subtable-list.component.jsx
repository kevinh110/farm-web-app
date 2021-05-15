import React from 'react';
import SubTable from './subtable.component';


class SubTableList extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        'status_data': [],
        'preds_data': [],
        'data_data': [], // LOL Name...
      };
    }

    async componentDidMount(){
      try {
 
 
        const {data_container, preds_container, id} = this.props
        const query = `SELECT * FROM c WHERE c.Animal_ID = "${id}" ORDER BY c.datesql DESC OFFSET 0 LIMIT 1`

         const { resources : cow_arr } = await data_container.items
         .query(query)
         .fetchAll();
         console.log("SubtableList");
         console.log(cow_arr);
         const [latest] = cow_arr;
         const status_arr = [latest.AnimalStatus, latest.Gynecology_Status];
         const data_arr = [latest["Yield(gr)"], latest.DIM, latest.Lactation_Num]
         
         const { resources : preds_arr } = await preds_container.items
         .query(query)
         .fetchAll();
         const [preds] = preds_arr;
         const predictions_arr = [preds.prediction, "D"];

         this.setState({ 
          'status_data': status_arr,
          'preds_data': predictions_arr,
          'data_data': data_arr, // LOL Name...
        });

         
      }
      catch (error) {
        console.error(error);
      }
   }
   render (){
     return (
       <div>
       <SubTable title = "Prediction" data = {this.state.preds_data} columns = {["Mastitis", "Pathogen"]}></SubTable>
       <SubTable title = "Status" data = {this.state.status_data} columns = {["Animal", "Gynecology"]}></SubTable>
       <SubTable title = "Data" data = {this.state.data_data} columns = {["Yield(gr)", "DIM", "Lactation"]}></SubTable>

       </div>
       )
   }
   
}

export default SubTableList