import React, { Component } from "react";
// import axios from 'axios';
import axios from '../util/Api';
import WestIcon from '@mui/icons-material/West';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import "./suggestionPages/suggestion.css";
import { Link } from "react-router-dom";
import SuggestMealForm from "./suggestionPages/SuggestMeal";
import SuggestProductForm from "./suggestionPages/SuggestProduct";
import SuggestKitchenUtensilForm from "./suggestionPages/SuggestKitchenUtensil";
import SuggestCategoryForm from "./suggestionPages/SuggestCategory";

class SuggestMeal extends Component {
  ingredientsQuantityMeasurements = [];

  constructor(props) {
    super(props);
    this.state = {

      currentStore: "",

      // we need to update how we create image paths
      productImg_path: "",
      new_product_ingredients: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      suggestOption: false,
      suggestionType: 'Meal',
    };

    this.openMealDetailsModal = this.openMealDetailsModal.bind(this);

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

  suggestOption = () => {
    this.setState({
      suggestOption: !this.state.suggestOption
    })
  }

  handleSuggestionType = (type) => {
    this.setState({
      suggestionType: type
    })
    this.suggestOption()
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    // const [ingredientInput, setIngredientInput] = useState('');    

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { suggestOption, suggestionType } = this.state;

    return (
      <div className="suggestion_container">
        <div className="suggestion_sections">
          <div className="suggestion_section_1">
            <div className="suggestion_section_1_col_1">
                <ul className="suggestion_header_pages">
                  <WestIcon className="suggestion_header_page_arrow" />
                  <li>
                    <Link href="/">back</Link>
                  </li>
                </ul>
            </div>
            <div className="suggestion_section_1_col_2">
                <p className="suggestion_section_1_col_2_p"> Choose type</p>
                <div className="select_container">
                  <div onClick={this.suggestOption} className="select_box">
                    <p>{suggestionType}</p>
                    <ArrowDropDownIcon className="select_box_icon" />
                  </div>
                  {suggestOption &&
                  <div className="select_options">
                    <p onClick={() => this.handleSuggestionType('Meal') }>Meals</p>
                    <p onClick={() => this.handleSuggestionType('Product') }>Products</p>
                    <p onClick={() => this.handleSuggestionType('Kitchen Utensil') }>Kitchen Utensils</p>
                    <p onClick={() => this.handleSuggestionType('Category') }>Category</p>
                  </div>}
                </div>
            </div>
          </div>
            {suggestionType === 'Meal' &&
              <SuggestMealForm 
              allMealNames={this.props.allMealNames}
              productNames={this.props.productNames}
              measurements={this.props.measurements}
              kitchenUtensils={this.props.kitchenUtensils}
              categories={this.props.categories}
              ></SuggestMealForm>
            }
            {suggestionType === 'Product' &&
              <SuggestProductForm 
              allMealNames={this.props.allMealNames}
              productNames={this.props.productNames}
              measurements={this.props.measurements}
              kitchenUtensils={this.props.kitchenUtensils}
              categories={this.props.categories}
              ></SuggestProductForm>
            }
            {suggestionType === 'Kitchen Utensil' &&
              <SuggestKitchenUtensilForm 
              measurements={this.props.measurements}
              kitchenUtensils={this.props.kitchenUtensils}
              categories={this.props.categories}
              ></SuggestKitchenUtensilForm>
            }
            {suggestionType === 'Category' &&
              <SuggestCategoryForm 
              categories={this.props.categories}
              ></SuggestCategoryForm>
            }
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