import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import ChipInput from  "@mui/material/Chip"
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/lab/Autocomplete"; // createFilterOptions,
// import axios from 'axios';
import axios from '../../util/Api';
import { Container, Row, Col } from "react-bootstrap";
import Button from '@mui/material/Button';
import { green } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import WestIcon from '@mui/icons-material/West';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MealPageModal from "../mealsPage/MealPageModal";
import "./suggestion.css";
import { Link } from "react-router-dom";

// import ProductsPageModal from "./ProductsPageModal";
var FormData = require('form-data');

// var fs = require('fs');

class SuggestProductForm extends Component {
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
      tip: '',
      tips: [],

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
  }

  closeModal() {
    this.setState({ openModal: false });
    // this.props.openModal = false;
    // this.props.func_removeMealFlag();
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    // const [ingredientInput, setIngredientInput] = useState('');    

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { ingredientGroupList, ingredientStrings, stepInputs } = this.state;

    return (
          <div className="suggestion_section_2" >
            <form className="suggestion_forms" noValidate autoComplete="off" encType="multipart/form-data" method="post" >
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
                  <TextField id="productName" fullWidth onChange={this.handleTip} variant="outlined" required />
                </div>

                <h3>Upload Product Images <em>(Up to 4)</em></h3>

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

                <h3>Product Description</h3>
                <div className="suggestion_form_group">
                  <label htmlFor="productDescription" className="suggestion_form_label">
                    Intro (150 words)
                  </label>
                  <TextField multiline id="productDescription" fullWidth onChange={this.onTextFieldChange} variant="outlined" />
                </div>
              </div>

              <h3>Product Sizes and Price</h3>
              <div className="suggestion_form">
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
                        Measurement
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

              <h3>Available Quantity</h3>
              <div className="suggestion_form">
                <div className="suggestion_form_group">
                  <label htmlFor="quantity" className="suggestion_form_label">
                    Number of this product available in your store
                  </label>
                  <div className="input_button">
                    {/* <Autocomplete
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
                    /> */}
                     <TextField fullWidth id="quantity" type="number" onChange={this.onTextFieldChange}
                        variant="outlined" placeholder="1.." value={this.state.currentIngredientQuantity} />
                    {/* <Button variant="contained" disableRipple onClick={this.addKitchenUtensil} className='ingredient_button' style={{ width: "max-content" }} > Add Kitchen Utensils</Button> */}
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
            </form>
          </div>
    );
  }
}

export default SuggestProductForm;