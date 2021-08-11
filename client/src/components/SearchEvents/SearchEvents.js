import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
// import Pagination from "@material-ui/lab/Pagination";
import EventCard from "../EventCard";
import { useState } from "react";
import PaidPriceSelector from "../PaidPriceSelector";
import history from "../../history";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { errorTrackerForFetchEvents, fetchEvents } from "../../actions/index";
// you will need the css that comes with bootstrap@3. if you are using
// a tool like webpack, you can do the following:
import "bootstrap/dist/css/bootstrap.css";
// you will also need the css that comes with bootstrap-daterangepicker
import "bootstrap-daterangepicker/daterangepicker.css";
import dateFormat from "dateformat";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import Footer from "../Footer";
import PreFooter from "../PreFooter";

import Loader from "./../../components/Loader";
import AvatarMenu from "../AvatarMenu";

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
  console.log(location);
  
  useEffect(() => {
    dispatch(fetchEvents(location.search));
  }, [location.search, dispatch]);

  useEffect(() => {
    history.push('/search-events/');
  }, []);

  const [text, setText] = useState("");
  const [priceFilter, setPriceFilter] = useState("Free");


  let fullLocation = `https://www.evenz.in/${location.pathname}${location.search}`;
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
      const end = new Date(event.endDate);
      const formatedDate = dateFormat(now, "mmmm dS, h:MM TT");
      // console.log(x);

      const formatedEndDate = dateFormat(end, "mmmm dS, h:MM TT")

      return (
        <EventCard
          image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
          date={formatedDate}
          endDate={formatedEndDate}
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

  if (error) {
    dispatch(errorTrackerForFetchEvents());
    alert(error);
    return;
  }

  return (
    <>
      <CssBaseline />
      <div className="">
        <div className="row nav-section">
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
              <span class="navbar-brand" style={{ color: "#538BF7" }}>
                Evenz
              </span>

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
                  {isSignedIn ? (
                    <div className="me-5">
                      <AvatarMenu />
                    </div>
                  ) : (
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      {" "}
                      <li class="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signin"
                          type="button"
                          class="btn btn-outline-primary btn-outline-text me-3"
                        >
                          Login
                        </Link>
                      </li>
                      <li class="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signup"
                          type="button"
                          class="btn btn-primary btn-outline-text"
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
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="price"
                      id="filterAnyPrice"
                      value="Any Price"
                      onChange={onPriceFilterChange}
                    />
                    <label
                      class="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="filterAnyPrice"
                    >
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
                    <label
                      class="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="filterfree"
                    >
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
                    <label
                      class="form-check-label mb-3"
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
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="rating"
                      id="flexRadioDefault4"
                      value="Any Rating"
                      onChange={onRatingFilterChange}
                    />
                    <label
                      class="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="flexRadioDefault4"
                    >
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
                    <label
                      class="form-check-label"
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                      for="flexRadioDefault5"
                    >
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
                    <label
                      class="form-check-label"
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
                renderedList()
              )}
            </div>
          </div>
        </div>
        <div className="row show-more-search-page " style={{ height: "auto" }}>
          <div className="col-0 col-lg-4"></div>
          <div className="col-12 col-lg-6 d-flex flex-row justify-content-center py-4">
            {/* <Pagination count={100} color="primary" /> */}
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
