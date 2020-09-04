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
      instructionsChip: [],      
      readTime: "0 mins read",
      cookTime: "10 mins cook time",
      categoryChips: ["snacks", "abc", "123"],
      productsPopulated: false,

      imgSrc: null,
      loading_imgSrc:"",
      open:false,
      productImgSetting_flag: false,
      productImgSrc: null,
      productImg_path:"",
      product_ind: 0,
      ingredientGroupList:[],

      instructionGroupList:[],
      instructionImgData: null,
      instructionImgPath: "",
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
    if (event.target.files[0] === undefined ) return;
    this.setState({ imgSrc: event.target.files[0] });
    this.setState({ loading_imgSrc:  URL.createObjectURL(event.target.files[0]) });
    this.setState({ img_change_flag: true });

  };

///////////////////////////////////////////////////////////////////////////////////////
  onhandleProductImg = (event) => {   
    if (event.target.files[0] === undefined ) return;
    this.setState({ productImgSrc: event.target.files[0] });
    if (event.target.files[0] !== null) {
        this.setState({ productImg_path:  URL.createObjectURL(event.target.files[0]) });
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onhandleInstructionImg = (event) => { 
    if (event.target.files[0] === undefined ) return;  
    this.setState({ instructionImgData: event.target.files[0] });
    if (event.target.files[0] !== null) {
        this.setState({ instructionImgPath:  URL.createObjectURL(event.target.files[0]) });
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
  onHandleIngredientItem = (ind) =>{
    var array = this.state.ingredientStrings; // make a separate copy of the array
    var array3 = this.state.ingredientGroupList;
    if (ind !== -1) {
      array.splice(ind, 1);
      array3.splice(ind, 1);
      this.setState({ ingredientStrings: array,ingredientGroupList: array3});
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////
  onHandleInstructionItem = (ind) =>{
    const array  =this.state.instructionGroupList;
    array.splice(ind, 1);
    this.setState({instructionGroupList: array});
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  onUpdateIngredientImg= (event, ind) =>{
    if (event.target.files[0] === null || this.state.ingredientGroupList.length<= ind) return;
    const tmp_ingredientData = this.state.ingredientGroupList;
    const tmp_ingredientItem = tmp_ingredientData[ind];

    var tmp1 = { 
      product: tmp_ingredientItem.product,  
      quantity: tmp_ingredientItem.quantity,  
      measurement: tmp_ingredientItem.measurement, 
      productImgData: event.target.files[0],
      productImgPath: URL.createObjectURL(event.target.files[0]),
      flag: true,
    };
    tmp_ingredientData[ind] = tmp1;
    this.setState({ingredientGroupList: tmp_ingredientData});

    // const tmp = {imgSrc:event.target.files[0], path_flag: true, path:URL.createObjectURL(event.target.files[0])}
    // tmp_ingredientItem[ind] = tmp;
    // this.setState({ingredientData: tmp_ingredientItem});
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  onUpdateInstructionImg = (event, ind) =>{
    if (event.target.files[0] === null || this.state.instructionGroupList.length<= ind) return;
    const tmp_instructionData = this.state.instructionGroupList;
    const tmp_instructionItem = tmp_instructionData[ind];

    let tmp = {
      step: tmp_instructionItem.step,
      imgdata: event.target.files[0],
      imgpath: URL.createObjectURL(event.target.files[0]),
    };

    tmp_instructionData[ind] = tmp;
    this.setState({instructionGroupList: tmp_instructionData});
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteIngredientChip(chip) {
    var array = this.state.ingredientStrings; // make a separate copy of the array
    var array3 = this.state.ingredientGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      array3.splice(index, 1);

      this.setState({ ingredientStrings: array, ingredientGroupList:array3});
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteCategoryChip(chip) {
    var array = [...this.state.categoryChips]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ categoryChips: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteInstructionsStep(chip) {
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

    var currProductObject = { 
      product: this.state.currentIngredient,  
      quantity: this.state.currentIngredientQuantity,  
      measurement: this.state.currentIngredientMeasurement, 
      productImgData: this.state.productImgSrc,
      productImgPath: null,
      flag: this.state.productImgSetting_flag,
    };

    if(this.state.productImgSetting_flag ){
      currProductObject.productImgPath = this.state.productImg_path;
      currProductObject.flag = true
    }else{
      currProductObject.productImgPath = this.productsImg_path[this.state.product_ind];
      currProductObject.flag = false;
    }
   

    this.handleAddIngredientChip(properIngredientStringSyntax);

    // if(this.state.productImgSetting_flag ){
    //   const tmp_data = {imgSrc:this.state.productImgSrc, path_flag: true, path:this.state.productImg_path}
    //   this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });  
    // }else{
    //   const tmp_data = {imgSrc:[], path_flag: false, path:this.productsImg_path[this.state.product_ind]}
    //   this.setState({ ingredientData: [...this.state.ingredientData, tmp_data] });
    // }
    
    // console.log("ingredientData: ", this.state.ingredientData);

    

    // var currIngredientObject = { 
    //   product: this.state.currentIngredient,  
    //   quantity: this.state.currentIngredientQuantity,  
    //   measurement: this.state.currentIngredientMeasurement, 
    // };
    this.setState({
      // formatted_ingredient: [ ...this.state.formatted_ingredient,  currIngredientObject ],
      // productImg_path:null,
      // productImgSrc:null,
      // productImg_flag:true,
      ingredientGroupList: [ ...this.state.ingredientGroupList,  currProductObject ]
    });

    this.setState({ productImgSrc: null, productImg_path:"" });
    

  }

  ///////////////////////////////////////////////////////////////////////////////////////
  addInstructionList =()=>{
    if( this.state.instructionsChip.length ===0 ) return;
    let tmp = {
      step: this.state.instructionsChip,
      imgdata: this.state.instructionImgData,
      imgpath: this.state.instructionImgPath,
    }
    this.setState({instructionGroupList: [...this.state.instructionGroupList, tmp ]});
    this.setState({instructionsChip:[], instructionImgData: null, instructionImgPath:"" });
  }
 

///////////////////////////////////////////////////////////////////////////////////////
  sendSuggestedMealToDB = async (e) => {
    const { mealLabel, intro,servings,ingredientStrings,ingredientGroupList, instructionGroupList,imgSrc,readTime,cookTime,categoryChips} = this.state;

    if (mealLabel === "") {  console.log("meal label blank"); return; }
    if (ingredientStrings.length === 0) {   window.alert( "Suggested meal requires adding at least one ingredient to submit" );   return;  }
    if (imgSrc === null) {   window.alert( "You didn't add suggested meal image" );   return;  }

    //------------- to get glabal path for instrution image ----------------------------------------

    console.log("ingredientGroupList: ", ingredientGroupList);
    

    let productImgForm = new FormData();
    let img_count1 = 0;
    for (var i = 0; i < ingredientGroupList.length; i++){
      if (ingredientGroupList[i].productImgData !== null)
      {
        productImgForm.append('productImgs', ingredientGroupList[i].productImgData);
        img_count1 ++;
      }
    }

    const productImg_paths = null;
    if(img_count1 !== 0){
      var productImg_url = "./api/getProductImgURL/";
      const productImg_config = {  method: 'POST',  data: productImgForm, url: productImg_url };

      const response = await axios(productImg_config)
      productImg_paths = response.data.productImg_paths;
    }
    console.log("productImg_paths: ", productImg_paths);

    //-------------to make prodcut data ------------------------------------------
    const formatted_ingredient1 = [];
    const product_slider = [];
    let n1 = -1;
    for (var i = 0; i < ingredientGroupList.length; i++){
      var tmp_ingredient = { 
        product: ingredientGroupList[i].product,  
        quantity: ingredientGroupList[i].quantity,  
        measurement: ingredientGroupList[i].measurement, 
      };
      formatted_ingredient1.push(tmp_ingredient);

      //-----------------------------------------------
     const image = "";
     if (ingredientGroupList[i].productImgData !== null)
     {   
       n1 ++; image = productImg_paths[n1]
     }
     else{
       image = ingredientGroupList[i].productImgPath;
     }
      const tmp_slider_data = { 
        ingredient: ingredientGroupList[i].product,  
        image: image,  
        flag: ingredientGroupList[i].flag, 
      };
      product_slider.push(tmp_slider_data);
    }

    //------------- to get glabal path for instrution image ----------------------------------------
    let instructionImgForm = new FormData();
    let img_count = 0;
    for (var i = 0; i < instructionGroupList.length; i++){
      if (instructionGroupList[i].imgdata !== null)
      {
        instructionImgForm.append('instructionImgs', instructionGroupList[i].imgdata);
        img_count ++;
      }
    }

    const instructionImg_paths = null;
    if(img_count !== 0){
      var instructionImg_url = "./api/getInstructionImgURL/";
      const instructionImg_config = {  method: 'POST',  data: instructionImgForm, url: instructionImg_url };

      const response = await axios(instructionImg_config)
      instructionImg_paths = response.data.instrutionImg_paths;
    }

    //-------------to make instruction data ------------------------------------------
    const instructionGroupData = [];
    let n = -1;
    for (var i = 0; i < instructionGroupList.length; i++){
      const image = null;
      if (instructionGroupList[i].imgdata !== null)
      {   n ++; image = instructionImg_paths[n] }

      let tmp = {
        step: instructionGroupList[i].step,
        image: image,
      }
      instructionGroupData.push(tmp);
    }

    //-------------to make ingredient data ------------------------------------------
    var url = "./api/addMealSuggestion/";

    let suggestMealForm = new FormData();
    suggestMealForm.append('mealLabel', mealLabel);
    suggestMealForm.append('intro', intro);
    suggestMealForm.append('servings', servings);
    suggestMealForm.append('product_slider', JSON.stringify(product_slider));
    suggestMealForm.append('formatted_ingredient', JSON.stringify(formatted_ingredient1));
    suggestMealForm.append('instructionsGroupList', JSON.stringify(instructionGroupData));
    suggestMealForm.append('ingredientStrings', ingredientStrings);
    suggestMealForm.append('readTime', readTime);
    suggestMealForm.append('cookTime', cookTime);
    suggestMealForm.append('categoryChips', JSON.stringify(categoryChips));    
    suggestMealForm.append('imgSrc', imgSrc);
    
    const config = {  method: 'POST',  data: suggestMealForm, url: url };
    axios(config).then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.setState({ open : true});
        console.log(response);
        console.log("Display Meal submitted successfully");        
      } else {
        console.log("Somthing happened wrong");
      }
    }).catch(error => {
      console.log(error);
    });
  }

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
      palette: { primary: green, },
    });
  
    const {loading_imgSrc} = this.state;

    return (
      <div>
        <div style={{ width:"85%" , margin:"auto", backgroundColor: "#f4f4f4"}}>
          <div style={{ padding:"20px", boxShadow: "1px 1px 4px 2px #00000030"}}>
            <div id="title" style={{  marginTop:"20px", marginBottom:"20px", }}>
              <b>Suggestions</b>
            </div>
            <form noValidate autoComplete="off">
              <Row className="mb-3">
                <Col md={4}>
                  <TextField id="mealLabel" fullWidth onChange={this.onTextFieldChange} label="Meal Name" required variant="filled" className="mb-3" />
                  <TextField multiline id="intro" fullWidth onChange={this.onTextFieldChange} label="Intro"  variant="filled" className="mb-3 " />
                </Col>
                <Col md={4} style={{  marginTop:"20px"}}>
                    <input accept="image/*" id="imgSrc" type="file" className="mb-2 pr-4" onChange={(ev)=>this.onTextFieldClick(ev)} /> 
                </Col>
                <Col md={4} style={{  marginTop:"20px", textAlign:"center"}}>
                  <img src={loading_imgSrc} width="70%" height="auto"  alt=""/>
                </Col>   
              </Row>

              <hr/>             
              <Row className="mb-2">
                  <Col md={12}>
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
                </Row>           

                {
                  this.state.ingredientGroupList &&
                  this.state.ingredientGroupList.map((data, index)=>(
                    <div key={index}  className="mb-3" style={{margin:"10px", padding:"10px", backgroundColor:"white",  boxShadow: "1px 1px 4px 2px #00000030"}}>
                      <Row style={{justifyContent: "flex-end"}}> 
                        <i className="fa fa-remove" style={{fontSize:"50%", marginTop: "0px", marginRight: "15px"}} onClick={()=>this.onHandleIngredientItem(index)}></i>
                      </Row>                        
                      <Row >
                        <Col md={5}  className="mb-2" style={{overflowWrap: "break-word"}}>
                          <div className="card-ingredient-content">
                            <div><span style={{fontWeight:"600"}}>1. Product &emsp;&emsp;&nbsp; :</span> {data.product}</div>
                            <div><span style={{fontWeight:"600"}}>2. Quantity&emsp;&emsp; :</span> {data.quantity}</div>
                            <div><span style={{fontWeight:"600"}}>3. Measurement:</span> {data.measurement}</div>

                            <input accept="image/*" id="imgSrc1" type="file" className="mb-2 ml-3 mt-3 " onChange={(ev)=>this.onUpdateIngredientImg(ev, index)} />
                          </div>
                        </Col>
                        <Col md={4}  className="mb-2" style={{textAlign: "center"}}>
                          <img className="mb-2" src={ data.productImgPath} width="auto" height="150px" alt=""/>
                          
                        </Col>
                        <Col md={3}  className="mb-2"></Col>
                      </Row>
                    </div>
                  ))
                }


                <Row className="mb-1">
                  <Col md={4}>
                    <Autocomplete
                      id="currentIngredient"
                      options={this.products.map((option) => option)}
                      onChange={(ev,val)=>this.handleIngredientDropdownChange(ev,val)}
                      onInputChange={(ev)=>this.handleProductName(ev)}
                      freeSolo
                      renderInput={(params) => ( <TextField {...params} label="Ingredients" variant="filled"/>)}
                      fullWidth 
                      className="mb-3"
                    />
                    <TextField fullWidth id="currentIngredientQuantity" type="number"  onChange={this.onTextFieldChange}  label="Quantity" variant="filled" placeholder="1.."  className="mb-3"/>
                  </Col>

                  <Col md={4}>
                    {
                      this.state.productImgSetting_flag ?  
                      <input accept="image/*" id="imgSrc1" type="file" className="mt-3 mb-4" onChange={(ev)=>this.onhandleProductImg(ev)} />:<div style={{marginTop:"70px"}}/>
                    }
                      
                    <Autocomplete id="currentIngredientMeasurement" options={this.measurements.map((option) => option)} onChange={this.handleIngredientMeasurement}
                    freeSolo
                    renderInput={(params) => ( <TextField {...params} label="Measurements" variant="filled"/>   )}
                    className="mb-3"
                    />
                  </Col>

                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                    <Button variant="contained" color="primary" disableRipple onClick={this.addIngredientToMeal} style={{color:"white", width:"80%"}}  className="mb-3" > Add Ingredient</Button>
                  </Col>            
                </Row>
                <Row className="mb-3">
                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                  <TextField id="servings" fullWidth type="number" onChange={this.onTextFieldChange} label="Servings"  variant="filled"  className="mb-2" placeholder="1 person, 2, 4 or 10 people" style={{marginTop:"10px"}}/>
                  </Col>   
                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> </Col>   
                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> </Col>   
                </Row>
                <hr/>
                {
                  this.state.instructionGroupList.length > 0 &&
                  this.state.instructionGroupList.map((data, index)=>(
                    <div key={index}  className="mb-3" style={{margin:"10px", padding:"10px", backgroundColor:"white",  boxShadow: "1px 1px 4px 2px #00000030"}}>
                      <Row style={{justifyContent: "flex-end"}}> 
                        <i className="fa fa-remove" style={{fontSize:"50%", marginTop: "0px", marginRight: "15px"}} onClick={()=>this.onHandleInstructionItem(index)}></i>
                      </Row>                        
                      <Row >
                        <Col md={4}  className="mb-2" style={{overflowWrap: "break-word"}}>
                          <ol className="mdc-list">
                            {data.step.map((chip, index1) => (
                              <li className="mdc-list-item" tabIndex="0" key={index1}>
                                <span className="mdc-list-item__text">{chip}</span>
                              </li>
                            ))}
                          </ol>
                        </Col>
                        <Col md={4}  className="mb-2" style={{textAlign: "center"}}>
                          <img className="mb-2" src={data.imgpath} width="auto" height="150px" alt=""/>
                          <input accept="image/*" id="imgSrc1" type="file" className="mb-2, ml-3" onChange={(ev)=>this.onUpdateInstructionImg(ev, index)} />
                        </Col>
                        <Col md={4}  className="mb-2"></Col>
                      </Row>
                    </div>
                  ))
                }
                <Row className="mb-3">
                  <Col md={12}>
                    <ChipInput label="Instructions"  className="mb-2" fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="filled" />
                  </Col>               
                </Row>

                <Row className="mb-3">         
                  <Col md={4}  className="mb-2">
                    <input accept="image/*" id="imgSrc1" type="file" className="mb-2" onChange={(ev)=>this.onhandleInstructionImg(ev)} />
                  </Col>       
                  <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                    <Button variant="contained" color="primary"  disableRipple style={{color:"white", width:"300px"}}  className="mb-3" onClick={this.addInstructionList}  > ADD NEW INSTRUCTION SET</Button>
                  </Col>
                  <Col md={4}> </Col>
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
                      <Button variant="contained" className="mb-2" color="primary" style={{color:"white"}} onClick={()=>this.sendSuggestedMealToDB()}> Add Meal</Button>
                    </ThemeProvider>
                  </Col>       
                </Row>              
              </form>
          </div>
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
