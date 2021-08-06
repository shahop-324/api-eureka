import React, { useEffect } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Select from "react-select";
import Faker from "faker";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import SplineChart from "./ChartComponents/SplineChart";
import RadialChart from "./ChartComponents/RadialChart";
import DoughnutChart from "./ChartComponents/DonutChart";
import WorldMapChart from "./ChartComponents/WorldMapChart";
import EventListFields from "./HelperComponent/EventListFields";
import EventDetailCard from "./HelperComponent/EventDetailsCard";
import history from "../../history";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { fetchCommunity} from "../../actions/index";
import { useSelector } from "react-redux";
import AddNewMember from "./FormComponents/AddNewMember";
const options = [
  { value: "Today", label: "Today" },
  { value: "This Week", label: "This Week" },
  { value: "This Month", label: "This Month" },
  { value: "This Year", label: "This Year" },
  { value: "Lifetime", label: "Lifetime" },
];



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
};

const Overview = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  useEffect(() => {
    dispatch(fetchCommunity(id));
  }, [dispatch, id]);
      
 
  const classes = useStyles();

  const [openAddToTeamDialog, setOpenAddToTeamDialog] = React.useState(false);
  const handleAddNewMember = () => {
    setOpenAddToTeamDialog(true);
  };

  const handleCloseAddToTeamDialog = () => {
    setOpenAddToTeamDialog(false);
  };



  const community= useSelector((state)=>{

   return state.community.communities.find((community) => {
      return community.id === id;
    })

  })
  
  console.log(community)


  return (
    <>
      <div className="me-3">
        {/* Secondary Heading with drop selector */}
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4" style={{minWidth: "1138px"}}>
          {/* Secondary Heading */}
          <div className="sec-heading-text">Overview</div>
          {/* Drop Selector */}
          <div className="drop-selector">
            <Select
              styles={styles}
              options={options}
              defaultValue={options[1]}
            />
          </div>
        </div>
        {/* Overview Content Grid */}
        <div className="overview-content-grid px-3 mb-4">
          {/* Overview Left Grid */}
          <div className="overview-content-left">
            {/* Number Card Row */}
            <div className="number-card-row mb-4">
              {/* Number Card 1 */}
              <div className="number-card px-5 py-4 d-flex align-items-center">
                <div>
                  <div className="number-card-heading mb-2">Registrations</div>
                  <div className="number-card-num-and-percent d-flex flex-row align-items-center mb-3">
                    <div className="num-text me-3">10,284</div>
                    <div className="num-percent increment">+224%</div>
                  </div>
                </div>
              </div>
              {/* Number Card 2 */}
              <div className="number-card px-5 py-4 d-flex align-items-center">
                <div>
                  <div className="number-card-heading mb-2">Revenue</div>
                  <div className="number-card-num-and-percent d-flex flex-row align-items-center mb-3">
                    <div className="num-text me-3">$6,284</div>
                    <div className="num-percent increment">+224%</div>
                  </div>
                </div>
              </div>
              {/* Number Card 3 */}
              <div className="number-card px-5 py-4 d-flex align-items-center">
                <div>
                  <div className="number-card-heading mb-2">Followers</div>
                  <div className="number-card-num-and-percent d-flex flex-row align-items-center mb-3">
                    <div className="num-text me-3">2.8M</div>
                    <div className="num-percent decrement">-10%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="revenue-chart-container mb-4">
              <div className="chart-heading-registrations mb-3 px-4 pt-3">
                Revenue
              </div>
              <div className="spline-container">
                <SplineChart />
              </div>
            </div>

            {/* Plan Limit Radial Indicators Row */}
            <div className="plan-limit-indicator-row mb-4">
              {/* Radial Indicator 1 */}
              <div className="registrations-in-period p-0 px-4 d-flex flex-row align-items-center">
                <div className="radial-chart-container me-3">
                  <div className="percentage-label">80%</div>
                  <RadialChart value="80" />
                </div>

                <div className="limit-value-and-heading-conatiner">
                  <div className="consumed-value">
                    1860{" "}
                    <span className="limit-value-small-text">
                      {" "}
                      / 3k Available
                    </span>
                  </div>
                  <div className="limit-heading">Registrations in period</div>
                </div>
              </div>

              {/* Radial Indicator 2 */}
              <div className="streaming-hours p-0 px-4 d-flex flex-row align-items-center">
                <div className="radial-chart-container me-3">
                  <div className="percentage-label">30%</div>
                  <RadialChart value="30" />
                </div>

                <div className="limit-value-and-heading-conatiner">
                  <div className="consumed-value">
                    21 hrs{" "}
                    <span className="limit-value-small-text">
                      {" "}
                      / 72 Available
                    </span>
                  </div>
                  <div className="limit-heading">Streaming in period</div>
                </div>
              </div>
            </div>

            {/* Registrations Map Container */}
            <div className="registrations-map-chart-container">
              <div className="chart-heading-registrations mb-3 px-4 pt-4">
                Registration's Map
              </div>
              <div className="world-map-chart">
                <WorldMapChart />
              </div>
            </div>
          </div>

          {/* Overview Right Grid */}
          <div className="overview-content-right">
            {/* Team Overview Card */}
            
            <div className="team-overview-and-top-events-row-container mt-5">
            <div className="team-overview mb-4 py-4">
              {/* Team Overview Card Heading and See all link */}
              <div className="d-flex flex-row justify-content-between px-4 mb-4">
                <div className="team-overview-card-heading">Your Team (5)</div>
                <div
                  className="see-all-members"
                  onClick={() => history.push("/community/team-management")}
                >
                  See all
                </div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
                <div className="team-member-permission-chip p-2">
                  Super Admin
                </div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
              </div>
              <Divider />

              {/* Add New Member Button */}
              <div className="mx-4">
                <button
                  className="btn btn-outline-primary btn-outline-text"
                  style={{ width: "100%" }}
                  onClick={handleAddNewMember}
                >
                  Add Member
                </button>
              </div>

              {/* Plan Members Limit Message */}
              <div className="add-more-info mt-3 mx-4">
                You can onboard 2 more members.
              </div>
            </div>
            {/* Top Events in this Period card */}
            <div className="top-events-card">
              {/* Top Events Heading */}
              <div className="chart-heading-registrations mb-3 px-4 pt-4">
                Top Events
              </div>
              {/* Donughnut Chart */}
              <div className="d-flex flex-row justify-content-center align-items-center" style={{width: "100%"}}>
                
              <div className="center-label-and-doughnut-wrapper">
                <div className="center-label-wrapper">
                  12 <br />{" "}
                  <span
                    style={{
                      color: "#7D9EB5",
                      fontSize: "18px",
                      lineHeight: "17px",
                      letterSpacing: "0.6px",
                    }}
                  >
                    {" "}
                    Events <br /> Hosted
                  </span>
                </div>
                <div className="donut-chart-wrapper">
                  <DoughnutChart />
                </div>
              </div>
              </div>

              {/* Doughnut Chart Legends */}
              <div className="custom-doughnut-datalabels-wrapper">
                {/* Doughnut Chart Datalabel Row 1 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#11A1FD" }}
                  ></div>
                  <div className="text-label">E - Summit 21'</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#11A1FD" }}
                  >
                    55%
                  </div>
                </div>

                {/* Doughnut Chart Datalabel Row 2 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#A6CEE3" }}
                  ></div>
                  <div className="text-label">Eureka Road to enterprise</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#A6CEE3" }}
                  >
                    25%
                  </div>
                </div>
                {/* Doughnut Chart Datalabel Row 3 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#B2DF8A" }}
                  ></div>
                  <div className="text-label">ACT - A creative TechFest</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#B2DF8A" }}
                  >
                    15%
                  </div>
                </div>
                {/* Doughnut Chart Datalabel Row 4 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#33A02C" }}
                  ></div>
                  <div className="text-label">Others</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#33A02C" }}
                  >
                    5%
                  </div>
                </div>
              </div>
            </div>


            </div>
            <div className="team-and-top-events-bg-container">

            <div className="team-overview mb-4 py-4">
              {/* Team Overview Card Heading and See all link */}
              <div className="d-flex flex-row justify-content-between px-4 mb-4">
                <div className="team-overview-card-heading">Your Team (5)</div>
                <div
                  className="see-all-members"
                  onClick={() => history.push("/community/team-management")}
                >
                  See all
                </div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
                <div className="team-member-permission-chip p-2">
                  Super Admin
                </div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
              </div>
              <Divider />

              {/* Team Overview Member Card */}
              <div className="team-member-card d-flex flex-row align-items-center  px-4 my-4">
                <Avatar
                  alt="Travis Howard"
                  src={Faker.image.avatar()}
                  className={classes.large}
                />
                <div className="team-member-name">Dean Clem</div>
              </div>
              <Divider />

              {/* Add New Member Button */}
              <div className="mx-4">
                <button
                  className="btn btn-outline-primary btn-outline-text"
                  style={{ width: "100%" }}
                  onClick={handleAddNewMember}
                >
                  Add Member
                </button>
              </div>

              {/* Plan Members Limit Message */}
              <div className="add-more-info mt-3 mx-4">
                You can onboard 2 more members.
              </div>
            </div>
            {/* Top Events in this Period card */}
            <div className="top-events-card">
              {/* Top Events Heading */}
              <div className="chart-heading-registrations mb-3 px-4 pt-4">
                Top Events
              </div>
              {/* Donughnut Chart */}
              <div className="d-flex flex-row justify-content-center ">

              <div className="center-label-and-doughnut-wrapper ">
                <div className="center-label-wrapper">
                  12 <br />{" "}
                  <span
                    style={{
                      color: "#7D9EB5",
                      fontSize: "18px",
                      lineHeight: "17px",
                      letterSpacing: "0.6px",
                    }}
                  >
                    {" "}
                    Events <br /> Hosted
                  </span>
                </div>
                <div className="donut-chart-wrapper">
                  <DoughnutChart />
                </div>
              </div>
              </div>

              {/* Doughnut Chart Legends */}
              <div className="custom-doughnut-datalabels-wrapper">
                {/* Doughnut Chart Datalabel Row 1 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#11A1FD" }}
                  ></div>
                  <div className="text-label">E - Summit 21'</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#11A1FD" }}
                  >
                    55%
                  </div>
                </div>

                {/* Doughnut Chart Datalabel Row 2 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#A6CEE3" }}
                  ></div>
                  <div className="text-label">Eureka Road to enterprise</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#A6CEE3" }}
                  >
                    25%
                  </div>
                </div>
                {/* Doughnut Chart Datalabel Row 3 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#B2DF8A" }}
                  ></div>
                  <div className="text-label">ACT - A creative TechFest</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#B2DF8A" }}
                  >
                    15%
                  </div>
                </div>
                {/* Doughnut Chart Datalabel Row 4 */}
                <div className="custom-doughnut-datalabel-row">
                  <div
                    className="color-label"
                    style={{ background: "#33A02C" }}
                  ></div>
                  <div className="text-label">Others</div>
                  <div
                    className="percentage-label-doughnut"
                    style={{ color: "#33A02C" }}
                  >
                    5%
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Recent Events Data Table Grid */}
        <div className="recent-events-data-grid mx-3 mb-4" style={{minWidth: "1138px"}}>
          {/* Recent Events Heading */}
          <div className="chart-heading-registrations mb-3 px-4 pt-4">
            Recent Events
          </div>
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          {/* Data Table Fields Label row */}
          <EventListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          {/* Data Table Events Detail Cards Wrapper */}
          <div>
            <EventDetailCard />
            <EventDetailCard />
            <EventDetailCard />
          </div>
        </div>
        {/* Add New Member Dialog Box ---- This Needs to be refactored into a single component with it's own open / close state. */}
        <AddNewMember
          openAddToTeamDialog={openAddToTeamDialog}
          handleCloseAddToTeamDialog={handleCloseAddToTeamDialog}
        />
      </div>
    </>
  );
};

export default Overview;
