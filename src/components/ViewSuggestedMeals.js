import React, { Component } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete"; // createFilterOptions,
import axios from 'axios';
import { Row, Col } from "react-bootstrap";
import { createMuiTheme, withStyles, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

// height of the TextField
const columns = [
    { id: 'label', label: 'MealName', minWidth: 100 },
    { id: 'intro', label: 'Intro', minWidth: 100 },
    { id: 'servings', label: 'Servings',  minWidth: 30},
    { id: 'imageSrc', label: 'ImageSrc',  minWidth: 100},
    { id: 'readTime', label: 'ReadTime',  minWidth: 30},
    { id: 'cookTime', label: 'cookTime',  minWidth: 30},
    { id: 'active', label: 'Active',  minWidth: 150}
  ];

const styles = {
  root: {
    width: '95%',
    margin:'auto',
    marginTop:'20px',
  },
  container: {
    maxHeight: 440,
  },
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////
class ViewSuggestedMeals extends Component {
  products = [];
  categories = [];
  measurements = [
    "mL","oz","L","cup(s)","Tbsp","tsp","pt","lb","g","kg","lb",
  ];
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
      imgSrc: "",
      loading_imgSrc: null,
      readTime: "0 mins read",
      cookTime: "10 mins cook time",
      categoryChips: ["snacks", "abc", "123"],
      productsPopulated: false,
      img_change_flag : false,

      selected_id:"",
      mealData_list:[],
      // mealData_list:null,
      page:0,
      rowsPerPage:10,
      open:false,
      suggestMealRole: ""
    };
    this.handleIngredientDropdownChange = this.handleIngredientDropdownChange.bind(
      this
    );
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
    this.setState({ loading_imgSrc:  `http://localhost:5000/${data.imageSrc}`});

    this.setState({ formatted_ingredient:data.newer_ingredient_format});
    const last_ingredient = data.newer_ingredient_format[data.newer_ingredient_format.length-1];
    this.setState({ currentIngredientMeasurement: last_ingredient.measurement });
    this.setState({ currentIngredientQuantity: last_ingredient.quantity });
    this.setState({ currentIngredient: last_ingredient.product });
    this.setState({ imgSrc: data.imageSrc });
    this.setState({ instructionsChip:  data.instructions});
    this.setState({ readTime:  data.readTime});
    this.setState({ cookTime:  data.cookTime});

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
  }

///////////////////////////////////////////////////////////////////////////////////////////////////////////
  handleUpdateSubmit(){    
    const data = this.state; 
    var url = "./api/updateSuggestItem";
    const {mealLabel,intro,servings,ingredientStrings,formatted_ingredient,instructionsChip,imgSrc,readTime,cookTime,categoryChips, selected_id } = data;
    let sugestMealForm = new FormData();
    sugestMealForm.set('id', selected_id);
    sugestMealForm.set('mealLabel', mealLabel);
    sugestMealForm.set('intro', intro);
    sugestMealForm.set('servings', servings);
    sugestMealForm.set('formatted_ingredient', JSON.stringify(formatted_ingredient));
    sugestMealForm.set('instructionsChip', JSON.stringify(instructionsChip));
    sugestMealForm.set('ingredientStrings', ingredientStrings);    
    sugestMealForm.set('readTime', readTime);
    sugestMealForm.set('cookTime', cookTime);
    sugestMealForm.set('categoryChips', JSON.stringify(categoryChips));

    if(this.state.img_change_flag){
      sugestMealForm.set('imgSrc', imgSrc, imgSrc.name);
      sugestMealForm.set('img_change_flag', "true");      
    }else{
      sugestMealForm.set('img_change_flag', "false");     
    }

    const config = {
      method: 'POST',
      data: sugestMealForm,
      url: url
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
          console.log(productsList.data.length);
          for (var i = 0; i < productsList.data.length; i++) {
            this.products.push(productsList.data[i].product_name);
          }
          console.log("PRINTING ALL PRODUCTS LIST");
          console.log(this.products);
          this.setState({ productsPopulated: true });
        } else {
          console.log("get all products function does not return");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("Comes in meal pages component did mount");
    url = "./api/get-suggested-meals"
    fetch(url).then(res => res.text()).then(body => {
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
    var formatted_ingredient_array = [...this.state.formatted_ingredient]; // make a separate copy of the array


    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      formatted_ingredient_array.splice(index, 1);
      this.setState({ ingredientStrings: array });
      this.setState({ formatted_ingredient: formatted_ingredient_array });
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
  handleIngredientDropdownChange(event) {
    console.log(event.target);
    if (event.target.value) {
      this.setState({ currentIngredient: event.target.value });
    } else {
      this.setState({ currentIngredient: event.target.innerHTML });
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
    this.setState({ formatted_ingredient: [ ...this.state.formatted_ingredient, currIngredientObject, ], });
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
      console.log("res,",res);
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
    this.setState({ loading_imgSrc:  `http://localhost:5000/${data.imageSrc}`});

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

  handleClose = () => { this.setState({open: false});};

  onTextFieldChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
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
    const {mealData_list, page, rowsPerPage, open, suggestMealRole, loading_imgSrc} = this.state;
    const {mealLabel, intro, servings, currentIngredient, currentIngredientQuantity, currentIngredientMeasurement,readTime, cookTime} = this.state;

    const theme = createMuiTheme({
      palette: {
        primary: green,
      },
    });
  
    return (
      <div className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}  style={{ minWidth: column.minWidth, fontSize:'15x', fontWeight:'600',padding: '10px 5px' }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              { mealData_list&&
              mealData_list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                return (               
                  <TableRow  key={row._id}>
                    {columns.map((column) => {
                      if(column.id==="active"){                     
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
          count={mealData_list? mealData_list.length:0}
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
                      onChange={this.handleIngredientDropdownChange}
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
                    <Button variant="contained" color="primary" size="small" disableRipple className={classes.margin}  onClick={this.addIngredientToMeal} style={{color:"white"}}  className="mb-2" disabled={suggestMealRole==="moreView"? true:false}> Add Ingredient</Button>
                  </Col>
               </Row>
               <Row className="mb-3">
                  <Col md={3}>
                    <input accept="image/*" id="imgSrc" type="file" className="mb-2" onChange={(ev)=>this.onTextFieldClick(ev)} />
                  </Col> 
                  <Col md={9}>
                        {/* <div>Image Path: {imgSrc}</div> */}
                        <img src={loading_imgSrc} width="300px" height="200px" alt = "alt_loading_img"/>
                  </Col>                  
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
                        <Button variant="contained" className="mb-2" color="primary" size="small"  className={classes.margin} style={{color:"white"}} onClick={()=>this.handleUpdateSubmit()}> Update Meal</Button>
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