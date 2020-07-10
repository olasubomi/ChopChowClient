import React, { Component } from "react";
import {Table,TableBody, TableCell,TableContainer,TableHead, TablePagination, TableRow,Checkbox, Typography,Toolbar, Dialog,DialogContent,DialogTitle,Button,IconButton,TextField, Chip  } from '@material-ui/core';
import clsx from "clsx";

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import SendIcon from '@material-ui/icons/Send';

import ChipInput from "material-ui-chip-input";
import Autocomplete from "@material-ui/lab/Autocomplete"; 
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import axios from 'axios';
import { Row, Col } from "react-bootstrap";

// height of the TextField
const columns = [
    { id: '_id', label: 'id', minWidth: 100 },
    { id: 'label', label: 'MealName', minWidth: 100 },
    { id: 'intro', label: 'Intro', minWidth: 100 },
    { id: 'servings', label: 'Servings',  minWidth: 30},
    { id: 'mealImage', label: 'ImageSrc',  minWidth: 100},
    { id: 'readTime', label: 'ReadTime',  minWidth: 30},
    { id: 'cookTime', label: 'cookTime',  minWidth: 30},
    { id: 'active', label: 'Active',  minWidth: 150}
  ];

const styles = theme => ({
  button: {   margin: theme.spacing.unit,  },  
  leftIcon: {  marginRight: theme.spacing.unit, },
  rightIcon: {   marginLeft: theme.spacing.unit, },
  iconSmall: {   fontSize: 20, },
  root: {   width: '95%',   margin:'auto',   marginTop:'20px', },
  container: {   maxHeight: 440, },
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
class ViewSuggestedMeals extends Component {
  products = [];
  productsImg_path = [];
  categories = [];
  measurements = ["mL","oz","L","cup(s)","Tbsp","tsp","pt","lb","g","kg","lb"];

  constructor(props) {
    super(props);

    this.state = {
      mealLabel: "",
      intro: "",
      servings: 0,
      currentIngredient: "Butter scotch",
      currentIngredientMeasurement: null,
      currentIngredientQuantity: 0,
      ingredientStrings: [],
      formatted_ingredient: [],
      instructionsChip: [],
      readTime: "0 mins read",
      cookTime: "10 mins cook time",
      categoryChips: ["snacks", "abc", "123"],
      productsPopulated: false,
      img_change_flag : false,

      selected_id:"",
      mealData_list:[],
      page:0,
      rowsPerPage:10,
      open:false,
      suggestMealRole: "",

      imgSrc: "",
      loading_imgSrc: "",
      productImgSetting_flag: null,
      productImgSrc: null,
      productImg_path:"",
      product_ind: 0,
      ingredientData:[],

      selected :[]
      
    };
    this.handleIngredientDropdownChange = this.handleIngredientDropdownChange.bind(
      this
    );
    this.handleProductName = this.handleProductName.bind(this);
    this.handleIngredientMeasurement = this.handleIngredientMeasurement.bind(
      this
    );
    this.handleIngredientQuantity = this.handleIngredientQuantity.bind(this);
    this.addIngredientToMeal = this.addIngredientToMeal.bind(this);
    
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateSuggestItem = (data, mealRole) => {  
    this.setState({selected_id: data._id});
    this.setState({open: true});
    this.setState({ suggestMealRole: mealRole });
    this.setState({ suggestMealRole: mealRole });
    this.setState({ mealLabel: data.label });
    this.setState({ intro: data.intro });
    this.setState({ servings: data.servings });
    this.setState({ loading_imgSrc:  data.mealImage});

    this.setState({ formatted_ingredient:data.newer_ingredient_format});
    const last_ingredient = data.newer_ingredient_format[data.newer_ingredient_format.length-1];
    this.setState({ currentIngredientMeasurement: last_ingredient.measurement });
    this.setState({ currentIngredientQuantity: last_ingredient.quantity });
    this.setState({ currentIngredient: last_ingredient.product });
    this.setState({ imgSrc: data.mealImage });
    this.setState({ instructionsChip:  data.instructions});
    this.setState({ readTime:  data.readTime});
    this.setState({ cookTime:  data.cookTime});
    this.setState({ product_slider:  data.product_slider});
    this.setState({ productImgSetting_flag: false});

    const last_slider = data.product_slider[data.product_slider.length-1];
    if(!last_slider.flag) {
      this.setState({productImg_path: "public/products/"+last_slider.image});
    }else{
      this.setState({productImg_path: last_slider.image});
    }

    let temp = [];
    let tmp_ingredientData = []
    for(let i=0; i<data.newer_ingredient_format.length; i++)
    {
      const last_ingredient = data.newer_ingredient_format[i];
      var properIngredientStringSyntax;
  
      if (last_ingredient.quantity === 0) {
        properIngredientStringSyntax = last_ingredient.product;
      } 
      else if (last_ingredient.measurement === null ) 
      { 
        properIngredientStringSyntax ="" + last_ingredient.quantity + " " +  last_ingredient.product;
      } 
      else {
        properIngredientStringSyntax ="" + last_ingredient.quantity + " " +  last_ingredient.measurement+" of " + last_ingredient.product;
      }
      temp.push(properIngredientStringSyntax);
      tmp_ingredientData.push(null)
    }
    this.setState({ ingredientStrings: temp });  
    this.setState({ ingredientData: tmp_ingredientData }); 
  
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleUpdateSubmit(){    
    const data = this.state; 
    var url = "./api/updateSuggestItem";

    const {mealLabel,intro,servings,ingredientStrings,formatted_ingredient,instructionsChip,imgSrc,readTime,cookTime,categoryChips, selected_id, ingredientData, product_slider } = data;
    
    let suggestMealForm = new FormData();
    suggestMealForm.append('id', selected_id);
    suggestMealForm.append('mealLabel', mealLabel);
    suggestMealForm.append('intro', intro);
    suggestMealForm.append('servings', servings);
    suggestMealForm.append('formatted_ingredient', JSON.stringify(formatted_ingredient));
    suggestMealForm.append('instructionsChip', JSON.stringify(instructionsChip));
    suggestMealForm.append('ingredientStrings', ingredientStrings);    
    suggestMealForm.append('readTime', readTime);
    suggestMealForm.append('cookTime', cookTime);
    suggestMealForm.append('categoryChips', JSON.stringify(categoryChips));
    suggestMealForm.append('product_slider', JSON.stringify(product_slider));
    
    const ingredient_list = [];
    if(this.state.img_change_flag){
      suggestMealForm.append('img_change_flag', "true");      
      suggestMealForm.append('imgSrc', imgSrc);
    }else{
      suggestMealForm.set('img_change_flag', "false");     
    }

    for(var i=0; i< ingredientData.length; i++)
    {
      if(ingredientData[i]==null){
        ingredient_list.push(null)
      }else{
        ingredient_list.push({path_flag:ingredientData[i].path_flag,  path: ingredientData[i].path})
        if(ingredientData[i].path_flag){
          suggestMealForm.append('imgSrc', ingredientData[i].imgSrc);
        } 
      }    
    }  
    suggestMealForm.append('ingredient_list', JSON.stringify(ingredient_list));

    const config = {
      method: 'POST',    data: suggestMealForm,    url: url
    };
    axios(config).then(response => {
      if (response.status >= 200 && response.status < 300) {
        console.log("Updated Meal submitted successfully");        
        return (window.location.href = "/ViewSuggestedMeals");
      } else { console.log("Somthing happened wrong"); }
    }).catch(error => {   console.log(error); })
  }


///////////////////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    var url = "./api/get-all-products";
    fetch(url, { method: "GET"})
      .then((res) => res.text())
      .then((body) => {
        var productsList = JSON.parse(body);
        if (productsList && productsList.data.length !== 0) {

          console.log("returns GET ALL PRODUCTS ");
          for (var i = 0; i < productsList.data.length; i++) {
            this.products.push(productsList.data[i].product_name);
            this.productsImg_path.push(productsList.data[i].product_image);
          }

          console.log("PRINTING ALL PRODUCTS LIST");
          this.setState({ productsPopulated: true });
        } else { console.log("get all products function does not return");}
      })
      .catch((err) => {   console.log(err); });

    console.log("Comes in meal pages component did mount");

    var url1 = "./api/get-suggested-meals"
    fetch(url1).then(res => res.text()).then(body => {
        var productsList = JSON.parse(body);

        if(productsList && productsList.data.length !== 0){
          console.log("shows products does return");
          this.setState({mealData_list:productsList.data});
        }
        else{  console.log("shows products do not return"); }
      }).catch(err => {console.log(err);});
  }
////////////////////////////////////////////////////////////////////////////
  onTextFieldChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

////////////////////////////////////////////////////////////////////////////
  onTextFieldClick = (event) => {     
    this.setState({ imgSrc: event.target.files[0] });

    if (this.state.imgSrc !== null) {
        this.setState({ loading_imgSrc:  URL.createObjectURL(event.target.files[0]) });
        this.setState({ img_change_flag: true });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onhandleProductImg = (event) => {   
    this.setState({ productImgSrc: event.target.files[0] });
    if (event.target.files[0] !== null) {
        this.setState({ productImg_path:  URL.createObjectURL(event.target.files[0]) });
    }
  };

////////////////////////////////////////////////////////////////////////////
  handleAddIngredientChip(chip) {
    let temp = this.state.ingredientStrings;
    temp.push(chip);
    this.setState({ ingredientStrings: temp });
  }

////////////////////////////////////////////////////////////////////////////
  handleAddCategoryChip(chip) {
    this.setState({ categoryChips: [...this.state.categoryChips, chip] }); //
  }

////////////////////////////////////////////////////////////////////////////
  handleAddInstructionStep(chip) {
    this.setState({
      instructionsChip: [...this.state.instructionsChip, chip],
    });
  }

////////////////////////////////////////////////////////////////////////////
  handleDeleteIngredientChip(chip) {
    console.log("removing chop input");
    var array = [...this.state.ingredientStrings]; // make a separate copy of the array
    var array1 = [...this.state.formatted_ingredient]; // make a separate copy of the array
    var array2 = [...this.state.ingredientData];
    var array3 = [...this.state.product_slider];
    
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      array1.splice(index, 1);
      array2.splice(index, 1);
      array3.splice(index, 1);

      this.setState({ ingredientStrings: array, formatted_ingredient: array1, ingredientData:array2, product_slider:array3 });
    }
  }

////////////////////////////////////////////////////////////////////////////
  handleDeleteCategoryChip(chip) {
    console.log("removing chop input");
    var array = [...this.state.categoryChips]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ categoryChips: array });
    }
  }

////////////////////////////////////////////////////////////////////////////
  handleDeleteInstructionsStep(chip) {
    console.log("removing chop input");
    var array = [...this.state.instructionsChip]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ instructionsChip: array });
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  handleIngredientQuantity(event) {
    console.log(event.target.value);
    this.setState({ currentIngredientQuantity: event.target.value });
  }

  ////////////////////////////////////////////////////////////////////////////
  handleIngredientDropdownChange = (event, value) => {
    var array = this.products; 
    var index = array.indexOf(value);
    if (index !== -1) {      
      this.setState({ product_ind: index });  
    }

    if (event.target.value) {
      this.setState({ currentIngredient: event.target.value });
    } else {
      this.setState({ currentIngredient: event.target.innerHTML });
    }
  }

    ///////////////////////////////////////////////////////////////////////////////////////
    handleProductName = (event, val) => {
      const searchResult = this.products.map(element=>element.toLowerCase().includes(val.toLowerCase()));
      const flag = searchResult.find(element=>element === true);
      if(flag !== true || flag ===null) {
        this.setState({productImgSetting_flag:true});
        this.setState({ currentIngredient: val });
      }else{
        this.setState({productImgSetting_flag:false});
        this.setState({ currentIngredient: val });
      }
    }

  ////////////////////////////////////////////////////////////////////////////
  handleIngredientMeasurement(event) {
    if (event.target.value) {
      this.setState({ currentIngredientMeasurement: event.target.value });
    } else {
      this.setState({ currentIngredientMeasurement: event.target.innerHTML });
    }
  }

////////////////////////////////////////////////////////////////////////////
  onhandleSendData=()=>{
    fetch("./api/send-mealData", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(this.state.selected),
    }).then(response => {
        console.log(response)
        if(response.status === 200 ){
          return (window.location.href = "/ViewSuggestedMeals");
        }
      });
  }

