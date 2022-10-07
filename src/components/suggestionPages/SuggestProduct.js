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
import Popup1 from "../popups/popup1";

class SuggestProductForm extends Component {
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = {
      productName: "",
      productImage: "",
      productImageName: "",
      productImageData: "",
      productImagesData: [],
      productDescription: "",

      ingredientNames: [],
      // do we need product group list AND strings ?
      ingredientGroupList: [],
      sizeGroupList: [],
      // store product names of inputted strings to compare with db products
      ingredientStrings: [],
      sizeStrings: [],
      // do we want to use current ingredient formats ? Yes.
      currentIngredient: "",
      currentIngredientMeasurement: "",
      sizeQuantity: "",
      sizeMeasurement: "",
      currentIngredientQuantity: "",
      currentProductImgSrc: null,
      currentProductDisplayIndex: 0,

      currentStore: "",
      quantity: "",

      // we need to update how we create image paths
      productImg_path: "",
      new_product_ingredients: [],
      new_product_size: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,
      suggestedUtensils: [],
      suggestedCategories: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      stepInputs: []
    };

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

    let doc = document.querySelector('#formproduct')
    if(doc){
      setInterval(() => {
        localStorage.setItem('suggestProductForm', JSON.stringify(this.state))
        
      }, 100)
    }

