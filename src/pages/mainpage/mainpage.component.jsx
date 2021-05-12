import React from "react";
import MUIDataTable, { ExpandButton } from "mui-datatables";
import TableCell from "@material-ui/core/TableCell";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import LineChart from "../../components/line-chart.component"
import LineChartList from "../../components/line-chart-list.component"

import SubTableList from '../../components/subtable-list.component'

import './mainpage.styles.css'
import CHART_DATA from "../../data/chart-data";


class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      'farm_data': []
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
        console.log(database);
        const { container : data_container } = await database.container("milk-daily-data").read();
        const { container : preds_container } = await database.container("mastitis-predictions").read();

        const query = "SELECT DISTINCT c.Animal_ID from c";

        const { resources : cows } = await data_container.items
        .query(query)
        .fetchAll();
        console.log(cows);

        // Get date and last updated
        const res = []
        
        for (const cow of cows){
          const {Animal_ID} = cow ;
          const query = `SELECT * FROM c WHERE c.Animal_ID = "${Animal_ID}" ORDER BY c.datesql DESC OFFSET 0 LIMIT 1`
          console.log(query);
          const { resources : pred_arr } = await preds_container.items
          .query(query)
          .fetchAll();
          console.log(pred_arr);
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
        this.setState({"farm_data": res});

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

    // Data is currently hardcoded
    const data = this.state.farm_data;
    const chartdata = CHART_DATA

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
              <SubTableList id = {id} ></SubTableList>
            </TableCell>
            <TableCell colSpan={colSpan}>
              <h2> Trends </h2>
              <LineChartList id = {id}></LineChartList>
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




