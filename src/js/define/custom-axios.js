import axios from 'axios';

const ax = axios.create({
  baseURL: "https://staging-api.go2joy.vn/"
});

ax.interceptors.request.use(
  function(config) {
    config.headers.common["Authorization"] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsYXJhdmVsLWp3dCIsInN1YiI6IntcInNjb3BlXCI6XCJ3ZWJcIixcInNuXCI6MzQ5MCxcImhvdGVsU25cIjoxLFwicm9sZVNuXCI6MTV9IiwiaWF0IjoxNjIwMDkzNzIxLCJleHAiOjE2MjgwNDI1MjF9.DiT1UDTK9mOWw2DiV7NOM1_flxc8MF3rdupHsFBTooo`;
    // Do something before request is sent
    // const token = localStorage.getItem("token");
    // if (token) {
    //   config.headers.common["Authorization"] = `Bearer ${token}`;
    //   config.headers.common["Authorization"] = `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJsYXJhdmVsLWp3dCIsInN1YiI6IntcInNjb3BlXCI6XCJ3ZWJcIixcInNuXCI6MzQ5MCxcImhvdGVsU25cIjoxLFwicm9sZVNuXCI6MTV9IiwiaWF0IjoxNjIwMDkzNzIxLCJleHAiOjE2MjgwNDI1MjF9.DiT1UDTK9mOWw2DiV7NOM1_flxc8MF3rdupHsFBTooo`;
    // }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default ax;