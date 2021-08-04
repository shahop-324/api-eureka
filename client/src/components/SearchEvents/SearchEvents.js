import React, {  useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Pagination from "@material-ui/lab/Pagination";
import EventCard from "../EventCard";
import { useState } from "react";
import PaidPriceSelector from "../PaidPriceSelector";
import history from "../../history";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { fetchEvents } from "../../actions/index";
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import "bootstrap/dist/css/bootstrap.css";
// you will also need the css that comes with bootstrap-daterangepicker
import "bootstrap-daterangepicker/daterangepicker.css";
import dateFormat from "dateformat";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import Footer from "../Footer";
const categories = [
  { title: "Technology" },
  { title: "Education" },
  { title: "Career Fair" },
  { title: "Professional Development" },
  { title: "Health & Lifestyle" },
  { title: "Marketing & Advertisement" },
  { title: "Crypto" },
  { title: "Web Security" },
  { title: "Entertainment" },
  { title: "Business & Entrepreneurship" },
];

class PreFooter extends React.Component {
  render() {
    return (
      <div className="row pre-footer">
        <div className="col-12 col-lg-6 d-flex flex-row justify-content-center align-items-center pre-footer-left-wrapper">
          <div className="col-1 col-xl-2"></div>
          <div className="col-10 col-xl-8">
            <div className="pre-footer-hero-text">
              Amaze Your Audience with Your Next-Gen Virtual Event.
            </div>
            <div className="pre-footer-sub-hero-text">
              Memorable events don’t just happen. They happen to be our
              business.
            </div>
            <div className="pre-footer-hero-btn d-flex flex-row justify-content-start">
              <button type="button" class="btn btn-light pre-footer-btn-light">
                Host a free event
              </button>
            </div>
          </div>
          <div className="col-1 col-xl-2"></div>
        </div>
        <div
          className="col-12 col-lg-6 d-flex justify-content-center pre-footer-img-wrapper"
          style={{ maxHeight: "50vh" }}
        ></div>
      </div>
    );
  }
}

const SearchEvents = () => {
  const dispatch = useDispatch();

  const location = useLocation();
  console.log(location);
  // useEffect(()=>{
  //   dispatch(fetchEvents(location.search));

  // },[])
  useEffect(() => {
    dispatch(fetchEvents(location.search));
  }, [location.search, dispatch]);

  const [text, setText] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  let fullLocation = `http://127.0.0.1:3001${location.pathname}${location.search}`;
  let url = new URL(fullLocation);
  let search_params = url.searchParams;

  const onChangeSearchEvents = (e) => {
    setText(e.target.value);
  };

  const eventsList = useSelector((state) => state.event.events);
  console.log(eventsList);

  const onPriceFilterChange = (e) => {
    const price = e.target.value;
    setPriceFilter(e.target.value);
    if (price === "Free") {
      search_params.set("max_price", 0);
      search_params.delete("min_price");
      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      let regex = /(?<=search-events\/).+/;
      const result = new_url.match(regex);

      // props.fetchEvents(event.target.value);
      if (result === null) {
        history.push("/search-events/");
      } else {
        history.push(result[0]);
      }
    } else if (price === "Any Price") {
      search_params.delete("max_price");
      search_params.delete("min_price");
      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      let regex = /(?<=search-events\/).+/;
      const result = new_url.match(regex);

      // props.fetchEvents(event.target.value);
      if (result === null) {
        history.push("/search-events/");
      } else {
        history.push(result[0]);
      }
    }
  };

  const onRatingFilterChange = (e) => {
    const rating = e.target.value;

    if (rating === "Above 4") {
      search_params.set("communityRating[gt]", 4);

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      let regex = /(?<=search-events\/).+/;
      const result = new_url.match(regex);

      // props.fetchEvents(event.target.value);
      if (result === null) {
        history.push("/search-events/");
      } else {
        history.push(result[0]);
      }
    } else if (rating === "Above 3") {
      search_params.set("communityRating[gt]", 3);

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      let regex = /(?<=search-events\/).+/;
      const result = new_url.match(regex);

      // props.fetchEvents(event.target.value);
      if (result === null) {
        history.push("/search-events/");
      } else {
        history.push(result[0]);
      }
    } else if (rating === "Any Rating") {
      search_params.delete("communityRating[gt]");

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      let regex = /(?<=search-events\/).+/;
      const result = new_url.match(regex);

      // props.fetchEvents(event.target.value);
      if (result === null) {
        history.push("/search-events/");
      } else {
        history.push(result[0]);
      }
    }
  };
  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY/MM/DD") +
        " - " +
        picker.endDate.format("YYYY/MM/DD")
    );
    const dateRange = event.target.value;

    const dateArray = dateRange.split("-");
    search_params.set("startDate", dateArray[0]);
    search_params.set("endDate", dateArray[1]);
    url.search = search_params.toString();
    let new_url = url.toString();
    // setFullLocation(new_url);
    let regex = /(?<=search-events\/).+/;
    const result = new_url.match(regex);

    if (result === null) {
      history.push("/search-events/");
    } else {
      history.push(result[0]);
    }
  };

  const renderedList = () => {
    return eventsList.map((event) => {
      const now = new Date(event.startDate);
      const formatedDate = dateFormat(now, "mmmm dS, h:MM TT");
      // console.log(x);

      return (
        <EventCard
        image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
          date={formatedDate}
          id={event.id}
          eventName={event.eventName}
          minPrice={event.minTicketPrice}
          maxPrice={event.maxTicketPrice}
          key={event.id}
        />
      );
    });
  };

  const handleCancel = (event, picker) => {
    picker.element.val("");
    search_params.delete("startDate");
    search_params.delete("endDate");
    url.search = search_params.toString();
    let new_url = url.toString();
    // setFullLocation(new_url);
    let regex = /(?<=search-events\/).+/;
    const result = new_url.match(regex);

    // props.fetchEvents(event.target.value);
    if (result === null) {
      history.push("/search-events/");
    } else {
      history.push(result[0]);
    }
  };

  const onCategoryBucketChange = (event, value) => {
    // let queryString = "";
    // for (let i = 0; i < value.length; i++) {
    //   queryString = value[i].join(",");
    // }

    const queryString = value
      .map(function (elem) {
        return elem.title;
      })
      .join(",");

    if (queryString === "") {
      search_params.delete("category");
    } else {
      search_params.set("category", queryString);
    }
    url.search = search_params.toString();
    let new_url = url.toString();
    // setFullLocation(new_url);
    let regex = /(?<=search-events\/).+/;
    const result = new_url.match(regex);

    if (result === null) {
      history.push("/search-events/");
    } else {
      history.push(result[0]);
    }
  };

  const onSubmitTextSearch = (e) => {
    e.preventDefault();
    if (text === "") {
      search_params.delete("text");
    } else {
      search_params.set("text", text);
    }
    url.search = search_params.toString();
    let new_url = url.toString();
    // setFullLocation(new_url);
    let regex = /(?<=search-events\/).+/;
    const result = new_url.match(regex);

    // props.fetchEvents(event.target.value);
    if (result === null) {
      history.push("/search-events/");
    } else {
      history.push(result[0]);
    }
  };

  return (
    <>
      <CssBaseline />
      <div className="">
        <div className="row nav-section">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
              
                <span style={{ color: "#538BF7" }}>Evenz</span>
             
              <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form
                  onSubmit={onSubmitTextSearch}
                  class="d-flex special"
                  style={{ marginLeft: "2%", alignSelf: "center" }}
                >
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search events"
                    aria-label="Search"
                    value={text}
                    onChange={onChangeSearchEvents}
                  />
                  <button class="btn btn-outline-primary" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </form>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  <li class="nav-item" style={{ alignSelf: "center" }}>
                    
                      <Link
                        to="/signin"
                        type="button"
                        class="btn btn-outline-primary"
                      >
                        Login
                      </Link>
                    
                  </li>
                  <li class="nav-item" style={{ alignSelf: "center" }}>
                    
                      <Link to="/signup" type="button" class="btn btn-primary">
                        Get Started
                      </Link>
                   
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="row no-of-events-section">
          <div className="text-center search-page-events-text">Events</div>
          <div className="text-center search-page-results-text">
            503 Events . 8 Categories
          </div>
        </div>
        <div
          className="row filter-and-results-section max-width"
          style={{ margin: "0 auto" }}
        >
          <div className="col-12 col-lg-3 filter-section">
            <div
              className="filter-toggle-button col"
              style={{ display: "none" }}
            >
              <div className="row" style={{ width: "99.5%", margin: "0 auto" }}>
                <button
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                  class="btn btn-outline-secondary"
                >
                  Filter
                </button>
              </div>
            </div>
            <div className="col filter-wrapper" id="collapseExample">
              <div
                className="row date-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div className="filter-name">Date</div>

                <DateRangePicker
                  initialSettings={{
                    autoUpdateInput: false,
                    locale: {
                      cancelLabel: "Clear",
                    },
                  }}
                  onApply={handleApply}
                  onCancel={handleCancel}
                >
                  <input type="text" className="form-control col-4" Value="" />
                </DateRangePicker>

                {/* </div> */}
                <div style={{ margin: "5% 0" }}>
                  <Divider />
                </div>
              </div>

              <div
                className="row price-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div className="filter-name">Price (in USD)</div>
                <div className="price-filter-input">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="price"
                      id="filterAnyPrice"
                      value="Any Price"
                      onChange={onPriceFilterChange}
                    />
                    <label class="form-check-label" for="filterAnyPrice">
                      Any Price
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="price"
                      id="filterfree"
                      value="Free"
                      onChange={onPriceFilterChange}
                    />
                    <label class="form-check-label" for="filterfree">
                      Free
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="price"
                      id="filterpaid"
                      value="Paid"
                      onChange={onPriceFilterChange}
                    />
                    <label class="form-check-label mb-3">Paid</label>
                  </div>
                  {priceFilter === "Paid" ? (
                    <PaidPriceSelector URL={url} searchParams={search_params} />
                  ) : (
                    <div></div>
                  )}
                </div>
                <div style={{ margin: "5% 0" }}>
                  <Divider />
                </div>
              </div>

              <div
                className="row community-rating-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div className="filter-name">Community Rating</div>
                <div className="price-filter-input">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault4"
                      value="Any Rating"
                      onChange={onRatingFilterChange}
                    />
                    <label class="form-check-label" for="flexRadioDefault4">
                      Any Rating
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault5"
                      value="Above 4"
                      onChange={onRatingFilterChange}
                    />
                    <label class="form-check-label" for="flexRadioDefault5">
                      Above 4
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault6"
                      value="Above 3"
                      onChange={onRatingFilterChange}
                    />
                    <label class="form-check-label" for="flexRadioDefault6">
                      Above 3
                    </label>
                  </div>
                </div>
                <div style={{ margin: "5% 0" }}>
                  <Divider />
                </div>
              </div>

              <div
                className="row categories-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div className="filter-name">Categories</div>
                <div className="categories-filter-input">
                  <Autocomplete
                    onChange={onCategoryBucketChange}
                    multiple
                    id="tags-standard"
                    options={categories}
                    getOptionLabel={(option) => option.title}
                    renderInput={(params) => (
                      <TextField {...params} variant="standard" />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-9 search-results-section px-5">
            <div className="row search-result-heading ">Top Picks</div>
            <div
              className="row search-result-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridColumnGap: "40px",
                gridRowGap: "30px",
              }}
            >
              {renderedList()}
            </div>
          </div>
        </div>
        <div className="row show-more-search-page">
          <div className="col-0 col-lg-4"></div>
          <div className="col-12 col-lg-6 d-flex flex-row justify-content-center">
            <Pagination count={100} color="primary" />
          </div>
          <div className="col-0 col-lg-2"></div>
        </div>
        <PreFooter />
        <Footer />
      </div>
    </>
  );
};

