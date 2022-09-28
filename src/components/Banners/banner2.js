import React, { Component } from "react";
import background from "../../assets/images/homepage/grocery_bag.jpg";
import './banner2.css';
import { Link  } from "react-router-dom";

class Banner2 extends Component {

    constructor(props) {
        super(props);
        this.state = {
            product_fetched: false,
        };
    }

    render() {

        return (
            <div>
                <div style={{
                    backgroundImage: `url(${background})`,
                }}
                className="banner_container"
                >
                    {/* <!-- <h1>Book a Consultation</h1> --> */}
                    <div className="banner2container">
                        <p className="banner2_text">
                            ENJOY HASSLE FREE COOKING WITH CHOP CHOW
                        </p>
                            <Link to="/v2" className="banner2_button">Learn More</Link>
                    </div>

                </div>
            </div>
        )
    };

}

export default Banner2;