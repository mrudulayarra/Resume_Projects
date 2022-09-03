//the congig is an object which is passed based on the project
const reusableComponent = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
    checker
}) => {
    root.innerHTML = `
        <label>
            Search
        </label>
        <input type="text">
        <div class="autocomplete"></div>
    ` + root.innerHTML;


    const input = root.querySelector("input");
    const autoComplete = root.querySelector(".autocomplete");


    const renderHTML = data => {
        autoComplete.innerHTML = "";
        if(checker) {
            if(input.value !== "") checker();
        }
        //this above line is not reusable
        for(let datum of data) {
            const div = document.createElement('div');
            const imgUrl = (datum.Poster === "N/A") ? '' : datum.Poster;
            div.innerHTML = renderOption(datum);
            autoComplete.appendChild(div);
            div.addEventListener("click",(e) => {
                input.value = inputValue(datum);
                autoComplete.innerHTML = "";
                onOptionSelect(datum.imdbID);
            });
        }
    }

    const onInputChange = async e => {
        const data = await fetchData(e.target.value);
        renderHTML(data);
    };

    //event listeners
    input.addEventListener("input",debounce(onInputChange,800));
    window.addEventListener("click",(e) => {
        if(!root.contains(e.target)) {
            autoComplete.innerHTML = "";
        }
    });
};