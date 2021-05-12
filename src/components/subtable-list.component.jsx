import React from 'react';
import SubTable from './subtable.component';


class SubTableList extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        'status_data': [],
        'preds_data': [],
        'data_data': [] // LOL Name...
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
         const { container : preds_container } = await database.container("mastitis-predictions").read();
 
        const query = `SELECT * FROM c WHERE c.Animal_ID = "${this.props.id}" ORDER BY c.datesql DESC OFFSET 0 LIMIT 1`

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
          'data_data': data_arr // LOL Name...
        });
         
      }
      catch {
        console.log("COSMOS ERROR");
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