import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import ChipInput from  "@mui/material/Chip"
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/lab/Autocomplete"; // createFilterOptions,
// import axios from 'axios';
import axios from '../util/Api';
import { Container, Row, Col } from "react-bootstrap";
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MealPageModal from "./mealsPage/MealPageModal";

// import ProductsPageModal from "./ProductsPageModal";
var FormData = require('form-data');

// var fs = require('fs');

class SuggestMeal extends Component {
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = {
      mealName: "",
      mealImage: "",
      mealImageName: "",
      mealImageFile: "",
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
      tips: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false
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

  ///////////////////////////////////////////////////////////////////////////////////////
  updateTip(chip) {
    this.setState({ tips: [...this.state.tips, chip] })
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  deleteTip(chip) {
    let tipsList = this.state.tips;

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

    let wordlength = this.state.instructionWordlength;

    this.setState({
      instructionWordlength: wordlength + chip.split(' ').length
    })

    switch (chunkIndex) {
      case 1:
        particularArray = this.state.instructionChunk1;
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

  ///////////////////////////////////////////////////////////////////////////////////////
  handleKitchenUtensilInputName = (val) => {
    this.setState({ suggestedUtensils: val });

    // causees error when testing in request payload
    // var tmpKitchenUtenails = [...this.state.suggestedUtensils]
    // this.setState({ suggestedUtensils: [tmpKitchenUtenails, val] });
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
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });

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

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    // const [ingredientInput, setIngredientInput] = useState('');    

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { ingredientGroupList } = this.state;

    return (
      <div>
        <br></br>
        <div style={{ width: "85%", margin: "auto", backgroundColor: "#f4f4f4" }}>
          <div style={{ padding: "20px", boxShadow: "1px 1px 4px 2px #00000030" }}>
            <div id="title" style={{ marginTop: "20px", marginBottom: "20px", }}>
              <b>Begin Suggesting Meal:</b>
            </div>
            <form noValidate autoComplete="off" encType="multipart/form-data" method="post" >
              <Row className="mb-3">
                <Col>
                  <Autocomplete
                    id="mealName"
                    options={this.props.allMealNames.map((option) => option)}
                    // onChange={(ev, val) => this.onInputChange(ev, val)}
                    onInputChange={(ev, val) => this.onInputChange(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} label="Meal Name" variant="filled" />)}
                    fullWidth
                    className="mb-3"
                    value={this.state.mealName}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
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
                  <Autocomplete
                    id="currentIngredient"
                    options={this.props.productNames.map((option) => option)}
                    // onChange={(ev)=>this.onTextFieldChange(ev)}
                    value={this.state.currentIngredient}
                    onChange={(ev, val) => this.handleProductNameInput(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} id="currentIngredient" label="ingredients"
                      value={this.state.currentIngredient} variant="filled" type="text"
                    />)}
                    fullWidth
                    className="mb-3"

                  />
                </Col>

              </Row>
              <Row className="mb-1">

                <Col md={5}>
                  <TextField fullWidth id="currentIngredientQuantity" type="number" onChange={this.onTextFieldChange}
                    label="Quantity" variant="filled" placeholder="1.." className="mb-3" value={this.state.currentIngredientQuantity} />
                </Col>

                <Col md={5}>
                  <Autocomplete
                    id="currentIngredientMeasurement"
                    options={this.props.measurements.map((option) => option)}
                    value={this.state.currentIngredientMeasurement}
                    onChange={this.handleIngredientMeasurement}
                    freeSolo
                    renderInput={(params) => (<TextField {...params}
                      value={this.state.currentIngredientMeasurement} id="currentIngredientMeasurement"
                      label="Measurements" variant="filled" type="text"  />)}
                    className="mb-3"
                  />
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
                    onDelete={(chip) => this.handleDeleteIngredientChip(chip)}
                    variant="filled"
                    fullWidth
                    className="mb-2"
                  />
                </Col>
              </Row>

              {/* // show all ingredients in two column table format */}
              {/* Show all Products in display format as expected in Meal Page*/}

              {/* <Container  >   */}
              <Container style={{ flex: "row-reverse" }} >


                {
                  // reverse to display list in inputted orer           
                  ingredientGroupList.map((data, index) => (
                    <Col md={5} key={index} name="suggestedProductsContainer" style={{ margin: "1px", backgroundColor: "white", boxShadow: "1px 1px 4px 2px #00000030" }}>

                      {data.properIngredientStringSyntax}

                      {/* <Col>
                            <Autocomplete
                              id="availableStores"
                              multiple
                              freeSolo
                              options={this.availableLocations.map((option) => option)}
                              onChange={({index}, chip) => this.handleAddStoreChip({index}, chip)}
                              // onInputChange={(ev, index) => this.handleAddStoreChip(ev, index)}         
                              renderInput={(params) => (<TextField {...params} label="Available Store Locations" variant="filled" />)}
                              fullWidth
                              className="mb-3"
                              value={this.state.new_product_ingredients[index].availableLocations}
                            />
                            <b> Nutrition Facts (optional)</b>
                            <br></br>
                            <input id='calories' placeholder="calories" label='Enter number of calories' type='number' />
                            <input id='total_carbs' placeholder="total_carbohydrate" label='Enter number of carbs in this product' type='number' />
                            <input id='net_carbs' placeholder="net_carbs" label='Enter net_carbs' type='number' />
                            <input id='sugar' placeholder="sugar" label='Enter grams of sugar' type='number' />
                            <input id='protein' placeholder="protein" label='Enter grams of protein' type='number' />
                            <input id='fat' placeholder="fat" label='Enter grams of fat' type='number' />
                            <input id='sodium' placeholder="sodium" label='Enter grams of sodium' type='number' /> <br></br>
                            // <button> Save </button> 
                          </Col> */}
                    </Col>
                  ))
                }

              </Container>

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

              <br /><hr /><br />
              <Row>
                <Col>
                  <Autocomplete
                    multiple
                    id="kitchen_utenails"
                    freeSolo
                    options={this.props.kitchenUtensils.map((option) => option)}
                    // onChange={(ev,val)=>this.handleUtensilsDropdownChange(ev,val)}
                    onChange={(e, val) => this.handleKitchenUtensilInputName(val)}
                    renderInput={(params) => (<TextField {...params}
                      label="Kitchen Utensils : Add any unique cooking utensils needed to make this meal (optional)"
                      variant="filled" />)}
                    fullWidth
                    className="mb-3"
                    value={this.state.suggestedUtensils}
                  />
                  {/* <ChipInput label=" className="mb-2" fullWidth id="utensils" onChange={(chip) => this.updateUtensils(chip)} variant="filled" /> */}
                </Col>
              </Row>

              {/* add kitchen slider template here? */}

              <b>Add Recipe Chunks <sup>i</sup>:</b>
              <hr />
              {/* <Row className="mb-3">
                  <Col md={12}>
                    <ChipInput label="Instructions"  className="mb-2" fullWidth  value={this.state.instructionsChip} onAdd={(chip) => this.handleAddInstructionStep(chip)} onDelete={(chip, index) =>this.handleDeleteInstructionsStep(chip, index)}   variant="filled" />
                  </Col>               
                </Row> */}

              <Row className="mb-3">
                <p> Upload photos/videos for different parts of recipe steps</p>

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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk1.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 1)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 1)} variant="filled" />
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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk2.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 2)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 2)} variant="filled" />

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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk3.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 3)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 3)} variant="filled" />

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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk4.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 4)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 4)} variant="filled" />
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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk5.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 5)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 5)} variant="filled" />
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
                  <ChipInput label="Instructions" className="mb-2" fullWidth value={this.state.instructionChunk6.instructionSteps} onAdd={(chip) => this.handleAddInstructionStep(chip, 6)} onDelete={(chip, index) => this.handleDeleteInstructionsStep(chip, 6)} variant="filled" />
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
                    options={this.props.categories.map((option) => option)}
                    // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                    onChange={(e, newValue) => this.handleCategoryDropdownChange(newValue)}
                    // getOptionLabel={option => option}
                    // renderTags={() => {}}
                    value={this.state.suggestedCategories}
                    renderInput={params => (
                      <TextField
                        {...params}
                        variant="filled"
                        label="Categories"
                        placeholder="Suggest categories for this meal.."
                        fullWidth
                      />                    )}
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
              <Row className="mb-5">
                <Col md={12}>
                  {/* <ThemeProvider theme={theme}> */}
                    <Button variant="contained" className="mb-2" color="primary" style={{ color: "white", width: "100%" }} onClick={() => this.sendSuggestedMealToDB()}> Add Meal</Button>
                  {/* </ThemeProvider> */}
                </Col>
                <u>View privacy policy <sup>i</sup></u>
              </Row>
            </form>
          </div>
        </div>
        <Dialog
          open={this.state.booleanOfDisplayOfDialogBoxConfirmation}
          onClose={this.handleCloseOfMealSubmissinoDialogMessage}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">Meal Submitted Successfully!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Thanks for your submission. Your recipe may be published to our meals page upon admin review. Explore our Preview and Print option to create a hard copy of this meal.</DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default SuggestMeal;