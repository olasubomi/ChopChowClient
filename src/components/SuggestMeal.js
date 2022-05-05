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
import MealPreview from "./mealsPreview/MealPreview";

class SuggestMeal extends Component {
  products = [];
  productsImg_path = [];
  categories = [];
  measurements = ["mL","oz","L","cup(s)","Tbsp","tsp","pt","lb","g","kg","lb"];

  constructor(props) {
    super(props);
    this.state = {
      mealName: "",
      mealImage: "",
      mealImageName: "",
      mealImageData: "",
      mealLabel: "",
      intro: "",
      servings: 0,
      currentIngredient: "",
      currentIngredientMeasurement: "",
      currentIngredientQuantity: "",
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

      categoryList:[],
      instructionimagesAndVideos: [],

      instructionChunk6: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },
      instructionChunk1: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },
      instructionChunk2: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },
      instructionChunk3: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },
      instructionChunk4: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },
      instructionChunk5: {
        title: "",
        instructionSteps: [],
        dataName: ""
      },

      chunk1Content: "",
      chunk2Content: "",
      chunk3Content: "",
      chunk4Content: "",
      chunk5Content: "",
      chunk6Content: "",

      chef: "",
      suggestedCategories: [],
      suggestedUtensils: [],
      servings: 0,
      tips: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false
    };

    this.handleIngredientDropdownChange = this.handleIngredientDropdownChange.bind(
      this
    );
    this.handleIngredientMeasurement = this.handleIngredientMeasurement.bind(
      this
    );
    this.updateChef = this.updateChef.bind(this);
    this.updateTip = this.updateTip.bind(this);
    this.handleAddInstructionStep = this.handleAddInstructionStep.bind(this);
    this.handleIngredientQuantity = this.handleIngredientQuantity.bind(this);
    this.addIngredientToMeal = this.addIngredientToMeal.bind(this);
    this.openMealDetailsModal = this.openMealDetailsModal.bind(this);
    this.handleProductNameInput = this.handleProductNameInput.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
        
        var categoryList = JSON.parse(body);
        console.log(categoryList);
        if (categoryList && categoryList.data.length !== 0) {
          console.log("returns GET of ALL Categories ");

          for (var i = 0; i < categoryList.data.length; i++) {
            this.categories.push(categoryList.data[i].category_name);
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

  handleAddInstructionStep(chip, chunkIndex) {

    var particularArray;

    console.log("Index is : " + chunkIndex);

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1;
        console.log(particularArray)
        particularArray.instructionSteps = [...this.state.instructionChunk1.instructionSteps, chip]
        this.setState({ instructionChunk1: particularArray });
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.instructionSteps = [...this.state.instructionChunk2.instructionSteps, chip]
        this.setState({ instructionChunk2: particularArray });
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.instructionSteps = [...this.state.instructionChunk3.instructionSteps, chip]
        this.setState({ instructionChunk3: particularArray });
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.instructionSteps = [...this.state.instructionChunk4.instructionSteps, chip]
        this.setState({ instructionChunk4: particularArray });
        break;
      case 5:
        console.log("Comes in here too");
        particularArray = this.state.instructionChunk5;
        particularArray.instructionSteps = [...this.state.instructionChunk5.instructionSteps, chip]
        this.setState({ instructionChunk5: particularArray });
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.instructionSteps = [...this.state.instructionChunk6.instructionSteps, chip]
        this.setState({ instructionChunk6: particularArray });
        break;
      default:
      // ..do nothing
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteInstructionsStep(chip, chunkIndex) {
    console.log("In delete instruction step/chip")
    console.log("Chip is " + chip);
    console.log("Index is " + chunkIndex);

    let particularArray;
    let index;
    let arraySteps;

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          console.log("new array : \n"+ particularArray);
          this.setState({ instructionChunk1: particularArray });
        }
        break;
      case 2:
        particularArray = this.state.instructionChunk2; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk2: particularArray });
        }
        break;
      case 3:
        particularArray = this.state.instructionChunk3; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk3: particularArray });
        }
        break;
      case 4:
        particularArray = this.state.instructionChunk4; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk4: particularArray });
        }
        break;
      case 5:
        particularArray = this.state.instructionChunk5; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk5: particularArray });
        }
        break;
      case 6:
        particularArray = this.state.instructionChunk6; // make a separate copy of the array
        arraySteps = particularArray.instructionSteps
        index = arraySteps.indexOf(chip);
        if (index !== -1) {
          arraySteps.splice(index, 1);
          particularArray.instructionSteps = arraySteps;
          this.setState({ instructionChunk6: particularArray });
        }
        break;
      default:
      // ..do nothing
    }
  }

  handleInstructionTitle(event, chunkIndex) {
    console.log("Index is : " + chunkIndex);
    let chip = event.target.value;
    console.log("Chip is : " + chip);

    let particularArray;

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1;
        console.log(particularArray)
        particularArray.title = chip;
        this.setState({ instructionChunk1: particularArray });
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.title = chip;
        this.setState({ instructionChunk2: particularArray });
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.title = chip;
        this.setState({ instructionChunk3: particularArray });
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.title = chip;
        this.setState({ instructionChunk4: particularArray });
        break;
      case 5:
        particularArray = this.state.instructionChunk5;
        particularArray.title = chip;
        this.setState({ instructionChunk5: particularArray });
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.title = chip;
        this.setState({ instructionChunk6: particularArray });
        break;
      default:
      // ..do nothing
    }

  }

  ///////////////////////////////////////////////////////////////////////////////////////
  // handleAddInstructionStep(chip) {
  //   this.setState({
  //     instructionsChip: [...this.state.instructionsChip, chip],
  //   });
  // }


  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddCategoryStep() {
   console.log("FFFFFFFFFFFFFF+++++++++");
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
  // handleDeleteInstructionsStep(chip) {
  //   var array = [...this.state.instructionsChip]; // make a separate copy of the array
  //   var index = array.indexOf(chip);
  //   if (index !== -1) {
  //     array.splice(index, 1);
  //     this.setState({ instructionsChip: array });
  //   }
  // }

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
  handleProductName=(event, val)=>{
    const searchResult = this.products.map(element=>element.toLowerCase().includes(val.toLowerCase()));
    const flag = searchResult.find(element=>element === true);

    if(flag !== true || flag ===null) {
      this.setState({productImgSetting_flag:true});
      this.setState({ currentIngredient: val });
    }else{
      this.setState({productImgSetting_flag:false});
      this.setState({ currentIngredient: val});
    }
  }


 ///////////////////////////////////////////////////////////////////////////////////////
  handleCategoryDropdownChange=(val)=>{
    this.setState({categoryList: val});
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
    this.setState({ ingredientGroupList: [ ...this.state.ingredientGroupList,  currProductObject ] });
    this.setState({ productImgSrc: null, productImg_path:"" });
    this.setState({ currentIngredient:"",  currentIngredientQuantity:"", currentIngredientMeasurement:""});

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
    const { mealLabel, intro,servings,ingredientStrings,ingredientGroupList, instructionGroupList,imgSrc,readTime,cookTime,categoryList} = this.state;

    if (mealLabel === "") {  console.log("meal label blank"); return; }
    if (ingredientStrings.length === 0) {   window.alert( "Suggested meal requires adding at least one ingredient to submit" );   return;  }
    if (imgSrc === null) {   window.alert( "You didn't add suggested meal image" );   return;  }

    //------------- to get glabal path for instrution image ----------------------------------------
    let productImgForm = new FormData();
    let img_count1 = 0;
    for (var i = 0; i < ingredientGroupList.length; i++){
      if (ingredientGroupList[i].productImgData !== null)
      {
        productImgForm.append('productImgs', ingredientGroupList[i].productImgData);
        img_count1 ++;
      }
    }

    let productImg_paths = null;
    if(img_count1 !== 0){
      var productImg_url = "./api/getProductImgURL/";
      const productImg_config = {  method: 'POST',  data: productImgForm, url: productImg_url };

      const response = await axios(productImg_config)
      productImg_paths = response.data.productImg_paths;
    }

    //-------------to make prodcut data ------------------------------------------
    const formatted_ingredient1 = [];
    const product_slider = [];
    let n1 = -1;
    for (i = 0; i < ingredientGroupList.length; i++){
      var tmp_ingredient = { 
        product: ingredientGroupList[i].product,  
        quantity: ingredientGroupList[i].quantity,  
        measurement: ingredientGroupList[i].measurement, 
      };
      formatted_ingredient1.push(tmp_ingredient);

      //-----------------------------------------------
     let image = "";
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
    for ( i = 0; i < instructionGroupList.length; i++){
      if (instructionGroupList[i].imgdata !== null)
      {
        instructionImgForm.append('instructionImgs', instructionGroupList[i].imgdata);
        img_count ++;
      }
    }

    var instructionImg_paths = null;
    if(img_count !== 0){
      var instructionImg_url = "./api/getInstructionImgURL/";
      const instructionImg_config = {  method: 'POST',  data: instructionImgForm, url: instructionImg_url };

      const response = await axios(instructionImg_config)
      instructionImg_paths = response.data.instrutionImg_paths;
    }

    //-------------to make instruction data ------------------------------------------
    const instructionGroupData = [];
    let n = -1;
    for ( i = 0; i < instructionGroupList.length; i++){
      let image = null;
      if (instructionGroupList[i].imgdata !== null)
      {   n ++; image = instructionImg_paths[n] }

      let tmp = {
        step: instructionGroupList[i].step,
        image: image,
      }
      instructionGroupData.push(tmp);
    }

    //-------------to make new category data ------------------------------------------
    let new_categories = [];
    for(i =0; i< categoryList.length; i++)
    {
      let index = this.categories.indexOf(categoryList[i]);
      if(index==-1) new_categories.push(categoryList[i])
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
    suggestMealForm.append('categoryChips', JSON.stringify(categoryList));    
    suggestMealForm.append('newCategories', JSON.stringify(new_categories)); 

    suggestMealForm.append('imgSrc', imgSrc);
    
    const config = {  method: 'POST',  data: suggestMealForm, url: url };
    axios(config).then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.setState({ open : true});
        console.log(response);
        console.log("Display Meal submitted successfully");   
        window.location.href = "/SuggestMeal"  
      } else {
        console.log("Somthing happened wrong");
      }
    }).catch(error => {
      console.log(error);
    });
  }

  openMealDetailsModal = (index) => {
    // toggle products page visibility for product to be Edited.
    // this.productDisplayBooleansOutOfState[this.state.ingredientGroupList.length] = false;
    // this.productDisplayBooleansOutOfState[index] = true;

    // var tmpIngredientGroupList = this.state.ingredientGroupList;
    // tmpIngredientGroupList[index].display = true;
    // tmpIngredientGroupList[currentProductDisplayIndex].display = false;
    // this.setState({ingredientGroupList: tmpIngredientGroupList});
    console.log("Comes in toggle product details div id. Index is : " + index);

    var individualProductDisplay = document.getElementById("ProductAdditionalDataDisplayed");
    console.log(individualProductDisplay);

    this.setState({openModal: true});
  }

  closeModal() {
    this.setState({ openModal: false });
    // this.props.openModal = false;
    // this.props.func_removeMealFlag();
  }

  updateChef() {
    var chefName = document.getElementById("chef").value;
    this.setState({ chef: chefName })
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  updateTip(chip) {
    // var mealTip = document.getElementById("tips").value;
    let tipsList = this.state.tips;
    this.setState({ tips: [...this.state.tips, chip] })
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteTip(chip) {
    // var mealTip = document.getElementById("tips").value;
    let tipsList = this.state.tips;

    var index = tipsList.indexOf(chip);
    if (index !== -1) {
      tipsList.splice(index, 1);
      this.setState({ tips: tipsList });
    }
  }

  handleProductNameInput = (event, val) => {

    console.log("In handleProductNameInput . \n val is: " + val);
    if (val !== undefined && val !== null) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable 
      const searchResult = this.props.productNames.map(function callback(element) { if (element.toLowerCase() === (val.toLowerCase())) { return true; } else { return false; } });
      const tmpcurrProductIndexInDBsProductsList = searchResult.indexOf(true);
      console.log("Curr Product Index If Exists In Products List is: \n" + tmpcurrProductIndexInDBsProductsList);

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      this.setState({ currProductIndexInDBsProductsList: tmpcurrProductIndexInDBsProductsList });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ currentIngredient: event.target.innerHTML });

      } else {
        this.setState({ currentIngredient: val });
      }
    }
    else {
      console.log('val is null or undefined');
    }
  }

  onUpdateMealImage = (event) => {
    if (event.target.files[0] === undefined) return;
    this.setState({ mealImage: event.target.files[0],
       mealImageName: event.target.files[0].name,
      mealImageData: URL.createObjectURL(event.target.files[0]) });

    
    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;

    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      //display meals main image or videoin suggest meal
      var image = document.getElementById("MealsMainImages");
      image.style.display = "block";
      image.src = URL.createObjectURL(event.target.files[0]);

      console.log(event.target.files[0]);
      console.log(event.target.files[0].name);


      console.log(allowedImageExtensions.exec(event.target.files[0].name));

      // console.log(URL.createObjectURL(event.target.files[0]));
    }
    else {
      alert("Invalid image type");
    }

  };

  handleKitchenUtensilInputName = (val) => {
    this.setState({ suggestedUtensils: [...this.state.suggestedUtensils, val] });

    // causees error when testing in request payload
    // var tmpKitchenUtenails = [...this.state.suggestedUtensils]
    // this.setState({ suggestedUtensils: [tmpKitchenUtenails, val] });
  }


  ///////////////////////////////////////////////////////////////////////////////////////
  render() {
    var comp_instructions = [];
    var count_index = 1;
    for (let i = 0; i < this.state.instructionGroupList.length ; i++) {
      if(i !==0 ){
        count_index += this.state.instructionGroupList[i-1].step.length;
      }
      
      comp_instructions.push(
        <div key={i}  className="mb-3" style={{margin:"10px", padding:"10px", backgroundColor:"white",  boxShadow: "1px 1px 4px 2px #00000030"}}>
          <Row style={{justifyContent: "flex-end"}}> 
            <i className="fa fa-remove" style={{fontSize:"50%", marginTop: "0px", marginRight: "15px"}} onClick={()=>this.onHandleInstructionItem(i)}></i>
          </Row>                        
          <Row >
            <Col md={4}  className="mb-2" style={{overflowWrap: "break-word"}}>
              <div className="mdc-list">
                {this.state.instructionGroupList[i].step.map((chip, index1) => (
                  <div className="mdc-list-item" key={index1}>
                    <span className="mdc-list-item__text">{index1+count_index}. 
                      <span className="mdc-list-item__text"> {chip}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={4}  className="mb-2" style={{textAlign: "center"}}>
              <img className="mb-2" src={this.state.instructionGroupList[i].imgpath} width="auto" height="150px" alt=""/>
              <input accept="image/*" id="imgSrc1" type="file" className="mb-2, ml-3" onChange={(ev)=>this.onUpdateInstructionImg(ev, i)} />
            </Col>
            <Col md={4}  className="mb-2"></Col>
          </Row>
        </div>
      )
    }

    const theme = createMuiTheme({
      palette: { primary: green, },
    });
  
    const {loading_imgSrc, categoryList} = this.state;

    return (
      <div>
        <div style={{ width:"85%" , margin:"2rem auto 0", backgroundColor: "#f4f4f4"}}>
          <div style={{ padding:"20px", boxShadow: "1px 1px 4px 2px #00000030"}}>
            
            {/* <div id="title" style={{  marginTop:"20px", marginBottom:"20px", }}>
              <b>Suggestions</b>
            </div> */}
            <form noValidate autoComplete="off">
              <div id="title" style={{  marginTop:"20px", marginBottom:"20px", }}>
                <b>Best Suggesting Meal</b>
              </div>
              <Row className="mb-2">
                <Col md={12}>
                  <TextField id="mealName" fullWidth onChange={this.onTextFieldChange} label="Meal Name" required variant="filled" className="mb-3" />
                </Col>
              </Row> 
              <Row className="mb-2">
                <Col md={6}>
                  <TextField id="prepTime" className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="PrepTime (mins)" variant="filled" required />
                </Col>
                <Col md={6}>
                  <TextField id="cookTime" className="mb-2" type="number" fullWidth onChange={this.onTextFieldChange} label="CookTime (mins)" variant="filled" required />
                </Col>
              </Row> 
              <Row className="mb-3">
                <Col md={12} style={{ marginTop: "20px" }}>
                  <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="mealImage" name="mealImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateMealImage(ev)} />
                  <p><img id="MealsMainImages" width="100%" alt="main_Meal_Image" style={{ display: "none" }} />
                  </p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={12}>
                  <TextField multiline id="intro" fullWidth onChange={this.onTextFieldChange} label="Intro" variant="filled" className="mb-3 " />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <TextField id="servings" fullWidth type="number" onChange={this.onTextFieldChange} label="Serves" variant="filled" className="mb-3 " placeholder="1 person, 2, 4 or 10 people" />
                </Col>
                <Col md={6}>
                  <TextField id="chef" value={this.state.chef} fullWidth onChange={this.updateChef} label="Chef" variant="filled" className="mb-3 " />
                </Col>
              </Row>
              <b>Add Ingredients:</b>
              <hr />
              <Row className="mb-1">
                <Col>
                  {/* <Autocomplete
                    id="currentIngredient"
                    options={this.products.map((option) => option)}
                    // onChange={(ev)=>this.onTextFieldChange(ev)}
                    value={this.state.currentIngredient}
                    onChange={(ev, val) => this.handleProductNameInput(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} id="currentIngredient" label="ingredients"
                      value={this.state.currentIngredient} variant="filled" type="text"
                    />)}
                    fullWidth
                    className="mb-3"

                  /> */}
                  <Autocomplete
                      id="currentIngredient"
                      options={this.products.map((option) => option)}
                      onChange={(ev,val)=>this.handleIngredientDropdownChange(ev,val)}
                      onInputChange={(ev, val) => this.handleProductName(ev, val)}
                      freeSolo
                      renderInput={(params) => ( <TextField {...params} label="Ingredients" variant="filled"/>)}
                      fullWidth 
                      className="mb-3"
                      value={this.state.currentIngredient}
                    />
                  {/* <TextField id="currentIngredient" label="Ingredients"
                      fullWidth
                      className="mb-3"
                      onChange={(ev, val) => this.handleProductNameInput(ev, val)}
                      value={this.state.currentIngredient} variant="filled" type="text"
                    /> */}
                </Col>

              </Row>
              <Row className="mb-1">

                <Col md={5}>
                  <TextField fullWidth id="currentIngredientQuantity" type="number" onChange={this.onTextFieldChange}
                    label="Quantity" variant="filled" placeholder="1.." className="mb-3" value={this.state.currentIngredientQuantity} />
                </Col>

                <Col md={5}>
                <Autocomplete id="currentIngredientMeasurement" options={this.measurements.map((option) => option)} onChange={this.handleIngredientMeasurement}
                    freeSolo
                    renderInput={(params) => ( <TextField {...params} label="Measurements" fullWidth  variant="filled"/>   )}
                    className="mb-3"
                    value={this.state.currentIngredientMeasurement}
                    />
                  {/* <TextField
                      fullWidth
                      value={this.state.currentIngredientMeasurement} id="currentIngredientMeasurement"
                      onChange={this.handleIngredientMeasurement}
                      className="mb-3"
                      label="Measurements" variant="filled" type="text"  /> */}
                  
                </Col>

                <Col md={2} style={{ textAlign: "center", margin: "auto" }}>
                  <Button variant="contained" color="primary" disableRipple onClick={this.addIngredientToMeal} style={{ color: "white", width: "80%" }} className="mb-3" > Add Ingredient</Button>
                </Col>

              </Row>
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
              <br /><hr /><br />
              <Row>
                <Col>
                  <ChipInput
                      label="Kitchen Utensils : Add any unique cooking utensils needed to make this meal (optional)"
                      value={this.state.suggestedUtensils}
                      onAdd={(chip) => this.handleKitchenUtensilInputName(chip)}
                      placeholder="Kitchen Utensils : Add any unique cooking utensils needed to make this meal (optional)"
                      onDelete={(chip, index) =>this.handleDeleteIngredientChip(chip, index)}
                      variant="filled"
                      fullWidth 
                      className="mb-2"
                    />
                  {/* <ChipInput label=" className="mb-2" fullWidth id="utensils" onChange={(chip) => this.updateUtensils(chip)} variant="filled" /> */}
                </Col>
              </Row>
              <b>Add Recipe Chunks <sup>i</sup>:</b>
              <hr />
              {/* <Row className="mb-3">
                  <Col md={12}>
                    <ChipInput label="Instructions"  className="mb-2" fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="filled" />
                  </Col>               
                </Row> */}

              <Row className="mb-3">
                <Col md={12} className="text-center">
                
                <p> Upload photos/videos for different parts of recipe steps</p>
                </Col>
                {/* <Col md={12}  className="mb-2">
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="imgSrc1" type="file" className="mb-2" onChange={(ev)=>this.onhandleInstructionImg(ev)} />
                  </Col>    */}

                {/* <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                    <Button variant="contained" color="primary"  disableRipple style={{color:"white", width:"300px"}}  className="mb-3" onClick={this.addInstructionList}  > ADD NEW INSTRUCTION SET</Button>
                  </Col> */}
              </Row>

              <Row>
                <Col md={6}>
                  <TextField id="chunk1Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 1)} label="Section 1 Title" variant="filled" />
                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
                  <p><img id="chunk1Image" width="100%" alt="recipe_step1_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk1Video" style={{ display: "none" }} controls>
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk1.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 1)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 1)} variant="filled" />
                </Col>
                <Col md={6}>
                  <TextField id="chunk2Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 2)} label="Section 2 Title" variant="filled" />

                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent2" name="instructionChunkContent2" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 2)} />
                  <p><img id="chunk2Image" width="100%" alt="recipe_step2_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk2Video" style={{ display: "none" }} controls>
                      <source type="video/mp4" id="chunk2VideoSource" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk2.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 2)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 2)} variant="filled" />

                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <TextField id="chunk3Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 3)} label="Section 3 Title" variant="filled" />

                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent3" name="instructionChunkContent3" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 3)} />
                  <p><img id="chunk3Image" width="100%" alt="recipe_step3_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk3Video" style={{ display: "none" }} controls>
                      <source type="video/mp4" id="chunk3VideoSource" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk3.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 3)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 3)} variant="filled" />

                </Col>
                <Col md={6}>
                  <TextField id="chunk4Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 4)} label="Section 4 Title" variant="filled" />

                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent4" name="instructionChunkContent4" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 4)} />
                  <p><img id="chunk4Image" width="100%" alt="recipe_step4_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk4Video" style={{ display: "none" }} controls>
                      <source type="video/mp4" id="chunk4VideoSource" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk4.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 4)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 4)} variant="filled" />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <TextField id="chunk5Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 5)} label="Section 5 Title" variant="filled" />

                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent5" name="instructionChunkContent5" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 5)} />
                  <p><img id="chunk5Image" width="100%" alt="recipe_step5_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk5Video" style={{ display: "none" }} controls>
                      <source type="video/mp4" id="chunk5VideoSource" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk5.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 5)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 5)} variant="filled" />
                </Col>
                <Col md={6}>
                  <TextField id="chunk6Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 6)} label="Section 6 Title" variant="filled" />

                  <br />
                  <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent6" name="instructionChunkContent6" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 6)} />
                  <p><img id="chunk6Image" width="100%" alt="recipe_step6_image_or_video" style={{ display: "none" }} />
                    <video width="100%" id="chunk6Video" style={{ display: "none" }} controls>
                      <source type="video/mp4" id="chunk6VideoSource" />
                      Your browser does not support the video tag.
                    </video>
                  </p>
                  <ChipInput label="Instructions" value={this.state.instructionChunk6.instructionSteps} className="mb-2" fullWidth onAdd={(chip) => this.handleAddInstructionStep(chip, 6)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 6)} variant="filled" />
                </Col>
              </Row>

              <hr />

              <Row className="mb-3">
              <Col md={12}>
                  <Autocomplete
                    multiple
                    id="tags-filled"
                    className="mb-2" 
                    freeSolo
                    // filterSelectedOptions
                    options={this.categories.map((option) => option)} 
                    // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                    onChange={(e, newValue) => this.handleCategoryDropdownChange(newValue)}
                    // getOptionLabel={option => option}
                    // renderTags={() => {}}
                    value={categoryList}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="filled"
                        label="Categories"
                        placeholder="Suggest categories for this meal.."
                        fullWidth
                      />
                    )}
                  />
                </Col>

              </Row>
              <Row>
                <Col md={12}>
                  {/* <ChipInput label="tips" className="mb-2" fullWidth value={this.state.tips} onAdd={(chip) => this.updateTip(chip)} onDelete={(chip, index) => this.deleteTip(chip, index)} variant="filled" /> */}
                  <ChipInput id="tips" label="Tips(optional): include any modifications to this meal you will like to add" className="mb-3" fullWidth value={this.state.tips} onAdd={(chip) => this.updateTip(chip)} onDelete={(chip, index) => this.deleteTip(chip, index)} variant="filled" />

                </Col>
              </Row>
              <u onClick={this.openMealDetailsModal}> Show Preview +</u>
              <br /><br />
              <div id="ProductAdditionalDataDisplayed" >
                <MealPreview openModal={this.state.openModal} closeModal={this.closeModal}
                 mealName={this.state.mealName} mealImage={this.state.mealImage}
                 categories={this.state.categoryList}
                  prepTime={this.state.prepTime} cookTime={this.state.cookTime}
                  serves={this.state.servings}
                  ingredientsList = {this.state.ingredientStrings} utensilsList={this.state.suggestedUtensils}
                  instructionChunk1={this.state.instructionChunk1} instructionChunk2={this.state.instructionChunk2}
                  instructionChunk3={this.state.instructionChunk3} instructionChunk4={this.state.instructionChunk4}
                  instructionChunk5={this.state.instructionChunk5} instructionChunk6={this.state.instructionChunk6}
                  tips={this.state.tips} mealImageData={this.state.mealImageData}
                 />
              </div>
              <Row className="mb-5">
                <Col md={12}>
                  <ThemeProvider theme={theme}>
                    <Button variant="contained" className="mb-2" color="primary" style={{ color: "white", width: "100%" }} onClick={() => this.sendSuggestedMealToDB()}> Add Meal</Button>
                  </ThemeProvider>
                </Col>
                <Col md={12} className="text-center">
                <u>View privacy policy <sup>i</sup></u>
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