export default SearchEvents;

// import React from "react";
// import CssBaseline from "@material-ui/core/CssBaseline";
// import Divider from "@material-ui/core/Divider";
// import Autocomplete from "@material-ui/lab/Autocomplete";
// import TextField from "@material-ui/core/TextField";
// // import Chip from '@material-ui/core/Chip';
// // import PreFooterImg from "./../../assets/images/PreFooter@2x.png";
// import Faker from "faker";
// import EventCard from "../EventCard";
// // import DateRangePickerComponent from "../DateRangePicker";

// const categories = [
//   { title: "Technology" },
//   { title: "Education" },
//   { title: "Career Fair" },
//   { title: "Professional Development" },
//   { title: "Health & Lifestyle" },
//   { title: "Marketing & Advertisement" },
//   { title: "Crypto" },
//   { title: "Web Security" },
//   { title: "Entertainment" },
//   { title: "Business & Entrepreneurship" },
// ];

// class PreFooter extends React.Component {
//   render() {
//     return (
//       <div className="row pre-footer">
//         <div className="col-12 col-lg-6 d-flex flex-row justify-content-center align-items-center pre-footer-left-wrapper">
//           <div className="col-1 col-xl-2"></div>
//           <div className="col-10 col-xl-8">
//             <div className="pre-footer-hero-text">
//               Amaze Your Audience with Your Next-Gen Virtual Event.
//             </div>
//             <div className="pre-footer-sub-hero-text">
//               Memorable events don’t just happen. They happen to be our
//               business.
//             </div>
//             <div className="pre-footer-hero-btn d-flex flex-row justify-content-start">
//               <button type="button" class="btn btn-light pre-footer-btn-light">
//                 Host a free event
//               </button>
//             </div>
//           </div>
//           <div className="col-1 col-xl-2"></div>
//         </div>
//         <div
//           className="col-12 col-lg-6 d-flex justify-content-center pre-footer-img-wrapper"
//           style={{ maxHeight: "50vh" }}
//         ></div>
//       </div>
//     );
//   }
// }

