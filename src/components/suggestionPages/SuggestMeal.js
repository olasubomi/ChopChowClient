import React, { Component } from "react";
import TextField from "@mui/material/TextField";
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/lab/Autocomplete"; // createFilterOptions,
// import axios from 'axios';
import axios from '../../util/Api';
import { Row, Col } from "react-bootstrap";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
// import MealPageModal from "../mealsPage/MealPageModal";
import "./suggestion.css";
import Popup2 from "../popups/popup2";
import MealPageModal from "../mealsPage/MealPageModal";
// import ProductsPageModal from "./ProductsPageModal";
var FormData = require('form-data');

// var fs = require('fs');

class SuggestMealForm extends Component {
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = {
      mealName: "",
      mealImage: "",
      mealImageName: "",
      mealImageFile: "",
      mealImagesData: [],
      intro: "",

      ingredientNames: [],
      // do we need product group list AND strings ?
      ingredientGroupList: [],
      // store product names of inputted strings to compare with db products
      ingredientStrings: [],
      // do we want to use current ingredient formats ? Yes.
      currentIngredient: "",
      currentIngredientMeasurement: "",
      currentIngredientQuantity: "",
      currentProductImgSrc: null,
      currentProductDisplayIndex: 0,

      currentStore: "",

      // we need to update how we create image paths
      productImg_path: "",
      new_product_ingredients: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,
      suggestedUtensils: [],

      cookTime: 0,
      prepTime: 0,

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
      instructionWordlength: 0,

      // chunk1Content: "",
      // chunk2Content: "",
      // chunk3Content: "",
      // chunk4Content: "",
      // chunk5Content: "",
      // chunk6Content: "",

      // do we want all the instruction variables ?
      // instructionGroupList:[],

      instructionimagesAndVideos: [],

      chef: "",
      suggestedCategories: [],
      servings: 0,
      tip: '',
      tips: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      stepInputs: []
    };

    this.handleIngredientMeasurement = this.handleIngredientMeasurement.bind(this);
    // this.handleIngredientQuantity = this.handleIngredientQuantity.bind(this);
    this.addIngredientToMeal = this.addIngredientToMeal.bind(this);
    this.updateChef = this.updateChef.bind(this);
    this.updateTip = this.updateTip.bind(this);
    this.handleAddInstructionStep = this.handleAddInstructionStep.bind(this);
    this.handleInstructionTitle = this.handleInstructionTitle.bind(this);

    this.handleUtensilsDropdownChange = this.handleUtensilsDropdownChange.bind(this);
    this.openMealDetailsModal = this.openMealDetailsModal.bind(this);
    this.handleProductNameInput = this.handleProductNameInput.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleStoreNameInput = this.handleStoreNameInput.bind(this);

    // this.getProductIndex = this.getProductIndex.bind(this);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {

