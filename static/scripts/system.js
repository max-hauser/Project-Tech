/*
  Show preferences pop-up
*/

const nav_btns = document.querySelectorAll("header nav li img");

nav_btns.forEach((e)=>{
  e.addEventListener('click', popout);
});

function popout(e){
  const target = e.target;

  if(target.dataset.info == "filter"){
    document.querySelector(".filter-popup").classList.toggle('open');
  }
}

/*
  ---------------------------------------------------------------------------------------
*/



/*
  Get preferences data
*/


const preferences = document.querySelector("#preferences");

const inputs = preferences.querySelectorAll("input");

inputs.forEach((e)=>{
  e.addEventListener("change", (e)=>{

    let span = "#"+ e.target.name + "-value";
    document.querySelector(span).innerHTML = e.target.value;

    if(e.target.name === "range"){
      if(e.target.value == 1){
        console.log(e.target.value);
        document.querySelector(span).innerHTML = "city";
      }else if(e.target.value == 2){
        console.log(e.target.value);
        document.querySelector(span).innerHTML = "country";
      }else{
        console.log(e.target.value);
        document.querySelector(span).innerHTML = "world";
      }
    }
  })
})

/*
  ---------------------------------------------------------------------------------------
*/

document.querySelector("submit")