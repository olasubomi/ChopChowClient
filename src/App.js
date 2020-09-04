import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import Paper from '@material-ui/core/Paper';

class App extends Component {
  constructor(props) {
    super(props);
    this.state={
      data: []
    }
  };

  onTextFieldChange= (e) =>{
    if(e.target.value>20) return;
     
    this.setState({index: e.target.value});
    const data = [];
    data.push(1);
    data.push(1);
    for(var i=2; i<e.target.value; i++){
      data.push(data[i-2]+data[i-1]);      
    }

    const data2 = [];    
    for(var k = 0; k<data.length; k++){
      const data1 = [];
      for(var j=0; j<data[k]; j++){
        data1.push(1);      
      }
      data2.push(data1)
    }

    this.setState({data: data2});
  }

  render() {    
    console.log(this.state.data)
    return (
      <div  style={{ margin:"50px" }}>      
        <TextField id="readTime"  className="mb-2" type="number" onChange={this.onTextFieldChange} />
        {
          this.state.data &&
          this.state.data.map((colData, ind)=>(
            <Grid container spacing={1}  key={ind} >
            {
              colData.map((d, ind1)=>(
                <Grid item xs={false} key={ind1} >
                  <Paper style={{ background:"red"}}>{d}</Paper>
                </Grid>
              ))
            }  
          </Grid>
          ))
        }
      </div>
    );
  }
}
export default App;
