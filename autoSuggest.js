window.addEventListener("DOMContentLoaded", function () {
  //initialization
  const form = document.querySelector(".search-form");
  const search = document.getElementById("myInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", (e) => {
    if (search.value === "") e.preventDefault();
  });

  const clearBtn = document.getElementById("clear");
  const closeAllErrMsg = () => {
    let errmsg = document.querySelectorAll(".errmsg");
    if (errmsg.length !== 0) {
      errmsg.forEach((msg) => (msg.style.display = "none"));
    }
  };
  clearBtn.onclick = () => {
    search.value = "";
    clearBtn.style.display = "none";
    closeAllErrMsg();
  };
  //debounce api call -- only fetch data after delay = 1000ms
  let timerID;
  const debounceSearch = (myFunc, query, delay) => {
    clearTimeout(timerID);
    timerID = setTimeout(() => {
      myFunc(query);
    }, delay);
  };

  // autocomplete
  const autocomplete = function (inp, clearBtn) {
    let currentFocus;
    //fetch data from api
    async function searchBook(searchText) {
      let url = "/data.json";
      const response = await fetch(url);
      const matched = await response.json();

      //use the section below to show errmsg sent from the API
      if (matched.hasOwnProperty("message")) {
        let container = document.getElementById("search-wrapper");
        let errmsg = document.createElement("div");
        errmsg.className = "errmsg";
        errmsg.setAttribute("style", "color: red;font-size:1.2rem");
        errmsg.innerText = matched.message;
        container.insertAdjacentElement("afterend", errmsg);
      } else {
        //use this when backend api uses mongodb
        /* result = matched.map((data) => {
          let { _id, name } = data;
          return { id: _id, name };
        });
        console.log(result); */
        closeAllErrMsg();
        showSuggestion(matched);
      }
    }
    //api call with 1000ms function
    inp.addEventListener("input", (e) => {
      if (inp.value.length >= 1) {
        debounceSearch(searchBook, inp.value, 1000);
        clearBtn.style.display = "inline";
      } else {
        closeAllLists();
      }
      console.log(e.target.value);
    });

    function showSuggestion(arr) {
      var a, b, i;
      closeAllLists();
      currentFocus = -1;
      a = document.createElement("div");
      a.setAttribute("id", inp.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      a.innerHTML =
        '<div id="match" style="background: #f3f3f3;width:100%;">Matched results:</div>';
      inp.parentNode.appendChild(a);
      for (i = 0; i < arr.length; i++) {
        if (
          arr[i].name.substr(0, inp.value.length).toUpperCase() ==
          inp.value.toUpperCase()
        ) {
          b = document.createElement("div");
          b.className = "autocomplete-item";
          let val = new RegExp(inp.value, "gi");
          let showText = arr[i].name.replace(
            val,
            `<strong>${inp.value.toUpperCase()}</strong>`
          );
          b.innerHTML = showText;
          b.setAttribute("data-name", arr[i].name);
          b.setAttribute("id", arr[i].id);
          b.addEventListener("click", function (e) {
            inp.value = this.getAttribute("data-name");
            let id = this.getAttribute("id");
            //change it with your API endpoint
            form.action = "/data/" + id;
            form.querySelector("#searchBtn").value = "View";
            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    }

    inp.addEventListener("keydown", function (event) {
      var x = document.getElementById(inp.id + "autocomplete-list");
      if (x) x = x.getElementsByClassName("autocomplete-item");
      if (event.ctrlKey && event.key === "Backspace") {
        closeAllLists();
        closeAllErrMsg();
        clearBtn.style.display = "none";
        if (timerID) clearTimeout(timerID);
      }
      if (event.keyCode == 40) {
        //DOWN
        currentFocus++;
        addActive(x);
      } else if (event.keyCode == 38) {
        //up
        currentFocus--;
        addActive(x);
      } else if (event.keyCode == 13) {
        //enter
        event.preventDefault();
        if (currentFocus > -1) {
          if (x) x[currentFocus].click();
        }
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = x.length - 1;
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      var x = document.querySelectorAll(".autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    document.addEventListener("click", function (e) {
      if (e.target.id !== "match") closeAllLists(e.target);
    });
  };

  autocomplete(search, clearBtn, form);
});
