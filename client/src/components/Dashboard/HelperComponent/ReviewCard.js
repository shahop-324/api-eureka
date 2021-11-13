import React from 'react';
import Faker from 'faker';
import Box from "@material-ui/core/Box";
import Rating from "react-star-rating-lite";
import Avatar from '@material-ui/core/Avatar';
import './../../../assets/Sass/Reviews.scss';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const ReviewCard = () => {
    return (
        <div className="review-card-wrapper px-4 py-3 mb-3">
                <div className="user-name-event-and-star-rating-row d-flex flex-row justify-content-between mb-3">
                    <div className=" d-flex flex-row align-items-center">
                        <Avatar alt="Travis Howard" src={Faker.image.avatar()} />
                        <div className="ms-3 px-2 registration-name-styled">{Faker.name.findName()}</div>
                    </div>

                    <div className="d-flex flex-row align-items-center">
                        <button className="btn btn-outline-text btn-outline-primary d-flex flex-row align-items-center me-3">
                         <VisibilityOffRoundedIcon style={{fontSize: "20px"}} className="me-2" />   <span>Hide</span>
                        </button>
                    <Box component="fieldset" mb={1} borderColor="transparent">
                    <Rating value="4.2" color="#1499fa" weight="19" readonly />
                  </Box>
                    </div>
                </div>

                <div className="review-text-dashboard">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac neque ac eros luctus lacinia vel vitae lectus. Morbi porta est eros, eu venenatis nisi vestibulum vel. 
                </div>
        </div>
    );
}

export default ReviewCard;