import React, { Component } from "react";
import MyModal from "./Mymodal";
import WithScrollbar from "./product_slider/WithScrollbar";
import "./MealsPage.scoped.scss";
import { Modal } from "react-bootstrap";

class MealsPage extends Component {
  // Mongo
  entries;

  constructor(props) {
    super(props);

    window.addEventListener("resize", this.update);
    this.state = {
      products: [],
      width: 0,
      firstPart_ind: 12,
      slider_flag: false,
      selectedCard_mealData: null,
      selected_index: 0,
      selectedCardID: "",

      mealSlider_Flag: false,
      currentMealCount: 12,

      mealList:null,
      col_count:1
    };
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {
    this.update();

    console.log("Comes in meal pages component did mount");
    // var url = "https://chopchowdev.herokuapp.com/api/get-meals";
    var url = "./api/get-meals"

    fetch(url)
      .then(res => res.text())
      .then(body => {
        // console.log("should print body");
        // console.log(body);
        var productsList = JSON.parse(body);
        // console.log(productsList);
        if(productsList && productsList.data.length !== 0){
          console.log("shows products does return");
          console.log(productsList.data.length);
          let products = [];
          for (var i = 0; i < productsList.data.length; i++) {
            products.push(productsList.data[i]);
          }
          this.setState({ products: products})
          // console.log(this.state.products);
          // this.entries = Object.entries(this.products);
          // console.log(entries);
          // this.setState({product_fetched:true});
        }
        else{
          console.log("shows products do not return");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  onClickMealCard = ( i, col_count )=>{
    if(i === this.state.selected_index) this.setState({slider_flag: !this.state.slider_flag})
    else this.setState({slider_flag: true})

    this.setState({ selected_index: i});
    this.setState({ selectedCard_mealData: this.state.products[i]});
    this.setState({ modalIsOpen: true });  
    this.setState({ firstPart_ind: (parseInt((i )/ col_count)+1)*col_count});   
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  setMealSliderModal=()=>{
    this.setState({mealSlider_Flag: true});
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  removeMealSliderModal=()=>{
    this.setState({mealSlider_Flag: false});
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  onhandleLoadMore = () => {
    let count = this.state.currentMealCount;
    if(count>= this.state.products.length)   this.setState({currentMealCount: this.state.products.length});
    else this.setState({currentMealCount: count + 10 });
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  update = () => {
    // this.setState({  width: window.innerWidth });

    let col_count = 1;
    if (window.innerWidth > 1200) col_count = 4;
    else if(window.innerWidth > 1000 && window.innerWidth < 1200) col_count = 3;
    else if(window.innerWidth > 800 && window.innerWidth < 1000) col_count = 2;

    if(this.state.products === null && window.innerWidth > 800 && window.innerHeight > 500) col_count = 4;
    else if(this.state.products.length < 4 && window.innerWidth > 800 && window.innerHeight > 500) col_count = 4; //Math.min(count, this.props.products.length);

    this.setState({col_count: col_count});
  };


  //////////////////////////////////////////////////////////////////////////////////////////////
  render() {
    const {selectedCard_mealData} = this.state;
    const items = [];
    let count = Math.min(this.state.products.length, this.state.currentMealCount);

    if(this.state.products.length>0){
      //--------------------- first part -----------------------------------------
      for (let i = 0; i< Math.min(count, this.state.firstPart_ind); i++) {
        const value = this.state.products[i];       

        items.push(
          <div key={i} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mealContainer" style={{justifyContent: "center"}}>
            <div className="meal-card" onClick={()=>this.onClickMealCard(i, this.state.col_count)}>
              <div style={containerStyle}>
                <div style={{ textAlign:"center" }}>
                  <img
                    src={value.mealImage}
                    className="images"
                    style={{ width: "200px", height: "200px" }}
                    alt="/"
                  ></img>
                </div>
                <div>
                  <span style={{ color: "orange" }} >{value.label}</span> <br></br>
                  <span style={{ color: "grey" }}>View Details | {value.cookTime}  mins to prepare</span>
                  <span style={{ color: "black" }}></span>
                </div>              
              </div>

            </div>
          </div>
        );
      }

      if(selectedCard_mealData && this.state.slider_flag){
        items.push(
          <div className="col-sm-12" style={{background:"#ffffff"}} key="1000001">
            <div style={{width: "95%", margin:"auto"}}>
              <div className ="detail-card-explain" id={selectedCard_mealData._id} >
                  <div style={{fontSize:"18px", paddingTop:"20px", paddingBottom:"20px"}}>{selectedCard_mealData.intro}</div>
                </div>

                <div id={selectedCard_mealData._id + "products"}>                  
                  <WithScrollbar products={selectedCard_mealData.product_slider} col_count={this.state.col_count}/>
                </div>

                <MyModal 
                  value={selectedCard_mealData}
                  mealPrep={selectedCard_mealData.instructions}
                  ingredientsList={selectedCard_mealData.newer_ingredient_format }
                  func_setMealFlag = {this.setMealSliderModal}
                  func_removeMealFlag = {this.removeMealSliderModal}
                />
              </div>
          </div>
        )
      }
     
      //--------------------- second part -----------------------------------------
      for (let i = Math.min(count, this.state.firstPart_ind); i< count; i++) {
        const value = this.state.products[i];       

        items.push(
          <div key={i} className="col-sm-12 col-md-6 col-lg-4 col-xl-3 mealContainer" style={{justifyContent: "center"}}>
            <div className="meal-card" onClick={()=>this.onClickMealCard(i, this.state.col_count)}>
              <div style={containerStyle}>
                <div style={{ textAlign:"center" }}>
                  <img
                    src={value.mealImage}
                    className="images"
                    style={{ width: "200px", height: "200px" }}
                    alt="/"
                  ></img>
                </div>
                <div>
                  <span style={{ color: "orange" }} >{value.label}</span> <br></br>
                  <span style={{ color: "grey" }}>View Details | {value.cookTime}  mins to prepare</span>
                  <span style={{ color: "black" }}></span>
                </div>              
              </div>

            </div>
          </div>
        );
      }
    }
    
    return (
      <div className="meals-Page">
        <div id="title" className="meal-title"> <b>Meals</b> </div>
        <div className="mealPage-container">
            {items}        
        </div>
        <section className="loadmore-section">
          <button className="btn-loadmore" onClick={()=>this.onhandleLoadMore()}>Load More</button>
        </section>
      </div>
    )
  };
}

export default MealsPage;

const containerStyle = {
  display: "inline-block",
  width: "100%",
  height: "100%"
};
