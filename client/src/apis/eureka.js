import axios from "axios";

const { REACT_APP_MY_ENV_ } = process.env;
console.log(REACT_APP_MY_ENV_);
export default axios.create({
  baseURL: REACT_APP_MY_ENV_
    ? "http://localhost:3000/api-eureka"
    : "https://www.evenz.co.in/api-eureka",

  // else
  // {
  // baseURL: "https://www.evenz.co.in/api-eureka",
  // }
});