// class SearchEvents extends React.Component {
//   render() {
//     return (
//       <>
//         <CssBaseline />
//         <div className="container-fluid page">
//           <div className="row nav-section">
//             <nav class="navbar navbar-expand-lg navbar-light bg-light">
//               <div class="container-fluid">
//                 <a class="navbar-brand" href="#">
//                   <span style={{ color: "#538BF7" }}>Evenz</span>
//                 </a>
//                 <button
//                   class="navbar-toggler"
//                   type="button"
//                   data-bs-toggle="collapse"
//                   data-bs-target="#navbarSupportedContent"
//                   aria-controls="navbarSupportedContent"
//                   aria-expanded="false"
//                   aria-label="Toggle navigation"
//                 >
//                   <span class="navbar-toggler-icon"></span>
//                 </button>
//                 <div
//                   class="collapse navbar-collapse"
//                   id="navbarSupportedContent"
//                 >
//                   <form class="d-flex special" style={{ marginLeft: "2%", alignSelf: "center" }} >
//                     <input
//                       class="form-control me-2"
//                       type="search"
//                       placeholder="Search events"
//                       aria-label="Search"
//                     />
//                     <button class="btn btn-outline-primary" type="submit">
//                       <i className="fa fa-search"></i>
//                     </button>
//                   </form>
//                   <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
//                     <li class="nav-item" style={{alignSelf: "center"}}>
//                       <a class="nav-link active" aria-current="page" href="#">
//                         <button type="button" class="btn btn-outline-primary">
//                           Login
//                         </button>
//                       </a>
//                     </li>
//                     <li class="nav-item" style={{alignSelf: "center"}}>
//                       <a class="nav-link" href="#">
//                         <button type="button" class="btn btn-primary">
//                           Get Started
//                         </button>
//                       </a>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </nav>
//           </div>
//           <div className="row no-of-events-section">
//             <div className="text-center search-page-events-text">Events</div>
//             <div className="text-center search-page-results-text">
//               503 Events . 8 Categories
//             </div>
//           </div>
//           <div className="row filter-and-results-section max-width">
//             <div className="col-12 col-lg-3 filter-section">
//               <div
//                 className="filter-toggle-button col"
//                 style={{ display: "none" }}
//               >
//                 <div
//                   className="row"
//                   style={{ width: "99.5%", margin: "0 auto" }}
//                 >
//                   <button
//                     type="button"
//                     data-bs-toggle="collapse"
//                     data-bs-target="#collapseExample"
//                     aria-expanded="false"
//                     aria-controls="collapseExample"
//                     class="btn btn-outline-secondary"
//                   >
//                     Filter
//                   </button>
//                 </div>
//               </div>
//               <div className="col filter-wrapper" id="collapseExample">
//                 <div
//                   className="row date-filter"
//                   style={{ width: "90%", margin: "0 auto" }}
//                 >
//                   <div className="filter-name">Date</div>
//                   <div className="date-range-filter-input">
//                     <input
//                       className="form-control"
//                       type="date"
//                       value="12/12/2020"
//                     />
//                   </div>
//                   <div style={{ margin: "5% 0" }}>
//                     <Divider />
//                   </div>
//                 </div>

