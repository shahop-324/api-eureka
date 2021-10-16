import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import EventCard from "../EventCard";
import { useState } from "react";
import PaidPriceSelector from "../PaidPriceSelector";
import history from "../../history";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  errorTrackerForFetchEvents,
  fetchEvents,
} from "../../actions/index";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import dateFormat from "dateformat";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import Footer from "../Footer";
import PreFooter from "../PreFooter";

import Loader from "./../../components/Loader";
import AvatarMenu from "../AvatarMenu";
import NoResultsFound from "../NoResultsFound";

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

const SearchEvents = () => {
  const dispatch = useDispatch();

  const { isSignedIn } = useSelector((state) => state.auth);

  const { error, isLoading } = useSelector((state) => state.event);

  const location = useLocation();

  useEffect(() => {
    dispatch(fetchEvents(location.search));
  }, [location.search, dispatch]);

  useEffect(() => {
    history.push("/search-events/");
  }, []);

  const [text, setText] = useState("");
  const [priceFilter, setPriceFilter] = useState("Free");

  let fullLocation = `https://www.bluemeet.in/${location.pathname}${location.search}`;
  let url = new URL(fullLocation);
  let search_params = url.searchParams;

  const onChangeSearchEvents = (e) => {
    setText(e.target.value);
  };

  const eventsList = useSelector((state) => state.event.events);

  const userFavourites = useSelector((state) => state.event.favouriteEvents);

  console.log(eventsList);
  const onPriceFilterChange = (e) => {
    const price = e.target.value;
    console.log(price);
    setPriceFilter(e.target.value);
    if (price === "Free") {
      search_params.set("max_price", 0);
      search_params.delete("min_price");
      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);

      const len = new_url.split("?")[0].length;

      const result = new_url.substring(len);
      console.log(typeof result);
      console.log(result);
      // props.fetchEvents(event.target.value);
      // if (result !== null) {
      //   history.push("/search-events/");
      // }
      // // } else {
      // //   history.push(result);
      // // }
      // console.log(location.search)
      // if (location.search===null) {
      //   history.push("/search-events/");
      // } else {
      //   history.push(result);
      // }
      if (result === "") {
        history.push("/search-events/");
      } else {
        history.push(result);
      }
      // history.push(result);
    } else if (price === "Any Price") {
      search_params.delete("max_price");
      search_params.delete("min_price");
      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      const len = new_url.split("?")[0].length;

      const result = new_url.substring(len);
      console.log(typeof result);
      // props.fetchEvents(event.target.value);
      if (result === "") {
        history.push("/search-events/");
      } else {
        history.push(result);
      }
      // if(result)
      // history.push(result);
    }
  };

  const onRatingFilterChange = (e) => {
    const rating = e.target.value;

    if (rating === "Above 4") {
      search_params.set("communityRating[gt]", 4);

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      const len = new_url.split("?")[0].length;

      const result = new_url.substring(len);

      // props.fetchEvents(event.target.value);
      if (result === "") {
        history.push("/search-events/");
      } else {
        history.push(result);
      }
    } else if (rating === "Above 3") {
      search_params.set("communityRating[gt]", 3);

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      const len = new_url.split("?")[0].length;

      const result = new_url.substring(len);

      // props.fetchEvents(event.target.value);
      if (result === "") {
        history.push("/search-events/");
      } else {
        history.push(result);
      }
    } else if (rating === "Any Rating") {
      search_params.delete("communityRating[gt]");

      url.search = search_params.toString();
      let new_url = url.toString();
      // setFullLocation(new_url);
      const len = new_url.split("?")[0].length;

      const result = new_url.substring(len);

      // props.fetchEvents(event.target.value);
      if (result === "") {
        history.push("/search-events/");
      } else {
        history.push(result);
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
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);

    if (result === "") {
      history.push("/search-events/");
    } else {
      history.push(result);
    }
  };

  const renderedList = (eventsList, userFavourites) => {
    return eventsList.map((event) => {
      const now = new Date(event.startDate);
      const end = new Date(event.endDate);
      const formatedDate = dateFormat(now, "ddd mmm dS, h:MM TT");
      const formatedEndDate = dateFormat(end, "ddd mmm dS, h:MM TT");

      const startTime = dateFormat(event.startTime, "ddd mmm dS, h:MM TT");
      const endTime = dateFormat(event.endTime, "ddd mmm dS, h:MM TT");

      //  Check if its a favourite event or not

      let isFavourite = false;

      let favouriteEvent;
      if (userFavourites) {
        favouriteEvent = userFavourites.filter((el) => el.id === event.id);
      }

      console.log(favouriteEvent, "opppppppppp");

      if (typeof favouriteEvent !== "undefined" && favouriteEvent.length > 0) {
        isFavourite = true;
      } else {
        isFavourite = false;
      }

      return (
        <EventCard
          image={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.image}`}
          date={formatedDate}
          endDate={formatedEndDate}
          id={event.id}
          eventName={event.eventName}
          minPrice={event.minTicketPrice}
          maxPrice={event.maxTicketPrice}
          key={event.id}
          rating={(event.communityRating * 1.0).toFixed(1)}
          startTime={startTime}
          endTime={endTime}
          communityId={event.communityId}
          isFavourite={isFavourite}
          speakers={event.speaker}
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
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);

    // props.fetchEvents(event.target.value);
    if (result === "") {
      history.push("/search-events/");
    } else {
      history.push(result);
    }
  };

  const onCategoryBucketChange = (event, value) => {
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
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);
    console.log(result);
    if (result === "") {
      history.push("/search-events/");
    } else {
      history.push(result);
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
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);

    // props.fetchEvents(event.target.value);
    if (result === "") {
      history.push("/search-events/");
    } else {
      history.push(result);
    }
  };

  if (error) {
    return dispatch(errorTrackerForFetchEvents());
  }

  return (
    <>
      <CssBaseline />
      <div className="">
        <div className="row nav-section">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link
                to="/home"
                className="navbar-brand"
                style={{ color: "#538BF7", textDecoration: "none" }}
              >
                Bluemeet
              </Link>
              <button
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <form
                  onSubmit={onSubmitTextSearch}
                  className="d-flex special"
                  style={{ marginLeft: "2%", alignSelf: "center" }}
                >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search events"
                    aria-label="Search"
                    value={text}
                    onChange={onChangeSearchEvents}
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </form>
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  {isSignedIn ? (
                    <div className="me-5 py-2 d-flex flex-row align-items-center justify-content-center">
                      <AvatarMenu />
                    </div>
                  ) : (
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      {" "}
                      <li className="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signin"
                          className="btn btn-outline-primary btn-outline-text me-3"
                        >
                          Login
                        </Link>
                      </li>
                      <li className="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signup"
                          className="btn btn-primary btn-outline-text"
                        >
                          Get Started
                        </Link>
                      </li>{" "}
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div className="row no-of-events-section">
          <div
            className="text-center search-page-events-text"
            style={{ fontFamily: "Inter" }}
          >
            Events
          </div>
          <div className="text-center search-page-results-text">
            {eventsList.length} Events . 8 Categories
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
                {/* <button
                
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExample"
                  aria-expanded="false"
                  aria-controls="collapseExample"
                  className="btn btn-outline-secondary"
                >
                  Filter
                </button> */}
              </div>
            </div>
            <div className="col filter-wrapper" id="collapseExample">
              <div
                className="row date-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div
                  className="filter-name pt-3"
                  style={{ fontFamily: "Inter", fontWeight: "600" }}
                >
                  Date
                </div>

                <div className="px-2">
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
                    <input
                      type="text"
                      className="form-control col-4"
                      Value=""
                    />
                  </DateRangePicker>
                </div>

                {/* </div> */}
                <div style={{ margin: "5% 0" }}>
                  <Divider />
                </div>
              </div>

              <div
                className="row price-filter"
                style={{ width: "90%", margin: "0 auto" }}
              >
                <div
                  className="filter-name mb-3"
                  style={{ fontFamily: "Inter", fontWeight: "600" }}
                >
                  Price (in USD)
                </div>
                <div className="price-filter-input">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="price"
                      id="filterAnyPrice"
                      value="Any Price"
                      onChange={onPriceFilterChange}
                    />
                    <label
                      className="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="filterAnyPrice"
                    >
                      Any Price
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="price"
                      id="filterfree"
                      value="Free"
                      onChange={onPriceFilterChange}
                    />
                    <label
                      className="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="filterfree"
                    >
                      Free
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="price"
                      id="filterpaid"
                      value="Paid"
                      onChange={onPriceFilterChange}
                    />
                    <label
                      className="form-check-label mb-3"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                    >
                      Paid
                    </label>
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
                <div
                  className="filter-name mb-3"
                  style={{ fontFamily: "Inter", fontWeight: "600" }}
                >
                  Community Rating
                </div>
                <div className="price-filter-input">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault4"
                      value="Any Rating"
                      onChange={onRatingFilterChange}
                    />
                    <label
                      className="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="flexRadioDefault4"
                    >
                      Any Rating
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault5"
                      value="Above 4"
                      onChange={onRatingFilterChange}
                    />
                    <label
                      className="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="flexRadioDefault5"
                    >
                      Above 4
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault6"
                      value="Above 3"
                      onChange={onRatingFilterChange}
                    />
                    <label
                      className="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="flexRadioDefault6"
                    >
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
                <div
                  className="filter-name"
                  style={{ fontFamily: "Inter", fontWeight: "600" }}
                >
                  Categories
                </div>
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
            <div className="row search-result-heading pb-4">Top Picks</div>
            {eventsList[0] ? (
              <div
                className="row search-result-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridColumnGap: "40px",
                  gridRowGap: "40px",
                }}
              >
                {isLoading ? (
                  <div
                    className="d-flex flex-row justify-content-center align-items-center"
                    style={{ minWidth: "60vw", height: "50vh" }}
                  >
                    <Loader />{" "}
                  </div>
                ) : (
                  renderedList(eventsList, userFavourites)
                )}
              </div>
            ) : (
              <div
                className="d-flex flex-row align-items-center justify-content-center me-5"
                style={{ textAlign: "center" }}
              >
                <NoResultsFound />
              </div>
            )}
          </div>
        </div>
        <div className="row show-more-search-page " style={{ height: "auto" }}>
          <div className="col-0 col-lg-4"></div>
          <div className="col-12 col-lg-6 d-flex flex-row justify-content-center py-4">
            <button className="btn btn-light-outline disabled btn-outline-text">
              End of Results
            </button>
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
