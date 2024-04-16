
{
    const leftCotainer = document.getElementById('left-container');
    const rightCotainer = document.getElementById('right-container');
    const reset = document.querySelector("#reset");
    const check = document.querySelector('#enter');
    const countryInfo = document.querySelector('.countryInfo');
    const input = document.getElementById('input');
    const inputDate = document.getElementById('date');
  
    //create an emptry array to store the data from fetch available countries;
    let countriesArr = [];
    const url = 'https://date.nager.at/api/v3/PublicHolidays';
  
    //fetch fetch available countries;
    fetch('https://date.nager.at/api/v3/AvailableCountries')
      .then(res => res.json())
      .then(data => {
        data.forEach(e => countriesArr.push(e))
      })
      ;
    //fetch the NextPublicHolidaysWorldwide
    fetch('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide')
      .then(res => res.json())
      .then(data => {
        console.log(data)
  
        const gridOptions = {
          // defines the columns for grid
          columnDefs: [
            { field: "date"},
            { field: "name"},
            { field: "countryCode"}
          ],
          //add eventlistener for clicking rows
          onRowClicked: function (event) {
            let code = event.data.countryCode;
            let year = event.data.date.slice(0, 4);
            console.log(year)
            search(code, year);
            leftCotainer.style.display = "none";
            rightCotainer.style.display = "block";
          }
        };
  
        const gridApi = agGrid.createGrid(leftCotainer, gridOptions) // create a table
       
        //get the rows content
        const rowData = data.map(e => ({
          date: e.date,
          name: e.name,
          countryCode: e.countryCode
        }));
        // Set rowData to the grid
        gridApi.setGridOption('rowData', rowData);
      })
  
    // function about search data
    function search(code, year) {
  
      fetch(url + '/' + year + '/' + code) //get input data then fetch
        .then(res => res.json())
        .then(data => {
  
          console.log(data)
          let countryN;
          //transfer country's code to name for display
          data.forEach(e => {
            countriesArr.find(i => {
              if (i.countryCode === e.countryCode) {
                countryN = i.name;
              }
            })
          })
          console.log(countryN)
  
          countryInfo.innerHTML = `${countryN}'s Holidays`;
          clearTable(rightCotainer);// clear previous table
          const gridOptions1 = {
            columnDefs: [
              { field: "date" },
              { field: "localName" },
              { field: "name" }
            ],
            //eventlistener for rows , open new page
            onRowClicked: (e) => {
              const countryName = e.data.name;
              const wikiURL = 'https://en.wikipedia.org/wiki/' + countryName;
              window.open(wikiURL, '_blank');
            }
          };
  
          const gridApi1 = agGrid.createGrid(rightCotainer, gridOptions1)
          //get the rows content
          const rowData = data.map(e => ({
            date: e.date,
            localName: e.localName,
            name: e.name
          }));
  
          // Set rowData to the grid
          gridApi1.setGridOption('rowData', rowData);
  
        })
    }
    //EventListener for click enter button
    check.addEventListener('click', () => {
      let code = input.value;
      let year = inputDate.value;
      let isValidCode = false;
      let isValidYear = false;
      leftCotainer.style.display = "none";
      rightCotainer.style.display = "block";
  
      //validations
      countriesArr.forEach(e => {
        if (e.name.toLowerCase() === code.toLowerCase() || e.countryCode === code.toUpperCase()) {
          code = e.countryCode;
          isValidCode = true;
        }
      });
  
      const currentYear = new Date().getFullYear();
      if (year !== "" && Math.abs(currentYear - year) <= 50) {
        isValidYear = true;
      }
  
      if (!isValidCode) {
        document.getElementById("country-error").textContent = "Invalid country name";
        document.getElementById("country-error").style.display = "block";
      } else {
        document.getElementById("country-error").style.display = "none";
      }
  
      if (!isValidYear) {
        document.getElementById("year-error").textContent = "Invalid year";
        document.getElementById("year-error").style.display = "block";
      } else {
        document.getElementById("year-error").style.display = "none";
      }
  
      if (isValidCode && isValidYear) {
        search(code, year);
        input.value = '';
        inputDate.value = '';
      }
  
    })
  
    //cleartable function
    function clearTable(container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
  
    //EventListener for reset button
  
    reset.addEventListener('click', () => {
  
      leftCotainer.style.display = "block";
      rightCotainer.style.display = "none";
      countryInfo.innerHTML = "Next 7 days Holiday of The World";
      document.getElementById("country-error").style.display = "none";
      document.getElementById("year-error").style.display = "none";
      input.value = '';
      inputDate.value = '';
    })
}