////////////////////////////////////////////////////////////////////////////
  addIngredientToMeal(event) {
    event.preventDefault();
    console.log(this.state.currentIngredientMeasurement);
    var properIngredientStringSyntax;

    if (document.getElementById("currentIngredient").value === "") {
      window.alert("Enter an ingredient to add to meal");
      return;
    }

    if (this.state.currentIngredientQuantity === 0) {
      properIngredientStringSyntax = document.getElementById("currentIngredient").value;
    } else if (
      document.getElementById("currentIngredientMeasurement").value === null
    ) {
      properIngredientStringSyntax ="" + this.state.currentIngredientQuantity +" " + document.getElementById("currentIngredient").value;
    } else {
      properIngredientStringSyntax ="" +this.state.currentIngredientQuantity +" " + document.getElementById("currentIngredientMeasurement").value +" of " + document.getElementById("currentIngredient").value;
    }
    var currIngredientObject = {
      product: this.state.currentIngredient,
      quantity: this.state.currentIngredientQuantity,
      measurement: this.state.currentIngredientMeasurement,
    };

    console.log(properIngredientStringSyntax);
    this.handleAddIngredientChip(properIngredientStringSyntax);

    if(this.state.productImgSetting_flag ){
      const tmp_data = {imgSrc:this.state.productImgSrc, path_flag: true, path:""}
      this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });  
    }else{
      const tmp_data = {imgSrc:[], path_flag: false, path:this.productsImg_path[this.state.product_ind]}
      this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });
    }

    this.setState({ formatted_ingredient: [ ...this.state.formatted_ingredient, currIngredientObject, ], 
      productImg_path:null,
      product_slider: [...this.state.product_slider, null],
    });
  }

  ////////////////////////////////////////////////////////////////////////////
  handleChangePage = (event, newPage) => {
    this.setState({page: newPage});
  };

  ////////////////////////////////////////////////////////////////////////////
  handleChangeRowsPerPage = (event) => {
    this.setState({page: 0});
    this.setState({rowsPerPage: +event.target.value});
  };

  ////////////////////////////////////////////////////////////////////////////
  handleDeleteMealItem = (data) => {
    var url = `./api/removeSeggestItem/${data._id}`;
    fetch(url).then((res) => {
      return res.json();
    })
      .then((response) => {           
        console.log("Delets item");
        return (window.location.href = "/ViewSuggestedMeals");
      })
      .catch((err) => {
        console.log("unDelets item");
        console.log(err);
      });
  }

  ////////////////////////////////////////////////////////////////////////////
  handleClickOpen = (data, mealRole) => {
    this.setState({open: true});
    this.setState({ suggestMealRole: mealRole });
    this.setState({ mealLabel: data.label });
    this.setState({ intro: data.intro });
    this.setState({ servings: data.servings });
    this.setState({ formatted_ingredient:data.newer_ingredient_format});
    
    const last_ingredient = data.newer_ingredient_format[data.newer_ingredient_format.length-1];
   
    this.setState({ currentIngredientMeasurement: last_ingredient.measurement });
    this.setState({ currentIngredientQuantity: last_ingredient.quantity });
    this.setState({ currentIngredient: last_ingredient.product });
    this.setState({ instructionsChip:  data.instructions});
    this.setState({ readTime:  data.readTime});
    this.setState({ cookTime:  data.cookTime});
    this.setState({ loading_imgSrc:  data.mealImage});
    this.setState({ product_slider:  data.product_slider});


    const last_slider = data.product_slider[data.product_slider.length-1];
    if(!last_slider.flag) {
      this.setState({productImg_path: "public/products/"+last_slider.image});
    }else{
      this.setState({productImg_path: last_slider.image});
    }

    this.setState({productImgSetting_flag: false});

    let temp = [];
    for(let i=0; i<data.newer_ingredient_format.length; i++)
    {
      const last_ingredient = data.newer_ingredient_format[i];
      var properIngredientStringSyntax;
  
      if (last_ingredient.quantity === 0) {
        properIngredientStringSyntax = last_ingredient.product;
      } 
      else if (last_ingredient.measurement === null ) 
      { 
        properIngredientStringSyntax ="" + last_ingredient.quantity + " " +  last_ingredient.product;
      } 
      else {
        properIngredientStringSyntax ="" + last_ingredient.quantity + " " +  last_ingredient.measurement+" of " + last_ingredient.product;
      }
      temp.push(properIngredientStringSyntax);
    }
    this.setState({ ingredientStrings: temp });     
 };

 ////////////////////////////////////////////////////////////////////////////
  handleClose = () => { this.setState({open: false});};

  ////////////////////////////////////////////////////////////////////////////
  onTextFieldChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

