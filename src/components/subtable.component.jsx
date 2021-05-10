import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

class SubTable extends React.Component {

  render() {
    const {title, data, columns} = this.props;

    return (
    <div className = "subtable">
    <h2>{title}</h2>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {
              columns.map((column) => 
              <TableCell style={{"font-weight": 'bold'}}>{column}</TableCell>
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
            <TableRow key = {title}>
            {
              data.map((item) => 
              <TableCell>{item}</TableCell>
              )
            }
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
  }
}

export default SubTable;