    if(localStorage.getItem('suggestProductForm')){
      let {
        productName,
        productDescription,

        ingredientNames,
        // do we need product group list AND strings ?
        ingredientGroupList,
        sizeGroupList,
        // store product names of inputted strings to compare with db products
        ingredientStrings,
        sizeStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        currentIngredientMeasurement,
        sizeQuantity,
        sizeMeasurement,
        currentIngredientQuantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,
        quantity,

        // we need to update how we create image paths
        productImg_path,
        new_product_ingredients,
        new_product_size,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,
        suggestedUtensils,
        suggestedCategories,

        booleanOfDisplayOfDialogBoxConfirmation,

        //mealsModal controller
        openModal,
        stepInputs
      } = JSON.parse(localStorage.getItem('suggestProductForm'))


      this.setState({
        productName,
        productImage: '',
        productImageName: '',
        productImageData: '',
        productImagesData: [],
        productDescription,

        ingredientNames,
        // do we need product group list AND strings ?
        ingredientGroupList,
        sizeGroupList,
        // store product names of inputted strings to compare with db products
        ingredientStrings,
        sizeStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        currentIngredientMeasurement,
        sizeQuantity,
        sizeMeasurement,
        currentIngredientQuantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,
        quantity,

        // we need to update how we create image paths
        productImg_path,
        new_product_ingredients,
        new_product_size,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,
        suggestedUtensils,
        suggestedCategories,

        booleanOfDisplayOfDialogBoxConfirmation,

        //mealsModal controller
        openModal,
        stepInputs,
      })
    }
  }

  onInputChange = (e) => {
    console.log("Comes in on text field change; ");
    console.log(e.target.value)
    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ "productName": e.target.value });
  };

  uploadProductImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="utensilImage" name="utensilImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateutensilImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "productImage";
    input.name = "productImage";
    input.type = "file";
    input.onchange = (ev) => this.onUpdateProductImage(ev);
    input.hidden = true;
    input.click()
  }

  onUpdateProductImage = (event) => {
    if (event.target.files[0] === undefined) return;

    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;

    if (allowedImageExtensions.exec(event.target.files[0].name)) {

      if(this.state.productImage === ""){
        this.setState({ productImage: event.target.files[0], 
          productImageName: event.target.files[0].name,
        productImageData:  URL.createObjectURL(event.target.files[0]) });
        //display products main image or videoin suggest product
        var image = document.getElementById("ProductsMainImages");
        image.style.display = "block";
        image.src = URL.createObjectURL(event.target.files[0]);

        console.log(event.target.files[0]);
        console.log(event.target.files[0].name);


        console.log(allowedImageExtensions.exec(event.target.files[0].name));

        // console.log(URL.createObjectURL(event.target.files[0]));
      }else{
        this.setState({ 
        productImagesData: [...this.state.productImagesData,  URL.createObjectURL(event.target.files[0])] });
        // var image = document.getElementById("productsMainImages"+(this.state.utensilImagesData.length+1));
        // image.style.display = "block";
        // image.src = URL.createObjectURL(event.target.files[0]);
  
        console.log(event.target.files[0]);
        console.log(event.target.files[0].name);
  
  
        console.log(allowedImageExtensions.exec(event.target.files[0].name));
  
      }
      
    }
    else {
      alert("Invalid image type");
    }

  };

  onTextFieldChange = (e) => {
    console.log("Comes in on text field change; ");

    console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };

  handleCategoryDropdownChange = (val) => {
    console.log(this.state.suggestedCategories)
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });

  }

  categoryBlur = (e) =>{
    this.setState({
      categoryVal: e.target.value
    })
  }

  addCategory = () => {
    let cat = this.state.categoryVal;
    let suggestedCategories = this.state.suggestedCategories;
    suggestedCategories.push(cat);
    this.setState({
      suggestedCategories
    })
  }

  handleDeleteCategoryChip(chip) {
    var array = [...this.state.suggestedCategories]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ suggestedCategories: array });
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

  handleIngredientMeasurement = (event, val) => {
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

  handleSizeMeasurement = (event, val) => {
    // if (event.target.value) {
    //   this.setState({ sizeMeasurement: event.target.value });
    // } else {
    //   this.setState({ sizeMeasurement: "" });
    // }

    console.log("In handleSizeMeasurement . \n val is: " + val);

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
        this.setState({ sizeMeasurement: event.target.innerHTML });

      } else {
        this.setState({ sizeMeasurement: val });
      }
    }
    else {
      console.log('val is null!');
    }
  }

  addSize = (event) => {
    console.log("COMES IN addIngredientToMeal");
    event.preventDefault();
    var properSizeStringSyntax;
    // var ingredientValue = document.getElementById("currentIngredient").value;
    var sizeQuantityValue = document.getElementById("sizeQuantity").value;
    // best to get the measurement from the state
    // perhaps becuse inner html is defined before state is updated
    // var measurementValue = this.state.currentIngredientMeasurement;
    var sizeMeasurementValue = document.getElementById("sizeMeasurement").value;


    if (sizeMeasurementValue === "") { window.alert("Enter measurement"); return; }
    // update ingredient string syntax for no quantity or no measurement.
    if (sizeQuantityValue === "") {
      properSizeStringSyntax = '';
    } else if (sizeMeasurementValue === "" && sizeQuantityValue !== "") {
      // MAKE sure we are using the right and tested variables to display the right type of string at all times.
      properSizeStringSyntax = "" + sizeQuantityValue;
    } else {
      properSizeStringSyntax =
        "" + sizeQuantityValue + " " + sizeMeasurementValue;
    }
    console.log(properSizeStringSyntax);

    // This is the Object for an Ingredient of a Known Product
    var sizeObject = {

      // display: this.state.currProductIndexInDBsProductsList,
      // availableLocations: [],
      size: sizeMeasurementValue,
      properSizeStringSyntax: properSizeStringSyntax
    };

    console.log("current state of product index at Add Ingredient To Meal is : \n" + this.state.currProductIndexInDBsProductsList);

    console.log("ADDs to new_product_ingredients");

    console.log("creating new product object");

    // edit product details for new product object
    // sizeObject.productImgFile = null;
    sizeObject.productIndex = 0;
    // sizeObject.calories = 0;

    // append String to new Products array if not
    // var tmpNewProducts = [...this.state.new_product_ingredients];
    // var tmpNewProducts = this.state.new_product_ingredients;
    // var updatedProductList = [tmpNewProducts, sizeObject];

    // this.setState({ new_product_ingredients: updatedProductList })
    this.setState({ new_product_size: [sizeObject] });

    this.setState({ sizeGroupList: [sizeObject] });
    // after adding product to ingredient group list
    // reset current product img src and path to null, and same for current ingredient inputs
    // this.setState({ currentProductImgSrc: null, productImg_path: "" });
    this.setState({ sizeQuantity: '', sizeMeasurement: "null" });
    this.setState({ sizeMeasurement: "" });
    this.handleAddSizeChip(properSizeStringSyntax);

    //  Resetting inner html directly to clear ingredient inputs without changing state
    // document.getElementById("currentIngredient").value = 'NewPs';
    // document.getElementById("currentIngredientQuantity").value = 8;
    // document.getElementById("currentIngredientMeasurement").value = 'Removed';

  }

  handleAddSizeChip(chip) {
    this.setState({
      sizeStrings: [chip],
    });
  }

  handleDeleteSizeChip(chip) {
    var array = this.state.sizeStrings; // make a separate copy of the array
    var removeFromGroup = this.state.sizeGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      removeFromGroup.splice(index, 1);

      this.setState({ sizeStrings: array, sizeGroupList: removeFromGroup });
    }
  }

  handleAddIngredientChip(chip) {
    this.setState({
      ingredientStrings: [...this.state.ingredientStrings, chip],
    });
  }

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

  addIngredientToMeal = (event) => {
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

  closeModal() {
    this.setState({ openModal: false });
    // this.props.openModal = false;
    // this.props.func_removeMealFlag();
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

    // if (individualProductDisplay.style.display === "block") {
    //   individualProductDisplay.style.display = "none";
    // }
    // else {
    //   individualProductDisplay.style.display = "block";
    // }
    this.setState({openModal: true});
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    const { ingredientStrings, sizeStrings } = this.state;

    return (
          <div className="suggestion_section_2" >
            <form id="formproduct" className="suggestion_forms" noValidate autoComplete="off" encType="multipart/form-data" method="post" >
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="productName" className="suggestion_form_label">
                    Product Name
                  </label>
                  {/* <Autocomplete
                    id="productName"
                    options={this.props.allproductNames.map((option) => option)}
                    // onChange={(ev, val) => this.onInputChange(ev, val)}
                    onInputChange={(ev, val) => this.onInputChange(ev, val)}
                    freeSolo
                    renderInput={(params) => (<TextField {...params} variant="outlined" />)}
                    fullWidth
                    value={this.state.productName}
                  /> */}
                  <TextField value={this.state.productName} id="productName" fullWidth onChange={this.onInputChange} variant="outlined" required />
                </div>

                <h3>Upload Product Images <em>(Up to 4)</em></h3>
                {this.state.productImagesData.length < 3 &&
                <div className="suggestion_form_image">
                    <div className="suggestion_form_image_col_1">
                      <div onClick={() => this.uploadProductImage()} className="suggestion_form_image_icon_con">
                        <AddIcon className="suggestion_form_image_icon" />
                      </div>
                    </div>
                    <div className="suggestion_form_image_col_2">
                      <p>Upload picture with : Jpeg or Png format and not more than 500kb</p>
                    </div>
                </div>}

                <Row>
                  <Col md={12} style={{ marginTop: "20px" }}>
                    <p><img id="ProductsMainImages" width="100%" alt="main_product_Image" style={{ display: "none" }} />
                    </p>
                  </Col>
                </Row>

                {
                  this.state.productImagesData.map((data, index) => 
                  <Row key={index}>
                    <Col md={12} style={{ marginTop: "20px" }}>
                      <p><img src={data} width="100%" alt="main_product_Image" />
                      </p>
                    </Col>
                  </Row>
                  )
                }

                <h3>Product Description</h3>
                <div className="suggestion_form_group">
                  <label htmlFor="productDescription" className="suggestion_form_label">
                    Intro (150 words)
                  </label>
                  <TextField value={this.state.productDescription} multiline id="productDescription" fullWidth onChange={this.onTextFieldChange} variant="outlined" />
                </div>
              </div>

              <h3>Product Size</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_2_col">

                  <div className="suggestion_form_2_col_2">
                    <div className="suggestion_form_group">
                      <label htmlFor="sizeQuantity" className="suggestion_form_label">
                        Quantity
                      </label>
                      <TextField fullWidth id="sizeQuantity" type="number" onChange={this.onTextFieldChange}
                        variant="outlined" placeholder="1.." value={this.state.sizeQuantity} />
                    </div>
                  </div>

                  <div className="suggestion_form_2_col_1">
                    <div className="suggestion_form_group">
                      <label htmlFor="sizeMeasurement" className="suggestion_form_label">
                        Measurement
                      </label>
                      <Autocomplete
                        id="sizeMeasurement"
                        options={this.props.measurements.map((option) => option)}
                        value={this.state.sizeMeasurement}
                        onChange={this.handleSizeMeasurement}
                        freeSolo
                        renderInput={(params) => (<TextField {...params}
                          value={this.state.sizeMeasurement} id="sizeMeasurement"
                          variant="outlined" type="text"  />)}
                      />
                    </div>
                    
                  </div>

                  <Button variant="contained" disableRipple onClick={this.addSize} className='ingredient_button' style={{ width: "max-content" }} > Add Size</Button>
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
                  sizeStrings.map((data, index) => (
                    <Chip
                      key={index}
                      label={data}
                      className='chip'
                      onClick={() => this.handleDeleteSizeChip(data)}
                      onDelete={() => this.handleDeleteSizeChip(data)}
                    />
                  ))
                }
                </Stack>
                
              </div>
              
              <h3>Product Categories</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="tags-outlined" className="suggestion_form_label">
                    Suggest category for this product
                  </label>
                  <div className="input_button">
                    <Autocomplete
                      multiple
                      id="tags-outlined"
                      freeSolo
                      clearOnBlur
                      onBlur={this.categoryBlur}
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
                          placeholder="Suggest categories for this product.."
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

              <h3>Add Product Ingredients</h3>
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


              <u style={{ color: "#F47900" }} onClick={this.openMealDetailsModal}> Show Preview</u>
              
              {/* <Row>
                <Col md={12}> */}
                  {/* <ThemeProvider theme={theme}> */}
                    <Button variant="contained" className='ingredient_button' style={{ width: "100%" }} onClick={() => this.sendSuggestedMealToDB()}> Add Product</Button>
                  {/* </ThemeProvider> */}
                {/* </Col>
                
              </Row> */}
              <u >View privacy policy</u>
              <div id="ProductAdditionalDataDisplayed" >
                <Popup1 openModal={this.state.openModal} closeModal={this.closeModal}
                 name={this.state.productName} description={this.state.productDescription}
                 imageData={this.state.productImageData} image={this.state.productImage}
                 imagesData={this.state.productImagesData} categories={this.state.suggestedCategories}
                 quantity={this.state.quantity}
                 sizesList = {this.state.sizeStrings}
                />
                {/* <MealPageModal openModal={this.state.openModal} closeModal={this.closeModal}
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
                 /> */}
              </div>
            </form>
          </div>
    );
  }
}

export default SuggestProductForm;