    // get all Meal Names***
    var url = "/get-meals";
    axios.get(url).then((body) => {
      var mealList = body.data;
      if (mealList && mealList.data.length !== 0) {
        console.log("returns GET of ALL MEALS ");
        for (var i = 0; i < mealList.data.length; i++) {
          this.props.allMealNames.push(mealList.data[i].mealName);
        }
      } else {
        console.log("get all meal names function does not return");
      }
    })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.props.allMealNames);
    // get all store names*, if NEW products section exists.

    // can redux resolve this for us by checking if we recently called this in cache or from another page ??
    // var url = "/get-all-products";
    url = "https://chopchowdev.herokuapp.com/get-all-products";

    // axios.get(url).then((body) => {
    //   this.productsList = body.data;
    //   if (this.productsList && this.productsList.data.length !== 0) {
    //     console.log("returns GET ALL PRODUCTS ");
    //     for (var i = 0; i < this.productsList.data.length; i++) {
    //       this.productNames.push(this.productsList.data[i].product_name);
    //       this.productImageLink.push(this.productsList.data[i].product_image);
    //     }       
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    //----get category meals-------------------------
    url = "/get-all-categories";
    // axios.get(url).then((body) => {
    //   var categoriesFromDBList = body.data;
    //   if (categoriesFromDBList && categoriesFromDBList.data.length !== 0) {
    //     console.log("returns GET of ALL Categories ");

    //     for (var i = 0; i < categoriesFromDBList.data.length; i++) {
    //       this.props.categories.push(categoriesFromDBList.data[i].category_name);
    //     }
    //     console.log("PRINTING UPDATED CATEGORIES LIST");
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.categories = this.props.categories;
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleCloseOfMealSubmissinoDialogMessage = () => {
    this.setState({ booleanOfDisplayOfDialogBoxConfirmation: false });
    // close out of state tracker..
    // productDisplayBooleansOutOfState[index] = false;
  };

  //////////////////////////////////////////////////////////////////////////////////////////////
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

    // if (individualProductDisplay.style.display === "block") {
    //   individualProductDisplay.style.display = "none";
    // }
    // else {
    //   individualProductDisplay.style.display = "block";
    // }
    this.setState({openModal: true});
  }


  closeModal() {
    this.setState({ openModal: false });
    // this.props.openModal = false;
    // this.props.func_removeMealFlag();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  onTextFieldChange = (e) => {
    console.log("Comes in on text field change; ");

    console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onInputChange = (e, val) => {
    console.log("Comes in on text field change; ");
    console.log(e.target.id)
    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ "mealName": val });
  };

  ///////////////////////////////////////////////////////////////////////////////////////
  onUpdateMealImage = (event) => {
    if (event.target.files[0] === undefined) return;
    this.setState({ mealImage: event.target.files[0], 
      mealImageName: event.target.files[0].name,
    mealImageData:  URL.createObjectURL(event.target.files[0]) });

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

  ///////////////////////////////////////////////////////////////////////////////////////
  onhandleInstructionImg = (event, id) => {
    if (event.target.files[0] === undefined) return;

    console.log("uploading recipeChunkImageOrVideo content looks like below: ");
    console.log(event.target.files[0]);
    let particularArray;

    switch (id) {
      case 1:     
        particularArray = this.state.instructionChunk1;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk1: particularArray, chunk1Content: event.target.files[0]  });
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk2: particularArray, chunk2Content: event.target.files[0]  });
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk3: particularArray ,chunk3Content: event.target.files[0]});
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk4: particularArray ,chunk4Content: event.target.files[0]});
        break;
      case 5:
        particularArray = this.state.instructionChunk5;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk5: particularArray ,chunk5Content: event.target.files[0]});
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.dataName = event.target.files[0].name;
        this.setState({ instructionChunk6: particularArray, chunk6Content: event.target.files[0] });
        break;
      default:
      // ..do nothing
    }

    // this.setState({ instructionimagesAndVideos: recipeChunkImageOrVideo });


    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;
    var allowedVideoExtensions = /(\.mp4|\.m4v|\.)$/i;

    var imageElementId = "chunk" + (id) + "Image";
    var videoElementId = "chunk" + (id) + "Video";
    var image = document.getElementById(imageElementId);
    var video = document.getElementById(videoElementId);

    // console.log(allowedImageExtensions.exec(event.target.files[0].name));

    // we need to keep track of wether an image or video was last uploaded and use the last one only.
    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      //display meals main image or videoin suggest meal
      image.style.display = "block";
      video.style.display = "none";

      image.src = image.src = URL.createObjectURL(event.target.files[0]);
    }
    else if (allowedVideoExtensions.exec(event.target.files[0].name)) {
      //display meals main image or videoin suggest meal
      video.style.display = "block";
      image.style.display = "none";

      // var video_source = document.getElementById(videoElementId+'Source');
      // video_source.src =  URL.createObjectURL(event.target.files[0]);
      video.src = URL.createObjectURL(event.target.files[0]);

      video.play();
      // console.log(URL.createObjectURL(event.target.files[0]));
      console.log(event.target.files[0]);
    }
    else {
      alert('Invalid file type');
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////
  onUpdateInstructionImg = (event, ind) => {
    if (event.target.files[0] === null) return;

    // const tmp_instructionData = this.state.instructionGroupList;
    // const tmp_instructionItem = tmp_instructionData[ind];

    const temp_instructionImageOrVideoArray = this.state.instructionimagesAndVideos;
    // const individual_ImageOrVideo = temp_instructionImageOrVideoArray[ind];

    // tmp_instructionData[ind] = tmp;
    temp_instructionImageOrVideoArray[ind] = event.target.files[0];

    // this.setState({instructionGroupList: tmp_instructionData});
    this.setState({ instructionimagesAndVideos: temp_instructionImageOrVideoArray });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  updateChef() {
    var chefName = document.getElementById("chef").value;
    this.setState({ chef: chefName })
  }

  handleTip = (e) => {
    this.setState({
      tip: e.target.value
    })
    if(e.keyCode === 13){
      this.updateTip()
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  updateTip() {
    let chip = this.state.tip
    this.setState({ tips: [...this.state.tips, chip], tip: '' })
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteTip(chip) {
    let tipsList = this.state.tips;
    console.log(chip)
    var index = tipsList.indexOf(chip);
    if (index !== -1) {
      tipsList.splice(index, 1);
      this.setState({ tips: tipsList });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////
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

  // getProductIndex(){
  //   this.productDisplayBooleansOutOfState.map(function(key, value){
  //     if(value == true){
  //       return key;
  //     }
  //   })
  // };
  ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddIngredientChip(chip) {
    this.setState({
      ingredientStrings: [...this.state.ingredientStrings, chip],
    });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteNewIngredientFromNewProductPopUp = (ind) => {
    var array = this.state.ingredientStrings;
    var removeFromGroup = this.state.ingredientGroupList;
    var tmpNewProductsList = this.state.new_product_ingredients;
    // dont we need to get the specific index from new products list and ingredient group list ?
    if (ind !== -1) {
      array.splice(ind, 1);
      removeFromGroup.splice(ind, 1);
      tmpNewProductsList.splice(ind, 1);
      this.setState({ ingredientStrings: array, ingredientGroupList: removeFromGroup,
         new_product_ingredients: tmpNewProductsList });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteIngredientChip(chip) {
    var array = this.state.ingredientStrings; // make a separate copy of the array
    var removeFromGroup = this.state.ingredientGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      removeFromGroup.splice(index, 1);

      this.setState({ ingredientStrings: array, ingredientGroupList: removeFromGroup });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleIngredientMeasurement(event, val) {
    // if (event.target.value) {
    //   this.setState({ currentIngredientMeasurement: event.target.value });
    // } else {
    //   this.setState({ currentIngredientMeasurement: "" });
    // }

    console.log("In handleIngredientMeasurement . \n val is: " + val);

    if (val !== null && val !== undefined) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable 
      const searchResult = this.props.measurements.map(function callback(element) { if (element.toLowerCase() === (val.toLowerCase())) { return true; } else { return false; } });
      const tmpcurrMeasurementIndexInDBsMeasurementList = searchResult.indexOf(true);
      console.log("Curr Product Index If Exists In Products List is: \n" + tmpcurrMeasurementIndexInDBsMeasurementList);

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      // this.setState({ currProductIndexInDBsProductsList: tmpcurrMeasurementIndexInDBsMeasurementList });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ currentIngredientMeasurement: event.target.innerHTML });

      } else {
        this.setState({ currentIngredientMeasurement: val });
      }
    }
    else {
      console.log('val is null!');
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
  handleAddInstructionStep(chip, chunkIndex) {

    var particularArray;

    console.log("Index is : " + chunkIndex);
    // if(chip.split(' ').length > 150){
    //   this.setState({

    //     instructionWordlength: '10px'
    //   })
    // }

    // let wordlength = this.state.instructionWordlength;

    // this.setState({
    //   instructionWordlength: wordlength + chip.split(' ').length
    // })
    if(chip.keyCode === 13){

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1;
        particularArray.instructionSteps = [...this.state.instructionChunk1.instructionSteps, chip.target.value]
        this.setState({ instructionChunk1: particularArray });
        document.getElementById('instructionChunk1').value = '';
        break;
      case 2:
        particularArray = this.state.instructionChunk2;
        particularArray.instructionSteps = [...this.state.instructionChunk2.instructionSteps, chip.target.value]
        this.setState({ instructionChunk2: particularArray });
        document.getElementById('instructionChunk2').value = '';
        break;
      case 3:
        particularArray = this.state.instructionChunk3;
        particularArray.instructionSteps = [...this.state.instructionChunk3.instructionSteps, chip.target.value]
        this.setState({ instructionChunk3: particularArray });
        document.getElementById('instructionChunk3').value = '';
        break;
      case 4:
        particularArray = this.state.instructionChunk4;
        particularArray.instructionSteps = [...this.state.instructionChunk4.instructionSteps, chip.target.value]
        this.setState({ instructionChunk4: particularArray });
        document.getElementById('instructionChunk4').value = '';
        break;
      case 5:
        console.log("Comes in here too");
        particularArray = this.state.instructionChunk5;
        particularArray.instructionSteps = [...this.state.instructionChunk5.instructionSteps, chip.target.value]
        this.setState({ instructionChunk5: particularArray });
        document.getElementById('instructionChunk5').value = '';
        break;
      case 6:
        particularArray = this.state.instructionChunk6;
        particularArray.instructionSteps = [...this.state.instructionChunk6.instructionSteps, chip.target.value]
        this.setState({ instructionChunk6: particularArray });
        document.getElementById('instructionChunk6').value = '';
        break;
      default:
      // ..do nothing
    }}

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

  ///////////////////////////////////////////////////////////////////////////////////////
  handleKitchenUtensilInputName = (val) => {
    this.setState({ suggestedUtensils: val });

    // causees error when testing in request payload
    // var tmpKitchenUtenails = [...this.state.suggestedUtensils]
    // this.setState({ suggestedUtensils: [tmpKitchenUtenails, val] });
  }

  addKitchenUtensil = () => {
    let cat = document.getElementById('kitchen_utenails');
    let suggestedUtensils = this.state.suggestedUtensils;
    suggestedUtensils.push(cat.value);
    this.setState({
      suggestedUtensils
    })
    cat.value = '';
  }
  ///////////////////////////////////////////////////////////////////////////////////////
  handleUtensilsDropdownChange(event) {
    if (event.target.value) {
      this.setState({ suggestedUtensils: [...this.state.suggestedUtensils, event.target.value] });
    } else {
      this.setState({ suggestedUtensils: [...this.state.suggestedUtensils, event.target.innerHTML] });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteUtensilsChip(chip) {
    var array = [...this.state.suggestedUtensils]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      this.setState({ suggestedUtensils: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleAddCategoryChip(chip) {
    this.setState({ suggestedCategories: [...this.state.suggestedCategories, chip] });

    // new categories are created and handled on submit meal simply


  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleCategoryDropdownChange = (val) => {
    console.log(this.state.suggestedCategories)
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });

  }

  addCategory = () => {
    let cat = document.getElementById('tags-outlined');
    let suggestedCategories = this.state.suggestedCategories;
    suggestedCategories.push(cat.value);
    this.setState({
      suggestedCategories
    })
    cat.value = '';
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  handleDeleteCategoryChip(chip) {
    var array = [...this.state.suggestedCategories]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ suggestedCategories: array });
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  addIngredientToMeal(event) {
    console.log("COMES IN addIngredientToMeal");
    event.preventDefault();
    var properIngredientStringSyntax;
    var ingredientValue = document.getElementById("currentIngredient").value;
    var quantityValue = document.getElementById("currentIngredientQuantity").value;
    // best to get the measurement from the state
    // perhaps becuse inner html is defined before state is updated
    // var measurementValue = this.state.currentIngredientMeasurement;
    var measurementValue = document.getElementById("currentIngredientMeasurement").value;


    if (ingredientValue === "") { window.alert("Enter an ingredient to add to meal"); return; }
    // update ingredient string syntax for no quantity or no measurement.
    if (quantityValue === "") {
      properIngredientStringSyntax = ingredientValue;
    } else if (measurementValue === "" && quantityValue !== "") {
      // MAKE sure we are using the right and tested variables to display the right type of string at all times.
      properIngredientStringSyntax = "" + quantityValue + " " + ingredientValue;
    } else {
      properIngredientStringSyntax =
        "" + quantityValue + " " + measurementValue +
        " of " + ingredientValue;
    }
    console.log(properIngredientStringSyntax);

    // This is the Object for an Ingredient of a Known Product
    var currIngredientObject = {
      // productName: this.state.currentIngredient,  
      productName: ingredientValue,
      // productImgFile: this.state.currentProductImgSrc,
      productImgPath: null,
      // display: this.state.currProductIndexInDBsProductsList,
      // availableLocations: [],

      // these are added to ingredient packets on submit, and not relevant in product object details
      quantity: quantityValue,
      measurement: measurementValue,
      properIngredientStringSyntax: properIngredientStringSyntax
    };

    console.log("current state of product index at Add Ingredient To Meal is : \n" + this.state.currProductIndexInDBsProductsList);

    const searchResult = this.props.productNames.map(function callback(element) { if (element.toLowerCase() === (ingredientValue.toLowerCase())) { return true; } else { return false; } });
    const tmpcurrProductIndexInDBsProductsList = searchResult.indexOf(true);
    console.log("Curr Product Index If Exists In Products List is: \n" + tmpcurrProductIndexInDBsProductsList);


    if (tmpcurrProductIndexInDBsProductsList !== -1) {
      console.log("using already existing product object from db");

      // necessary, but we first need to get the index of the product
      // to assign the path to current object productImageLink
      // if we are able to get this ingredient id then we can pass its image
      // index in products list is different from that of ingredients group list

      // currIngredientObject.productImgPath = this.productImageLink[this.state.currProductIndexInDBsProductsList];
      console.log("DOES NOT ADD to new _product_ingredients");

    }
    else {
      console.log("ADDs to new_product_ingredients");

      console.log("creating new product object");

      // edit product details for new product object
      // currIngredientObject.productImgFile = null;
      currIngredientObject.productIndex = 0;
      // currIngredientObject.calories = 0;

      // append String to new Products array if not
      // var tmpNewProducts = [...this.state.new_product_ingredients];
      // var tmpNewProducts = this.state.new_product_ingredients;
      // var updatedProductList = [tmpNewProducts, currIngredientObject];

      // this.setState({ new_product_ingredients: updatedProductList })
      this.setState({ new_product_ingredients: [...this.state.new_product_ingredients, currIngredientObject] });
    }

    this.setState({ ingredientGroupList: [...this.state.ingredientGroupList, currIngredientObject] });
    // after adding product to ingredient group list
    // reset current product img src and path to null, and same for current ingredient inputs
    // this.setState({ currentProductImgSrc: null, productImg_path: "" });
    this.setState({ currentIngredient: "null", currentIngredientQuantity: '', currentIngredientMeasurement: "null" });
    this.setState({ currentIngredient: "", currentIngredientMeasurement: "" });
    this.handleAddIngredientChip(properIngredientStringSyntax);

    //  Resetting inner html directly to clear ingredient inputs without changing state
    // document.getElementById("currentIngredient").value = 'NewPs';
    // document.getElementById("currentIngredientQuantity").value = 8;
    // document.getElementById("currentIngredientMeasurement").value = 'Removed';

  }


  ///////////////////////////////////////////////////////////////////////////////////////
  sendSuggestedMealToDB = async (e) => {
    const { mealName, prepTime, cookTime, mealImage, mealImageName, intro, servings, chef, 
      new_product_ingredients, ingredientGroupList, suggestedCategories, tips, suggestedUtensils, 
      chunk1Content, chunk2Content, chunk3Content, chunk4Content, chunk5Content, chunk6Content} = this.state;

    // handle edge case meal name, ingredienrs or image upload required to submit form
    if (mealName === "") { console.log("meal label blank"); return; }
    // if (ingredientStrings.length === 0) { window.alert("Suggested meal requires adding at least one ingredient to submit"); return; }
    if (mealImage === null || mealImage === undefined) { window.alert("You didn't add suggested meal image"); return; }

    // Handle instruction/product images to create url for product images on server
    /*Loop through Ingredients meal data
    Check if all products listed exist in the database.
    If not, let server create placeholder before submitting to db.
    Get list of new products and new Categories
    This for loop is making sure we are building a product_slider.
    we could probably merge this in the above for loop easily, but we want to call this path function,
    so lets figure out what its even doing!*/

    const all_ingredients_formatted = [];
    const product_slider = [];
    let i = 0;

    for (i = 0; i < new_product_ingredients.length; i++) {
      // store ingredient format to submit ingredient product objects
      var tmp_ingredient = {
        // name and optional image added to new product,
        // we can add remainder products data after testing current
        ingredient: new_product_ingredients[i].productName,
        // image: new_product_ingredients[i].productImgFile
      };
      // handle quantity measurement list
      var measurementQuantity = {
        quantity: ingredientGroupList[i].quantity,
        measurement: ingredientGroupList[i].measurement,
      }
      // no need for handlers since this is created on submit!
      this.ingredientsQuantityMeasurements.push(measurementQuantity);
      // new_products.push(tmp_ingredient);
      // product_slider.push(tmp_slider_data);
    }

    let new_measurements = [];
    for (i = 0; i < ingredientGroupList.length; i++) {
      // store ingredient format to submit ingredient product objects
      var tmp_ingredient = {
        // name and optional image added to new product,
        // we can add remainder products data after testing current
        productName: ingredientGroupList[i].productName,
        quantity: ingredientGroupList[i].quantity,
        measurement: ingredientGroupList[i].measurement,
        productImgPath: ingredientGroupList[i].productImgPath,
        properIngredientStringSyntax: ingredientGroupList[i].properIngredientStringSyntax
      };

      all_ingredients_formatted.push(tmp_ingredient);
      console.log(tmp_ingredient);

      const tmp_slider_data = {
        ingredient: ingredientGroupList[i].product,
        image: ingredientGroupList[i].productImgPath,
        display: ingredientGroupList[i].display,
      };
      // store product slider format to submit slider object to meal
      product_slider.push(tmp_slider_data);


      // get new_Measurements from inputted ingredient packets
      if (ingredientGroupList[i].measurement !== "") {
        let index = this.props.measurements.indexOf(ingredientGroupList[i].measurement);
        if (index === -1) new_measurements.push(ingredientGroupList[i].measurement);
      }
    }
    //-------------to make new category data ------------------------------------------
    // get list of new categories to submit to mongo
    let new_categories = [];
    for (i = 0; i < suggestedCategories.length; i++) {
      // check if categories already exist, only add new categories to db,
      // though all will still be attached to meal, as mentioned
      let index = this.props.categories.indexOf(suggestedCategories[i]);
      if (index === -1) new_categories.push(suggestedCategories[i]);
    }

    let new_kitchen_utensils = [];
    for (i = 0; i < suggestedUtensils.length; i++) {
      // check if categories already exist, only add new categories to db,
         // though all will still be attached to meal, as mentioned
         let index = this.props.kitchenUtensils.indexOf(suggestedUtensils[i]);
      if (index === -1) new_kitchen_utensils.push(suggestedUtensils[i]);
    }

    //prepare Meal data to Mongo and Recipe Steps Images and Video content to s3
    const instructionGroupData = [];
    const contentNameToContentImageOrVideoMapForS3 = new FormData();
    console.log("Meal name:");
    console.log(this.state.mealName);

    // max recipe chunks is 6
    for (i = 0; i < 6; i++) {
      var contentKey = 'instructionChunkContent' + (i + 1);
      console.log(this.state.instructionimagesAndVideos[i]);
      // add image or video to recipecontent array
      if (this.state.instructionimagesAndVideos[i] !== undefined) {
        console.log("Comes in here to send individual content");
        console.log(this.state.instructionimagesAndVideos[i]);
        // contentNameToContentImageOrVideoMapForS3.append( "mealContentName" , contentKey);
        contentNameToContentImageOrVideoMapForS3.append(contentKey, 
          this.state.instructionimagesAndVideos[i]);
        console.log(contentNameToContentImageOrVideoMapForS3);
      }

      let currInstructionChunk = [];
      // let chunkContent;
      // start cases with 0 to include all step slide content
      switch (i) {
        case 0:
          currInstructionChunk = this.state.instructionChunk1;
          // currInstructionChunk.dataName = this.state.chunk1Content.filename;
          break;
        case 1:
          currInstructionChunk = this.state.instructionChunk2;
          // currInstructionChunk.dataName = this.state.chunk2Content.filename;
          break;
        case 2:
          currInstructionChunk = this.state.instructionChunk3;
          // currInstructionChunk.dataName = this.state.chunk3Content.filename;
          break;
        case 3:
          currInstructionChunk = this.state.instructionChunk4;
          // currInstructionChunk.dataName = this.state.chunk4Content.filename;
          break;
        case 4:
          currInstructionChunk = this.state.instructionChunk5;
          // currInstructionChunk.dataName = this.state.chunk5Content.filename;
          break;
        case 5:
          currInstructionChunk = this.state.instructionChunk6;
          // currInstructionChunk.dataName = this.state.chunk6Content.filename;
          break;
        default:
          currInstructionChunk = "null";
      }

      // let submitable_recipe_chunk = {
      //   // do not include and submite a step zero..
      //   step: i+1,
      //   // title is defined in instruction chunk
      //   instructionChunk: currInstructionChunk,
      //   // dataname : null
      // }
      // allMealsInstructionimagesAndVideosCombined.push(contentNameToContentImageOrVideoMapForS3);
      instructionGroupData.push(currInstructionChunk);
    }

    contentNameToContentImageOrVideoMapForS3.append('mealContentName', this.state.mealName);
    console.log(contentNameToContentImageOrVideoMapForS3);
    var keyValueData = { mealContentName: this.state.mealName };
    // console.log("Stringified version:");
    // console.log(keyValueData);
    var singleTitleTest = JSON.stringify(keyValueData);
    console.log(singleTitleTest);


    //-------------Submit remainder data of meal to Mongo ------------------------------------------
    let suggestMealForm = new FormData();
    suggestMealForm.append('mealName', mealName);
    suggestMealForm.append('mealImage', mealImage);
    suggestMealForm.append('mealImageName', mealImageName);

    suggestMealForm.append('prepTime', prepTime);
    suggestMealForm.append('cookTime', cookTime);
    suggestMealForm.append('intro', intro);

    suggestMealForm.append('tips',  JSON.stringify(tips));
    suggestMealForm.append('chef', chef);
    suggestMealForm.append('servings', servings);

    // suggestMealForm.append('ingredientStrings', ingredientStrings);
    // list of products quantity measurements (created on submit meal)
    // suggestMealForm.append('ingredientsQuantityMeasurements', JSON.stringify(this.ingredientsQuantityMeasurements));
    suggestMealForm.append('new_measurements', JSON.stringify(new_measurements));

    // suggestMealForm.append('product_slider', JSON.stringify(product_slider));
    suggestMealForm.append('formatted_ingredient', JSON.stringify(all_ingredients_formatted));

    // new suggested products
    suggestMealForm.append('new_product_ingredients', JSON.stringify(new_product_ingredients));

    suggestMealForm.append('categories', JSON.stringify(suggestedCategories));
    suggestMealForm.append('newCategories', JSON.stringify(new_categories));

    suggestMealForm.append('kitchenUtensils', JSON.stringify(suggestedUtensils));
    suggestMealForm.append('newKitchenUtensils', JSON.stringify(new_kitchen_utensils));

    // RecipeSteps
    suggestMealForm.append('stepSlides', JSON.stringify(instructionGroupData));
    suggestMealForm.append('instructionChunkContent1', chunk1Content);
    suggestMealForm.append('instructionChunkContent2', chunk2Content);
    suggestMealForm.append('instructionChunkContent3', chunk3Content);
    suggestMealForm.append('instructionChunkContent4', chunk4Content);
    suggestMealForm.append('instructionChunkContent5', chunk5Content);
    suggestMealForm.append('instructionChunkContent6', chunk6Content);

    // suggestMealForm.append('instructionsGroupList', instructionGroupData);
    console.log(this.state.chunk1Content);

    // chunk content should be passed as file
    //---------------------------------------------Submit Meal to Mongo---------------------------------------------------
    // var url = "/addMealSuggestion/";
    var url = "http://localhost:5000/api/meals/addMealSuggestion/";

    const config = {
      method: 'POST', data: suggestMealForm, url: url,
      headers: {
        // 'application/json' is the modern content-type for JSON, but some
        // older servers may use 'text/json'.
        // See: http://bit.ly/text-json
        // application/x-www-form-urlencoded
        // 'content-type': 'multipart/form-data'
      }
    };

    console.log("Printing Chunk Contents");

    var instructionData = JSON.parse(JSON.stringify(instructionGroupData));
    console.log(instructionData);

    axios(config).then(response => {
      if (response.status >= 200 && response.status < 300) {
        this.setState({ booleanOfDisplayOfDialogBoxConfirmation: true });
        console.log(response);
        console.log("Display Meal submitted successfully");
        // window.location.href = "/SuggestMeal"
      } else {
        console.log("Something wrong happened ");
      }
    }).catch(error => {
      console.log(error);
    });

  }

  uploadMediaStep = (id) => {
    // <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "instructionChunkContent" + id;
    input.name = "instructionChunkContent" + id;
    input.type = "file";
    input.onchange = (ev) => this.onhandleInstructionImg(ev, id);
    input.hidden = true;
    input.click()
  }

  uploadMealImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="mealImage" name="mealImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateMealImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "mealImage";
    input.name = "mealImage";
    input.type = "file";
    input.onchange = (ev) => this.onUpdateMealImage(ev);
    input.hidden = true;
    input.click()
  }

  addMoreStep = () => {
    let stepInputs = this.state.stepInputs;

    let id = stepInputs.length + 2;
    
    console.log(document.getElementById('chunk1Title'))
    stepInputs.push(id)
    this.setState({
      stepInputs
    })
  }


  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    // const [ingredientInput, setIngredientInput] = useState('');    

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { ingredientStrings, stepInputs } = this.state;

    return (
          <div className="suggestion_section_2" >
            <form className="suggestion_forms" noValidate autoComplete="off" encType="multipart/form-data" method="post" >
              <h3>Begin Suggesting Meal</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="mealName" className="suggestion_form_label">
                    Meal Name
                  </label>
                  <Autocomplete
                    id="mealName"
                    options={this.props.allMealNames.map((option) => option)}
                    // onChange={(ev, val) => this.onInputChange(ev, val)}
                    onInputChange={(ev, val) => this.onInputChange(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} variant="outlined" />)}
                    fullWidth
                    value={this.state.mealName}
                  />
                </div>
                <div className="suggestion_form_2_col">
                  <div className="suggestion_form_2_col_1">
                    <div className="suggestion_form_group">
                      <label htmlFor="prepTime" className="suggestion_form_label">
                        PrepTime (Minutes)
                      </label>
                      <TextField id="prepTime" type="number" fullWidth onChange={this.onTextFieldChange} variant="outlined" required />
                    </div>
                  </div>
                  <div className="suggestion_form_2_col_2">
                    <div className="suggestion_form_group">
                      <label htmlFor="cookTime" className="suggestion_form_label">
                        CookTime (Minutes)
                      </label>
                      <TextField id="cookTime" type="number" fullWidth onChange={this.onTextFieldChange} variant="outlined" required />
                    </div>
                  </div>
                </div>

                <h3>Upload Images</h3>

                <div className="suggestion_form_image">
                    <div className="suggestion_form_image_col_1">
                      <div onClick={() => this.uploadMealImage()} className="suggestion_form_image_icon_con">
                        <AddIcon className="suggestion_form_image_icon" />
                      </div>
                    </div>
                    <div className="suggestion_form_image_col_2">
                      <p>Upload picture with : Jpeg or Png format and not more than 500kb</p>
                    </div>
                </div>
                <Row>
                  <Col md={12} style={{ marginTop: "20px" }}>
                    <p><img id="MealsMainImages" width="100%" alt="main_Meal_Image" style={{ display: "none" }} />
                    </p>
                  </Col>
                </Row>

                <h3>Add more details</h3>
                <div className="suggestion_form_group">
                  <label htmlFor="intro" className="suggestion_form_label">
                    Intro (150 words)
                  </label>
                  <TextField multiline id="intro" fullWidth onChange={this.onTextFieldChange} variant="outlined" />
                </div>
                <div className="suggestion_form_2_col">
                  <div className="suggestion_form_2_col_1">
                    <div className="suggestion_form_group">
                      <label htmlFor="servings" className="suggestion_form_label">
                        People to serve
                      </label>
                      <TextField id="servings" fullWidth type="number" onChange={this.onTextFieldChange} variant="outlined" placeholder="1 person, 2, 4 or 10 people" />
                    </div>
                  </div>
                  <div className="suggestion_form_2_col_2">
                    <div className="suggestion_form_group">
                      <label htmlFor="chef" className="suggestion_form_label">
                        Name of Chef
                      </label>
                      <TextField id="chef" value={this.state.chef} fullWidth onChange={this.updateChef} variant="outlined" />
                    </div>
                  </div>
                </div>
              </div>
              <h3>Add Ingredients</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="currentIngredient" className="suggestion_form_label">
                    Ingredient Name
                  </label>
                  <Autocomplete
                    id="currentIngredient"
                    options={this.props.productNames.map((option) => option)}
                    // onChange={(ev)=>this.onTextFieldChange(ev)}
                    value={this.state.currentIngredient}
                    onChange={(ev, val) => this.handleProductNameInput(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} id="currentIngredient"
                      value={this.state.currentIngredient} variant="outlined" type="text"
                    />)}
                    fullWidth

                  />
                </div>
                <div className="suggestion_form_2_col">

                  <div className="suggestion_form_2_col_1">
                    <div className="suggestion_form_group">
                      <label htmlFor="currentIngredientQuantity" className="suggestion_form_label">
                        Quantity
                      </label>
                      <TextField fullWidth id="currentIngredientQuantity" type="number" onChange={this.onTextFieldChange}
                        variant="outlined" placeholder="1.." value={this.state.currentIngredientQuantity} />
                    </div>
                  </div>

                  <div className="suggestion_form_2_col_2">
                    <div className="suggestion_form_group">
                      <label htmlFor="currentIngredientMeasurement" className="suggestion_form_label">
                        Measurements
                      </label>
                      <Autocomplete
                        id="currentIngredientMeasurement"
                        options={this.props.measurements.map((option) => option)}
                        value={this.state.currentIngredientMeasurement}
                        onChange={this.handleIngredientMeasurement}
                        freeSolo
                        renderInput={(params) => (<TextField {...params}
                          value={this.state.currentIngredientMeasurement} id="currentIngredientMeasurement"
                          variant="outlined" type="text"  />)}
                      />
                    </div>
                  </div>

                  <Button variant="contained" disableRipple onClick={this.addIngredientToMeal} className='ingredient_button' style={{ width: "max-content" }} > Add Ingredient</Button>
                </div>
                {/* // show all ingredients in two column table format */}
              {/* Show all Products in display format as expected in Meal Page*/}

                {/* <Row className="mb-2">
                  <Col md={12}>
                    <ChipInput
                      label="IngredientsList"
                      value={this.state.ingredientStrings}
                      onAdd={(chip) => this.handleAddIngredientChip(chip)}
                      placeholder="e.g 1 Onion, 2 Cups of Water, etc"
                      onDelete={(chip) => this.handleDeleteIngredientChip(chip)}
                      variant="outlined"
                      fullWidth
                      className="mb-2"
                    />
                  </Col>
                </Row> */}
                <Stack direction="row" spacing={1} className="stack">
                {
                  ingredientStrings.map((data, index) => (
                    <Chip
                      key={index}
                      label={data}
                      className='chip'
                      onClick={() => this.handleDeleteIngredientChip(data)}
                      onDelete={() => this.handleDeleteIngredientChip(data)}
                    />
                  ))
                }
                </Stack>
                
              </div>
              

              {/* <ProductsPageModal
                        value={this.state.ingredientGroupList}
                        productIndex = {this.getProductIndex()}
                        // {this.state.currentProductIndexDisplayed}
                        // toggleProductPage={this.
                        // openProductDetailsModal
                      // }
             /> */}
              {/* 
availableLocations,
    rawImages, productImages,
    calories
    total_carbs, net_carbs, fiber, fat, protein ,
    sodium, cholesterol, vitamind, calcium, iron, potassium */}

              <h3>Kitchen Utensils<em>(optional)</em></h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="kitchen_utenails" className="suggestion_form_label">
                    Utensils Name
                  </label>
                  <div className="input_button">
                    <Autocomplete
                      multiple
                      id="kitchen_utenails"
                      freeSolo
                      options={this.props.kitchenUtensils.map((option) => option)}
                      // onChange={(ev,val)=>this.handleUtensilsDropdownChange(ev,val)}
                      onChange={(e, val) => this.handleKitchenUtensilInputName(val)}
                      renderInput={(params) => (<TextField {...params}
                        variant="outlined" />)}
                      fullWidth
                      value={this.state.suggestedUtensils}
                    />
                    <Button variant="contained" disableRipple onClick={this.addKitchenUtensil} className='ingredient_button' style={{ width: "max-content" }} > Add Kitchen Utensils</Button>
                  </div>
                  {/* <ChipInput label=" className="mb-2" fullWidth id="utensils" onChange={(chip) => this.updateUtensils(chip)} variant="outlined" /> */}
                 </div>
                 <Stack direction="row" justifyContent="flex-start" spacing={1} className="stack">
                {
                  this.state.suggestedUtensils.map((data, index) => (
                    <Chip
                      key={index}
                      label={data}
                      className='chip'
                      onClick={() => this.handleDeleteCategoryChip(data)}
                      onDelete={() => this.handleDeleteCategoryChip(data)}
                    />
                  ))
                }
                </Stack>
              </div>

              {/* add kitchen slider template here? */}

              <h3>Add Recipe Steps</h3>
              <div className="suggestion_form">
                {/* <Row>
                    <Col md={12}>
                      <ChipInput label="Instructions"  className="mb-2" fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="outlined" />
                    </Col>               
                  </Row> */}

                  <p> Upload photos/videos for different parts of recipe steps</p>

                  {/* <Col md={12}  className="mb-2">
                      <input accept="image/*,video/mp4,video/x-m4v,video/*" id="imgSrc1" type="file" className="mb-2" onChange={(ev)=>this.onhandleInstructionImg(ev)} />
                    </Col>    */}

                  {/* <Col md={4}  style={{textAlign:"center", margin: "auto"}}> 
                      <Button variant="contained" color="primary"  disableRipple style={{color:"white", width:"300px"}}  onClick={this.addInstructionList}  > ADD NEW INSTRUCTION SET</Button>
                    </Col> */}
                
                <div className={stepInputs.length>0?"suggestion_recipe_steps more_steps":"suggestion_recipe_steps" }>
                  <div className="suggestion_recipe_step">
                    <div className="suggestion_form_group">
                      <label className="suggestion_form_label">
                        Step 1 Title
                      </label>
                      <TextField id="chunk1Title" 
                      onChange={(ev) => this.handleInstructionTitle(ev, 1)} variant="outlined" />
                    </div>
                    
                    <div className="suggestion_form_group">
                      <label className="suggestion_form_label">
                        Instruction
                      </label>
                      <TextField fullWidth id="instructionChunk1"
                      onKeyUp={(chip) => this.handleAddInstructionStep(chip, 1)} 
                      variant="outlined" required />
                      {/* <ChipInput label="Instructions" className="mb-2" fullWidth 
                      value={this.state.instructionChunk1.instructionSteps} 
                      onAdd={(chip) => this.handleAddInstructionStep(chip, 1)} 
                      onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 1)} variant="outlined" /> */}
                    </div>
                    <Stack direction="row" spacing={1} className="stack">
                    {
                      this.state.instructionChunk1.instructionSteps.map((chip, index) => (
                        <Chip
                          key={index}
                          label={chip}
                          className='chip'
                          onClick={() => this.handleDeleteInstructionsStep(chip, 1)}
                          onDelete={() => this.handleDeleteInstructionsStep(chip, 1)}
                        />
                      ))
                    }
                    </Stack>
                    <h3>Upload Media</h3>
                    {/* <div className="suggestion_form_group">
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
                    </div> */}
                    <div className="suggestion_form_image">
                        <div onClick={() => this.uploadMediaStep(1)} className="suggestion_form_image_col_1">
                          <div className="suggestion_form_image_icon_con">
                            <AddIcon className="suggestion_form_image_icon" />
                          </div>
                        </div>
                        <div className="suggestion_form_image_col_2">
                          <p>Upload picture/video with : Jpeg,png,mp4,mpeg format and not more than 2mb</p>
                        </div>
                    </div>

                    <p><img id="chunk1Image" className="suggestion_image" alt="recipe_step1_image_or_video" style={{ display: "none" }} />
                      <video className="suggestion_image" id="chunk1Video" style={{ display: "none" }} controls>
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    
                  </div>

                  {stepInputs.map(((id, index) => {
                    return(
                      <div key={index} className="suggestion_recipe_step">
                        <div className="suggestion_form_group">
                          <label className="suggestion_form_label">
                            Step {id} Title
                          </label>
                          <TextField id={"chunk"+id+"Title"} 
                          onChange={(ev) => this.handleInstructionTitle(ev, id)} variant="outlined" />
                        </div>
                        
                        <div className="suggestion_form_group">
                          <label className="suggestion_form_label">
                            Instruction
                          </label>
                          <TextField fullWidth id={"instructionChunk"+id}
                          onKeyUp={(chip) => this.handleAddInstructionStep(chip, id)} 
                          variant="outlined" required />
                          {/* <ChipInput label="Instructions" className="mb-2" fullWidth 
                          value={this.state.instructionChunk2.instructionSteps} 
                          onAdd={(chip) => this.handleAddInstructionStep(chip, id)} 
                          onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, id)} variant="outlined" /> */}
                        </div>
                        <Stack direction="row" spacing={1} className="stack">
                          {
                            this.state["instructionChunk"+ id].instructionSteps.map((chip, index) => (
                              <Chip
                                key={index}
                                label={chip}
                                className='chip'
                                onClick={() => this.handleDeleteInstructionsStep(chip, id)}
                                onDelete={() => this.handleDeleteInstructionsStep(chip, id)}
                              />
                            ))
                          }
                        </Stack>
                        <h3>Upload Media</h3>
                        {/* <div className="suggestion_form_group">
                        <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent2" name="instructionChunkContent2" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 2)} />
                        </div> */}
                        <div className="suggestion_form_image">
                            <div onClick={() => this.uploadMediaStep(id)} className="suggestion_form_image_col_1">
                              <div className="suggestion_form_image_icon_con">
                                <AddIcon className="suggestion_form_image_icon" />
                              </div>
                            </div>
                            <div className="suggestion_form_image_col_2">
                              <p>Upload picture/video with : Jpeg,png,mp4,mpeg format and not more than 2mb</p>
                            </div>
                        </div>

                        <p><img id={"chunk"+id+"Image"} className="suggestion_image" alt={"recipe_step"+id+"_image_or_video"} style={{ display: "none" }} />
                          <video className="suggestion_image" id={"chunk"+id+"Video"} style={{ display: "none" }} controls>
                            Your browser does not support the video tag.
                          </video>
                        </p>
                        
                      </div>
                    )
                  }))}
                  
                </div>
                <div className="input_button">
                    <div></div>
                    {stepInputs.length <5 &&
                    <Button variant="contained" disableRipple onClick={this.addMoreStep} className='ingredient_button' style={{ width: "209px" }} > ADD MORE</Button>
                    }
                  </div>

                {/* <Row>
                  <Col md={6}>
                    <TextField id="chunk1Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 1)} label="Section 1 Title" variant="outlined" />
                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent1" name="instructionChunkContent1" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 1)} />
                    <p><img id="chunk1Image" width="100%" alt="recipe_step1_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk1Video" style={{ display: "none" }} controls>
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk1.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 1)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 1)} variant="outlined" />
                  </Col>
                  <Col md={6}>
                    <TextField id="chunk2Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 2)} label="Section 2 Title" variant="outlined" />

                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent2" name="instructionChunkContent2" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 2)} />
                    <p><img id="chunk2Image" width="100%" alt="recipe_step2_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk2Video" style={{ display: "none" }} controls>
                        <source type="video/mp4" id="chunk2VideoSource" />
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk2.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 2)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 2)} variant="outlined" />

                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <TextField id="chunk3Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 3)} label="Section 3 Title" variant="outlined" />

                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent3" name="instructionChunkContent3" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 3)} />
                    <p><img id="chunk3Image" width="100%" alt="recipe_step3_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk3Video" style={{ display: "none" }} controls>
                        <source type="video/mp4" id="chunk3VideoSource" />
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk3.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 3)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 3)} variant="outlined" />

                  </Col>
                  <Col md={6}>
                    <TextField id="chunk4Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 4)} label="Section 4 Title" variant="outlined" />

                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent4" name="instructionChunkContent4" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 4)} />
                    <p><img id="chunk4Image" width="100%" alt="recipe_step4_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk4Video" style={{ display: "none" }} controls>
                        <source type="video/mp4" id="chunk4VideoSource" />
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk4.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 4)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 4)} variant="outlined" />
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <TextField id="chunk5Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 5)} label="Section 5 Title" variant="outlined" />

                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent5" name="instructionChunkContent5" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 5)} />
                    <p><img id="chunk5Image" width="100%" alt="recipe_step5_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk5Video" style={{ display: "none" }} controls>
                        <source type="video/mp4" id="chunk5VideoSource" />
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk5.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 5)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 5)} variant="outlined" />
                  </Col>
                  <Col md={6}>
                    <TextField id="chunk6Title" className="mb-2" onChange={(ev) => this.handleInstructionTitle(ev, 6)} label="Section 6 Title" variant="outlined" />

                    <br />
                    <input accept="image/*,video/mp4,video/x-m4v,video/*" id="instructionChunkContent6" name="instructionChunkContent6" type="file" className="mb-2" onChange={(ev) => this.onhandleInstructionImg(ev, 6)} />
                    <p><img id="chunk6Image" width="100%" alt="recipe_step6_image_or_video" style={{ display: "none" }} />
                      <video width="100%" id="chunk6Video" style={{ display: "none" }} controls>
                        <source type="video/mp4" id="chunk6VideoSource" />
                        Your browser does not support the video tag.
                      </video>
                    </p>
                    <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk6.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 6)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 6)} variant="outlined" />
                  </Col>
                </Row> */}
              </div>

              <h3>Add Meal Categories</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="tags-outlined" className="suggestion_form_label">
                    Suggest category for this meal
                  </label>
                  <div className="input_button">
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      freeSolo
                      // filterSelectedOptions
                      options={this.props.categories.map((option) => option)}
                      // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                      onChange={(e, newValue) => this.handleCategoryDropdownChange(newValue)}
                      // getOptionLabel={option => option}
                      // renderTags={() => {}}
                      value={this.state.suggestedCategories}
                      renderInput={params => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Suggest categories for this meal.."
                          fullWidth
                        />                    )}
                    />
                    <Button variant="contained" disableRipple onClick={this.addCategory} className='ingredient_button' style={{ width: "max-content" }} > Add Category</Button>
                  </div>

                </div>
                <Stack direction="row" spacing={1} className="stack">
                {
                  this.state.suggestedCategories.map((data, index) => (
                    <Chip
                      key={index}
                      label={data}
                      className='chip'
                      onClick={() => this.handleDeleteCategoryChip(data)}
                      onDelete={() => this.handleDeleteCategoryChip(data)}
                    />
                  ))
                }
                </Stack>
              </div>

              <h3>Tips <em>(optional)</em></h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="tips" className="suggestion_form_label">
                    Include any modifications to this meal you will like to add
                  </label>
                  <div className="input_button">
                    {/* <ChipInput label="tips" className="mb-2" fullWidth value={this.state.tips} onAdd={(chip) => this.updateTip(chip)} onDelete={(chip, index) => this.deleteTip(chip, index)} variant="outlined" /> */}
                    <TextField id="tips" value={this.state.tip} fullWidth onChange={this.handleTip} onKeyUp={this.handleTip} variant="outlined" required />
                    {/* <ChipInput id="tips"
                    fullWidth value={this.state.tips} 
                    onAdd={(chip) => this.updateTip(chip)} 
                    onDelete={(chip, index) => this.deleteTip(chip, index)} variant="outlined" /> */}
                    <Button variant="contained" disableRipple onClick={this.updateTip} className='ingredient_button' style={{ width: "max-content" }} > Add Tip</Button>
                  </div>
                </div>
                <Stack direction="row" spacing={1} className="stack">
                {
                  this.state.tips.map((data, index) => (
                    <Chip
                      key={index}
                      label={data}
                      className='chip'
                      onClick={() => this.deleteTip(data)}
                      onDelete={() => this.deleteTip(data)}
                    />
                  ))
                }
                </Stack>
              </div>
              <u style={{ color: "#F47900" }} onClick={this.openMealDetailsModal}> Show Preview</u>
              
              {/* <Row>
                <Col md={12}> */}
                  {/* <ThemeProvider theme={theme}> */}
                    <Button variant="contained" className='ingredient_button' style={{ width: "100%" }} onClick={() => this.sendSuggestedMealToDB()}> Add Meal</Button>
                  {/* </ThemeProvider> */}
                {/* </Col>
                
              </Row> */}
              <u >View privacy policy</u>
              <div id="ProductAdditionalDataDisplayed" >
                {/* <Popup2 popupType='Meal Suggestion Preview' openModal={this.state.openModal} closeModal={this.closeModal}
                 name={this.state.mealName} description={this.state.intro}
                 imageData={this.state.mealImageData} image={this.state.mealImage}
                 imagesData={this.state.mealImagesData} categories={this.state.suggestedCategories}
                 prepTime={this.state.prepTime} cookTime={this.state.cookTime}
                  serves={this.state.servings} chef={this.state.chef}
                  ingredientsList = {this.state.ingredientStrings} utensilsList={this.state.suggestedUtensils}
                  instructionChunk1={this.state.instructionChunk1} instructionChunk2={this.state.instructionChunk2}
                  instructionChunk3={this.state.instructionChunk3} instructionChunk4={this.state.instructionChunk4}
                  instructionChunk5={this.state.instructionChunk5} instructionChunk6={this.state.instructionChunk6}
                  chunk1Content={this.state.chunk1Content} chunk2Content={this.state.chunk2Content}
                  chunk3Content={this.state.chunk3Content} chunk4Content={this.state.chunk4Content}
                  chunk5Content={this.state.chunk5Content} chunk6Content={this.state.chunk6Content}
                  instructionWordlength={this.state.instructionWordlength}
                  tips={this.state.tips} mealImageData={this.state.mealImageData}
                /> */}
                <MealPageModal openModal={this.state.openModal} closeModal={this.closeModal}
                 mealName={this.state.mealName} mealImage={this.state.mealImage}
                 categories={this.state.suggestedCategories}
                  prepTime={this.state.prepTime} cookTime={this.state.cookTime}
                  serves={this.state.servings}
                  ingredientsList = {this.state.ingredientStrings} utensilsList={this.state.suggestedUtensils}
                  instructionChunk1={this.state.instructionChunk1} instructionChunk2={this.state.instructionChunk2}
                  instructionChunk3={this.state.instructionChunk3} instructionChunk4={this.state.instructionChunk4}
                  instructionChunk5={this.state.instructionChunk5} instructionChunk6={this.state.instructionChunk6}
                  chunk1Content={this.state.chunk1Content} chunk2Content={this.state.chunk2Content}
                  chunk3Content={this.state.chunk3Content} chunk4Content={this.state.chunk4Content}
                  chunk5Content={this.state.chunk5Content} chunk6Content={this.state.chunk6Content}
                  instructionWordlength={this.state.instructionWordlength}
                  tips={this.state.tips} mealImageData={this.state.mealImageData}
                 />
              </div>
              {/* <Popup1></Popup1> */}
            </form>
          </div>
    );
  }
}

export default SuggestMealForm;