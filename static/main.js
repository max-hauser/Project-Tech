'use strict'

window.addEventListener("load", get_filter_params);

const submit_filter = document.querySelector("#submit_pref");
submit_filter.addEventListener("click", get_filter_params);

function get_filter_params() {

  const filter = document.querySelector("#filter");
  const inputs = filter.querySelectorAll("input");
  let filter_params = [];

  inputs.forEach((input) => {

    if (input.type === "radio") {
      if (input.checked === true) {
        filter_params.push(input.value);
      }
    } else {
      filter_params.push(input.value);
    }
  });

  send_to_server(filter_params);
}

function send_to_server(params){
  console.log(params);
}