//                 <div
//                   className="row price-filter"
//                   style={{ width: "90%", margin: "0 auto" }}
//                 >
//                   <div className="filter-name">Price</div>
//                   <div className="price-filter-input">
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="anyprice"
//                       />
//                       <label class="form-check-label" Forhtml="anyprice">
//                         Any price
//                       </label>
//                     </div>
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="freeprice"
//                       />
//                       <label class="form-check-label" Forhtml="freeprice">
//                         Free
//                       </label>
//                     </div>
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="paidprice"
//                       />
//                       <label class="form-check-label" Forhtml="paidprice">
//                         Paid
//                       </label>
//                     </div>
//                   </div>
//                   <div style={{ margin: "5% 0" }}>
//                     <Divider />
//                   </div>
//                 </div>

//                 <div
//                   className="row community-rating-filter"
//                   style={{ width: "90%", margin: "0 auto" }}
//                 >
//                   <div className="filter-name">Community Rating</div>
//                   <div className="price-filter-input">
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="defaultCheck1"
//                       />
//                       <label class="form-check-label" for="defaultCheck1">
//                         Any rating
//                       </label>
//                     </div>
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="defaultCheck1"
//                       />
//                       <label class="form-check-label" for="defaultCheck1">
//                         Above 4
//                       </label>
//                     </div>
//                     <div class="form-check">
//                       <input
//                         class="form-check-input"
//                         type="checkbox"
//                         value=""
//                         id="defaultCheck1"
//                       />
//                       <label class="form-check-label" for="defaultCheck1">
//                         Above 3
//                       </label>
//                     </div>
//                   </div>
//                   <div style={{ margin: "5% 0" }}>
//                     <Divider />
//                   </div>
//                 </div>

