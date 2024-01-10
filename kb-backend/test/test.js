// Test der API 

const { response } = require("express");

console.log("Hallo");

// fetch("http://localhost:3000/todos")
//     .then(response => response.json())
//     .then(data => console.log(data))

// run with: node --experimental-fetch

const API_URL = "http://localhost:3000/";

// POST: neues todo anlegen
function testPost() {
  let item = { "link": "neues test item" };
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(item)
  };
  return fetch(API_URL + "link", options)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log("id is:", data.id);
      return new Promise((resolve, reject) => {
        resolve(data.id);
      })
    })
} // testPost()



// GET: einzelnes objekt anzeigen
function testGet(id) {
  return fetch(API_URL + "link/" + id)
    .then(response => {
      return response.json();
    })
    .then(data => {
      return data;
    })
}