////////////////////////////////////////////////////////////////////////////
handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const newSelecteds = this.state.mealData_list.map((n) => n._id);
    this.setState({selected:  newSelecteds});
    return;
  }
  this.setState({selected: [] });
};

////////////////////////////////////////////////////////////////////////////
handleClick = (event, id) => {
  const selected = this.state.selected; 
  const selectedIndex = selected.indexOf(id);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, id);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }
  this.setState({selected: newSelected});
};

////////////////////////////////////////////////////////////////////////////
  render() {
    var instructionSteps = (
      <ol className="mdc-list">
        {this.state.instructionsChip.map((chip,index) => (
          <li className="mdc-list-item" tabIndex="0" key={index}>
            <span className="mdc-list-item__text">{chip}</span>
          </li>
        ))}
      </ol>
    );

    const { classes } = this.props;
    const {mealData_list, page, rowsPerPage, open, suggestMealRole, loading_imgSrc, productImg_path} = this.state;
    const {mealLabel, intro, servings, currentIngredient, currentIngredientQuantity, currentIngredientMeasurement, readTime, cookTime} = this.state;

    const theme = createMuiTheme({
      palette: { primary: green,  },
    });
  
    const numSelected = this.state.selected.length;
    const rowCount = mealData_list? mealData_list.length:0;
    
    return (
      <div className={classes.root} style={{boxShadow:"2px 2px 8px 0px #a0a0a0"}}>
        <Toolbar className={clsx(classes.root, {  [classes.highlight]: numSelected > 0  })} >
          {numSelected > 0 ? 
          ( <Typography  className={classes.title} color="inherit"  variant="subtitle1"component="div" style={{fontSize:"16px", fontWeight:"600", marginRight:"20px", color:"blue"}}> {numSelected} selected</Typography>) 
          : (<Typography  className={classes.title} variant="h6" id="tableTitle"  component="div">None Selected  </Typography>)}

          {numSelected > 0 ? (<Button variant="outlined" color="primary" endIcon={<SendIcon/>} onClick={this.onhandleSendData}>Send</Button>) :null}
        </Toolbar>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={this.handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts' }}
                  />
                </TableCell>

                {columns.map((column) => (
                  <TableCell 
                    key={column.id} 
                    align={column.align}  
                    style={{ minWidth: column.minWidth, fontSize:'15x', fontWeight:'600',padding: '10px 5px' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { mealData_list&&
              mealData_list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const isSelected = (id) => this.state.selected.indexOf(id) !== -1;
                const isItemSelected = isSelected(row._id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (               
                  <TableRow 
                    hover
                    onClick={(event) => this.handleClick(event, row._id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row._id}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </TableCell>
                    
                    {columns.map((column) => {
                      if(column.id === "active"){                     
                        return (
                        <TableCell  key={column.id} style={{ padding: '0px 0px'}}>
                          <IconButton color="primary" aria-label="upload picture" component="span" onClick ={()=>this.handleClickOpen(row, "moreView")}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton color="primary" aria-label="upload picture" component="span" onClick ={()=>this.updateSuggestItem(row,"edit")}>
                            <EditIcon style={{ color: 'green'}}/>
                          </IconButton>
                          <IconButton color="secondary" aria-label="upload picture" component="span"  onClick ={()=>this.handleDeleteMealItem(row)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                        );
                      }else{ const value = row[column.id]; return (<TableCell key={column.id} style={{ padding: '5px 5px'}}>{value}</TableCell> );}                    
                    })                  
                    }    
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rowCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

      <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth = "lg"
        fullWidth
        >
        <DialogTitle id="alert-dialog-title">{suggestMealRole === "moreView" ? "Suggest Meal": "Update Meal"}</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off">
              <Row className="mb-3">
                  <Col md={4}><TextField id="mealLabel" fullWidth onChange={this.onTextFieldChange} label="Meal Name" required variant="filled"className="mb-2" value={mealLabel}/></Col>
                  <Col md={4}><TextField multiline id="intro" fullWidth onChange={this.onTextFieldChange} label="Intro"  variant="filled" className="mb-2" value={intro} /></Col>
                  <Col md={4}><TextField id="servings" fullWidth type="number" onChange={this.onTextFieldChange} label="Servings"  variant="filled"  className="mb-2" placeholder="1 person, 2, 4 or 10 people" value={servings}/></Col>
              </Row>
              <Row className="mb-3">
                  <Col md={8}>
                    <ChipInput
                      label="IngredientsList"
                      value={this.state.ingredientStrings}
                      onAdd={(chip) => this.handleAddIngredientChip(chip)}
                      placeholder="e.g 1 Onion, 2 Cups of Water, etc"
                      onDelete={(chip, index) =>this.handleDeleteIngredientChip(chip, index)}
                      variant="filled"
                      fullWidth 
                      className="mb-2"
                    />
                  </Col>
                  <Col md={4}>
                    <Autocomplete
                      id="currentIngredient"
                      options={this.products.map((option) => option)}
                      onChange={(ev, val) => this.handleIngredientDropdownChange(ev, val)}
                      onInputChange={(ev, val) => this.handleProductName(ev, val)}
                      freeSolo
                      renderInput={(params) => ( <TextField {...params} label="Ingredient.." variant="filled"/>)}
                      fullWidth 
                      className="mb-2"
                      value = {currentIngredient}
                    />
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col md={4}>
                      <Autocomplete id="currentIngredientMeasurement" options={this.measurements.map((option) => option)} value={currentIngredientMeasurement} onChange={this.handleIngredientMeasurement}
                      freeSolo
                      renderInput={(params) => (
                        <TextField {...params} label="Measurement.." variant="filled"/>
                      )}
                      className="mb-2"
                    />
                  </Col>
                  <Col md={4}>
                    <TextField fullWidth id="currentIngredientQuantity" type="number"  onChange={this.onTextFieldChange}  label="Quantity" variant="filled" placeholder="1.."  className="mb-2" value={currentIngredientQuantity}/>
                  </Col>
                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                    <Button variant="contained" color="primary" size="small" disableRipple onClick={this.addIngredientToMeal} style={{color:"white"}}  className="mb-2" disabled={suggestMealRole==="moreView"? true:false}> Add Ingredient</Button>
                  </Col>
               </Row>
               
               <Row className="mb-3" style={{  textAlign:"center"}}>
                  <Col md={6} style={{  marginTop:"20px"}}>
                    <div style={{ textAlign:"left" , fontWeight:"600", marginBottom:"10px"}}>Meal Image</div>
                    <input accept="image/*" id="imgSrc" type="file" className="mb-2" onChange={(ev)=>this.onTextFieldClick(ev)} />
                    <img src={loading_imgSrc} width="300px" height="200px" alt=""/>
                  </Col> 
                  {
                    this.state.productImgSetting_flag &&
                    <Col md={6} style={{  marginTop:"20px"}}>
                      <div style={{ textAlign:"left", fontWeight:"600", marginBottom:"10px"}}>Product Image</div>
                      <input accept="image/*" id="imgSrc1" type="file" className="mb-2" onChange={(ev)=>this.onhandleProductImg(ev)} />
                      <img src={productImg_path} width="300px" height="200px" alt=""/>
                    </Col>
                  }               
                </Row>
             
               <Row className="mb-3">
                  <Col md={12}>
                    <ChipInput label="Instructions"  className="mb-2" fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="filled" />
                  </Col>               
               </Row>
              <Row className="mb-3">
                  <Col md={12}  className="mb-2">{instructionSteps}</Col>                 
               </Row>
               <Row className="mb-3">
                  <Col md={4}>
                    <TextField id="readTime"  className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="ReadTime (mins)" variant="filled" required value={readTime} />
                  </Col>   
                  <Col md={4}>
                    <TextField id="cookTime" className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="CookTime (mins)" variant="filled" required value={cookTime}/>
                  </Col>   
                  <Col md={4}>
                    <Autocomplete multiple id="tags-filled" className="mb-2" fullWidth options={this.categories.map((option) => option)} defaultValue={[this.categories[0]]}
                      freeSolo
                      renderTags={(value, getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} {...getTagProps({ index })}/>))}
                      renderInput={(params) => (<TextField {...params} variant="filled" label="Categories" placeholder="Suggest categories for this meal.."/>)} />
                  </Col>                        
               </Row>
              {
                  suggestMealRole !== "moreView" &&
                  <Row className="mb-5">
                    <Col md={4} style={{textAlign:"center", margin: "auto"}}>
                      <ThemeProvider theme={theme}>
                        <Button variant="contained" className="mb-2" color="primary" size="small"  style={{color:"white"}} onClick={()=>this.handleUpdateSubmit()}> Update Meal</Button>
                      </ThemeProvider>
                    </Col>       
                  </Row>
              }
              
              </form>
        </DialogContent>
      </Dialog>
    </div>
    );
  }
}
export default withStyles(styles)(ViewSuggestedMeals);
