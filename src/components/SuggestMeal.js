import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import ChipInput from "material-ui-chip-input";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete"; // createFilterOptions,
import axios from 'axios';
import { Row, Col } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import {Dialog, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core';

class SuggestMeal extends Component {
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

      imgSrc: null,
      loading_imgSrc:"",
      open:false,
      productImgSetting_flag: false,
      productImgSrc:null,
      productImg_path:"",
      product_ind: 0,
      ingredientData:[]
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

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    var url = "./api/get-all-products";

    fetch(url, {
      method: "GET",
    })
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
          console.log(this.products);
          this.setState({ productsPopulated: true });          
        } else {
          console.log("get all products function does not return");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    //----get category meals-------------------------
    url = "./api/get-all-categories";
    fetch(url, {
      method: "GET",
    })
      .then((res) => res.text())
      .then((body) => {
        console.log(body);
        var categoryList = JSON.parse(body);
        if (categoryList && categoryList.data.length !== 0) {
          console.log("returns GET of ALL Categories ");

          for (var i = 0; i < categoryList.data.length; i++) {
            this.categories.push(categoryList.data[i]);
          }
          console.log("PRINTING UPDATED CATEGORIES LIST");
        } else {
          console.log("get all products function does not return");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleClose = () => { this.setState({open: false});};

  ///////////////////////////////////////////////////////////////////////////////////////
  onTextFieldChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////
  handleAddIngredientChip(chip) {
    this.setState({
      ingredientStrings: [...this.state.ingredientStrings, chip],
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddCategoryChip(chip) {
    this.setState({ categoryChips: [...this.state.categoryChips, chip] }); //
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddInstructionStep(chip) {
    this.setState({
      instructionsChip: [...this.state.instructionsChip, chip],
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteIngredientChip(chip) {
    console.log("removing chop input");
    var array = this.state.ingredientStrings; // make a separate copy of the array
    var array1 = this.state.formatted_ingredient; // make a separate copy of the array
    var array2 = this.state.ingredientData; // make a separate copy of the array

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      array1.splice(index, 1);
      array2.splice(index, 1);
      this.setState({ ingredientStrings: array,  formatted_ingredient:array1,  ingredientData:array2});
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteCategoryChip(chip) {
    console.log("removing chop input");
    var array = [...this.state.categoryChips]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ categoryChips: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteInstructionsStep(chip) {
    console.log("removing chop input");
    var array = [...this.state.instructionsChip]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ instructionsChip: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleIngredientQuantity(event) {
    console.log(event.target.value);
    this.setState({ currentIngredientQuantity: event.target.value });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleIngredientDropdownChange=(event,val)=>{
    var array = this.products; 
    var index = array.indexOf(val);
    if (index !== -1) {      
      this.setState({ product_ind: index });
    }

    if (event.target.value!== null) {
      this.setState({ currentIngredient: val });
    } else {
      this.setState({ currentIngredient: event.target.innerHTML });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleProductName=(event)=>{
    if(event.target.value === 0) return;
    const searchResult = this.products.map(element=>element.toLowerCase().includes(event.target.value.toLowerCase()));
    const flag = searchResult.find(element=>element === true);
    
    if(flag !== true || flag ===null) {
      this.setState({productImgSetting_flag:true});
      this.setState({ currentIngredient: event.target.value });
    }else{
      this.setState({productImgSetting_flag:false});
      this.setState({ currentIngredient: event.target.value });
    }
  }

///////////////////////////////////////////////////////////////////////////////////////
  handleIngredientMeasurement(event) {
    if (event.target.value) {
      this.setState({ currentIngredientMeasurement: event.target.value });
    } else {
      this.setState({ currentIngredientMeasurement: event.target.innerHTML });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  addIngredientToMeal(event) {
    event.preventDefault();
    var properIngredientStringSyntax;
    if (document.getElementById("currentIngredient").value === "") {   window.alert("Enter an ingredient to add to meal");   return;  }
    if (this.state.currentIngredientQuantity === 0) {
      properIngredientStringSyntax = document.getElementById("currentIngredient").value;
    } else if (  document.getElementById("currentIngredientMeasurement").value === null  ) {
      properIngredientStringSyntax = "" + this.state.currentIngredientQuantity +  " " +  document.getElementById("currentIngredient").value;
    } else {
      properIngredientStringSyntax =
        "" + this.state.currentIngredientQuantity + " " +  document.getElementById("currentIngredientMeasurement").value +
        " of " + document.getElementById("currentIngredient").value;
    }

    var currIngredientObject = { product: this.state.currentIngredient,  quantity: this.state.currentIngredientQuantity,  measurement: this.state.currentIngredientMeasurement, };

    this.handleAddIngredientChip(properIngredientStringSyntax);

    if(this.state.productImgSetting_flag ){
      const tmp_data = {imgSrc:this.state.productImgSrc, path_flag: true, path:""}
      this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });  
    }else{
      const tmp_data = {imgSrc:[], path_flag: false, path:this.productsImg_path[this.state.product_ind]}
      this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });
    }
    
    this.setState({
      formatted_ingredient: [ ...this.state.formatted_ingredient,  currIngredientObject ],
      productImg_path:null,
      // productImgSrc:null,
      // productImg_flag:true,
    });
  }


///////////////////////////////////////////////////////////////////////////////////////
  sendSuggestedMealToDB = (e) => {
    const {
      mealLabel,intro,servings,ingredientStrings,formatted_ingredient,instructionsChip,imgSrc,readTime,cookTime,categoryChips, ingredientData} = this.state;

    if (mealLabel === "") {  console.log("meal label blank"); return; }
    if (ingredientStrings.length === 0) {   window.alert( "Suggested meal requires adding at least one ingredient to submit" );   return;  }
    if (imgSrc === null) {   window.alert( "You didn't add suggested meal image" );   return;  }

    var url = "./api/addMealSuggestion/";

    let suggestMealForm = new FormData();
    suggestMealForm.append('mealLabel', mealLabel);
    suggestMealForm.append('intro', intro);
    suggestMealForm.append('servings', servings);
    suggestMealForm.append('formatted_ingredient', JSON.stringify(formatted_ingredient));
    suggestMealForm.append('instructionsChip', JSON.stringify(instructionsChip));
    suggestMealForm.append('ingredientStrings', ingredientStrings);
    suggestMealForm.append('readTime', readTime);
    suggestMealForm.append('cookTime', cookTime);
    suggestMealForm.append('categoryChips', JSON.stringify(categoryChips));    
    suggestMealForm.append('imgSrc', imgSrc);

    const ingredient_list = [];
    for(var i=0; i< ingredientData.length; i++)
    {
      ingredient_list.push({path_flag:ingredientData[i].path_flag,  path: ingredientData[i].path})
      if(ingredientData[i].path_flag){
        suggestMealForm.append('imgSrc', ingredientData[i].imgSrc);
      }      
    }  

    suggestMealForm.append('ingredient_list', JSON.stringify(ingredient_list));    
    this.setState({open:true});

    const config = {  method: 'POST',  data: suggestMealForm, url: url };
    axios(config).then(response => {
      if (response.status >= 200 && response.status < 300) {
        console.log(response);
        console.log("Display Meal submitted successfully");        
      } else {
        console.log("Somthing happened wrong");
      }
    }).catch(error => {
      console.log(error);
    })
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {
    var instructionSteps = (
      <ol className="mdc-list">
        {this.state.instructionsChip.map((chip, index) => (
          <li className="mdc-list-item" tabIndex="0" key={index}>
            <span className="mdc-list-item__text">{chip}</span>
          </li>
        ))}
      </ol>
    );

    const theme = createMuiTheme({
      palette: {
        primary: green,
      },
    });
  
    const {loading_imgSrc, productImg_path} = this.state;
    
    return (
      <div>
        <div style={{ width:"90%" , margin:"auto"}}>
          <div id="title" style={{  marginTop:"20px", marginBottom:"20px"}}>
            <b>Suggestions</b>
          </div>
        <form noValidate autoComplete="off">
          <Row className="mb-3">
              <Col md={4}><TextField id="mealLabel" fullWidth onChange={this.onTextFieldChange} label="Meal Name" required variant="filled" className="mb-2" /></Col>
              <Col md={4}><TextField multiline id="intro" fullWidth onChange={this.onTextFieldChange} label="Intro"  variant="filled" className="mb-2" /></Col>
              <Col md={4}><TextField id="servings" fullWidth type="number" onChange={this.onTextFieldChange} label="Servings"  variant="filled"  className="mb-2" placeholder="1 person, 2, 4 or 10 people" /></Col>
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
                  onChange={(ev,val)=>this.handleIngredientDropdownChange(ev,val)}
                  onInputChange={(ev)=>this.handleProductName(ev)}
                  freeSolo
                  renderInput={(params) => ( <TextField {...params} label="Ingredient.." variant="filled"/>)}
                  fullWidth 
                  className="mb-2"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={4}>
                  <Autocomplete id="currentIngredientMeasurement" options={this.measurements.map((option) => option)} onChange={this.handleIngredientMeasurement}
                  freeSolo
                  renderInput={(params) => (
                    <TextField {...params} label="Measurement.." variant="filled"/>
                  )}
                  className="mb-2"
                />
              </Col>
              <Col md={4}>
                <TextField fullWidth id="currentIngredientQuantity" type="number"  onChange={this.onTextFieldChange}  label="Quantity" variant="filled" placeholder="1.."  className="mb-2"/>
              </Col>
              <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                <Button variant="contained" color="primary" size="small" disableRipple onClick={this.addIngredientToMeal} style={{color:"white"}}  className="mb-2" > Add Ingredient</Button>
              </Col>
            </Row>
            <Row className="mb-3" style={{  textAlign:"center"}}>
              <Col md={6} style={{  marginTop:"20px"}}>
                <div style={{ textAlign:"left" , fontWeight:"600", marginBottom:"10px"}}>Meal Image</div>
                <input accept="image/*" id="imgSrc" type="file" className="mb-2" onChange={(ev)=>this.onTextFieldClick(ev)} />
                <img src={loading_imgSrc} width="300px" height="200px"  alt=""/>
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
                <TextField id="readTime"  className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="ReadTime (mins)" variant="filled" required />
              </Col>   
              <Col md={4}>
                <TextField id="cookTime" className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="CookTime (mins)" variant="filled" required/>
              </Col>   
              <Col md={4}>
                <Autocomplete multiple id="tags-filled" className="mb-2" fullWidth options={this.categories.map((option) => option)} defaultValue={[this.categories[0]]}
                  freeSolo
                  renderTags={(value, getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} {...getTagProps({ index })}/>))}
                  renderInput={(params) => (<TextField {...params} variant="filled" label="Categories" placeholder="Suggest categories for this meal.."/>)} />
              </Col>                        
            </Row>

            <Row className="mb-5">
              <Col md={4} style={{textAlign:"center", margin: "auto"}}>
                <ThemeProvider theme={theme}>
                  <Button variant="contained" className="mb-2" color="primary" size="small"  style={{color:"white"}} onClick={()=>this.sendSuggestedMealToDB()}> Add Meal</Button>
                </ThemeProvider>
              </Col>       
            </Row>              
          </form>
        </div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth = "xs"
          fullWidth
          >
          <DialogTitle id="alert-dialog-title">Informtation</DialogTitle>
          <DialogContent>  
            <DialogContentText>Successfully added in database</DialogContentText>       
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default SuggestMeal;
