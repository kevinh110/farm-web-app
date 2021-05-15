import React from "react";
import MUIDataTable, { ExpandButton } from "mui-datatables";
import TableCell from "@material-ui/core/TableCell";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import LineChartList from "../../components/line-chart-list.component"
import SubTableList from '../../components/subtable-list.component'

import './mainpage.styles.css'

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'farm_data': [],
      'data_container': null,
      'preds_container': null
     };
  }

  async  componentDidMount(){
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

        const query = "SELECT DISTINCT c.Animal_ID from c";

        const { resources : cows } = await data_container.items
        .query(query)
        .fetchAll();

        // Get date and last updated
        const res = []
        
        for (const cow of cows){
          const {Animal_ID} = cow ;
          const query = `SELECT * FROM c WHERE c.Animal_ID = "${Animal_ID}" ORDER BY c.datesql DESC OFFSET 0 LIMIT 1`
          const { resources : pred_arr } = await preds_container.items
          .query(query)
          .fetchAll();
          if (pred_arr.length !== 0){
            const [pred] = pred_arr;
            const arr = [Animal_ID, pred.datesql, pred.prediction]
            res.push(arr);
          }
          else {
            const arr = [Animal_ID];
            res.push(arr);
          }
        }
        this.setState({
          "farm_data": res,
          "data_container": data_container,
          "preds_container": preds_container
        });

     }
     catch (error) {
      console.error(error);
     }
  }

  render() {

    const columns = [
      {
        name: "ID Number",
        options: {
          filter: false,
          searchable: true
        }
      },
      {
        name: "Last Updated",
        options: {
          filter: false,
          searchable: false
        }
      },
      {
        name: "Alert",
        options: {
          filter: true,
          searchable: false
        }
      }
    ];

    const data = this.state.farm_data;
    const {data_container, preds_container} = this.state

    const options = {
      search: true,
      download: false,
      print: false,
      viewColumns: false,
      filterType: 'dropdown',
      filter: true,
      responsive: 'standard',
      selectableRows: false,
      expandableRows: true,
      expandableRowsHeader: false,
      expandableRowsOnClick: true,
      renderExpandableRow: (rowData, rowMeta) => {
        const colSpan = rowData.length + 1;
        console.log("rowData: ", rowData);
        const id = rowData[0];
        return (
          <TableCell colSpan={colSpan}>
            <TableCell colSpan={colSpan}>
              <SubTableList id = {id} data_container = {data_container} preds_container = {preds_container} ></SubTableList>
            </TableCell>
            <TableCell colSpan={colSpan}>
              <h2> Trends </h2>
              <LineChartList id = {id} data_container = {data_container} ></LineChartList>
            </TableCell>
          </TableCell>

        );

      },
    };

    const theme = createMuiTheme({
      palette: { type: 'light' },
      typography: { useNextVariants: true },
    });

    const components = {
      ExpandButton: function (props) {
        return <ExpandButton {...props} />;
      }
    };

    return (
      <MuiThemeProvider theme={theme}>
        <MUIDataTable title={"Cow Dashboard"} data={data} columns={columns} options={options} components={components} />
      </MuiThemeProvider>
    );

  }
}

export default MainPage;