//                 <div
//                   className="row categories-filter"
//                   style={{ width: "90%", margin: "0 auto" }}
//                 >
//                   <div className="filter-name">Categories</div>
//                   <div className="categories-filter-input">
//                     <Autocomplete
//                       multiple
//                       id="tags-standard"
//                       options={categories}
//                       getOptionLabel={(option) => option.title}
//                       defaultValue={[categories[3]]}
//                       renderInput={(params) => (
//                         <TextField {...params} variant="standard" />
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="col-12 col-lg-9 search-results-section px-5">
//               <div className="row search-result-heading ">Top Picks</div>
//               <div
//                 className="row search-result-grid"
//                 style={{
//                   display: "grid",
//                   gridTemplateColumns: "1fr 1fr",
//                   gridColumnGap: "40px",
//                   gridRowGap: "30px",
//                 }}
//               >
//                 <EventCard />
//                 <EventCard />
//                 <EventCard />

//               </div>
//             </div>
//           </div>

//           <div className="row show-more-search-page">
//             <div className="col-3 col-lg-7"></div>
//             <div className="col-6 col-lg-2 d-flex flex-row justify-content-center">
//               <button type="button" class="btn btn-outline-primary">
//                 Show more
//               </button>
//             </div>
//             <div className="col-3 col-lg-3"></div>
//           </div>
//           <PreFooter />
//         </div>
//       </>
//     );
//   }
// }

// export default SearchEvents;
