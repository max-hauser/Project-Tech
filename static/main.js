if (window.location.href.includes("meet")) {
  // popup filter function

  const filter_btn = document.querySelector("#toggle_filter");
  const filter = document.querySelector("#filter");

  filter.classList.add("hide");

  function toggle_filter(event) {
    event.preventDefault();
    console.log(filter);
    filter.classList.toggle("show");
    filter.classList.toggle("hide");
  }

  filter_btn.addEventListener("click", toggle_filter);

  const age = document.querySelector("#age");
  const age_value = document.querySelector("#age_value");

  age.addEventListener("input", e => {
    const newValue = Number(
      ((age.value - age.min) * 100) / (age.max - age.min)
    );
    const newPosition = 8 - newValue * 0.5;

    age_value.innerHTML = `<span> ${e.target.value} </span>`;
    age_value.style.left = `calc(${newValue}% + (${newPosition}px))`;
  });

  const distance_input = document.querySelector("#distance");
  const distance_value = document.querySelector("#distance_value");

  distance_input.addEventListener("input", e => {
    console.log(e.target.value);
    if (e.target.value == 1) {
      console.log("city");
      distance_value.innerHTML = `<span>City</span>`;
      distance_value.style.left = 5 + "%";
    } else if (e.target.value == 2) {
      console.log("country");
      distance_value.innerHTML = `<span>Country</span>`;
      distance_value.style.left = 45 + "%";
    } else {
      console.log("world");
      distance_value.innerHTML = `<span>World</span>`;
      distance_value.style.left = 88 + "%";
    }
  });
}

const i = document.querySelectorAll("input");

i.forEach(input => {
  input.addEventListener("focus", event => {
    const fieldset = input.closest("fieldset");
    fieldset.style.opacity = "1";
  });
});
