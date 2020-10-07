# form-input-autosuggest

## This is a simple form input auto suggestion boilterplate/template

### This can be used with any backend api or can be used in server side rendering after some little tweaks

---

## Where to make change?

- In index.html `<form action="/data" method="get" autocomplete="off" class="search-form"> ` _change the **action** attribute with your API endpoint_
- In autoSugest.js `async function searchBook(searchText) { let url = "/data.json";` _change the **url** with your API endpoint_
- In autoSugest.js

  ```
  function showSuggestion(arr) {
        //other codes
      b.addEventListener("click", function (e) {
          ...
          form.action = "/data/" + id;
          ...
      }
      //other codes
    }
  ```

- change **form.action** with your API endpoint
