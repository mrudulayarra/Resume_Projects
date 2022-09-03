let leftSummary;
let rightSummary;


const spreadReusable = {
    renderOption(movie) {
        const imgUrl = (movie.Poster === "N/A") ? '' : movie.Poster;
        return `
                <img src = "${imgUrl}" />
                <h4>${movie.Title}</h4>
        `;
    },
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const response = await axios.get("https://www.omdbapi.com/",{
            params: {
                apikey: "5bb9de4e",
                s : searchTerm
            }
        });
        document.querySelector(".note").classList.add("hide");
        if(!response.data.Search) return [];
        return response.data.Search;
    },
};
reusableComponent({
    root: document.querySelector(".movie-one"),
    onOptionSelect(movieId) {
        onMovieSelect(movieId,document.querySelector(".one"));
    },
    ...spreadReusable,
    checker() {
        document.querySelector(".one").innerHTML = "";
    }
});
reusableComponent({
    root: document.querySelector(".movie-two"),
    onOptionSelect(movieId) {
        onMovieSelect(movieId,document.querySelector(".two"));
    },
    ...spreadReusable,
    checker() {
        document.querySelector(".two").innerHTML = "";
    }
});


//functions
const renderSingleMovie = (movieInfo) => {
    const imgUrl = (movieInfo.Poster === "N/A") ? '' : movieInfo.Poster;
    let metaScore = parseInt(movieInfo.Metascore);
    metaScore = (isNaN(metaScore)) ? 0 : metaScore; 
    let imdbRating = parseFloat(movieInfo.imdbRating);
    imdbRating = (isNaN(imdbRating)) ? 0 : imdbRating;
    let votes = parseInt(movieInfo.imdbVotes.replace(/,/g,""));
    votes = (isNaN(votes)) ? 0 : votes;
    movieInfo.BoxOffice = (movieInfo.BoxOffice === undefined) ? "N/A" : movieInfo.BoxOffice;
    let boxOffice = parseInt(movieInfo.BoxOffice.replace(/\$/g,"").replace(/,/g,""));
    boxOffice = (isNaN(boxOffice)) ? 0 : boxOffice;
    const awards = movieInfo.Awards.split(" ").reduce((accum,currval) => {
        if(!isNaN(parseInt(currval))) accum += parseInt(currval);
        return accum;
    },0);
    return `
        <div class = "resultmovie-header">
            <img src = "${imgUrl}"/>
            <div class = "resultmovie-header-text">
                <h3>${movieInfo.Title}</h3>
                <h4>Genre : ${movieInfo.Genre}<br/>Runtime : (${movieInfo.Runtime})</h4>
                <p>Plot : ${movieInfo.Plot}</p>
            </div>
        </div>
        <div data-value = "${awards}" class = "resultmovie-critic">
            <p>Awards</p>
            <h4>${movieInfo.Awards}</h4>
        </div>
        <div data-value = "${boxOffice}" class = "resultmovie-critic">
            <p>BoxOffice</p>
            <h4>${movieInfo.BoxOffice}</h4>
        </div>
        <div data-value = "${imdbRating}" class = "resultmovie-critic">
            <p>IMDB Rating</p>
            <h4>${movieInfo.imdbRating}</h4>
        </div>
        <div data-value = "${metaScore}" class = "resultmovie-critic">
            <p>Metascore</p>
            <h4>${movieInfo.Metascore}</h4>
        </div>
        <div data-value = "${votes}" class = "resultmovie-critic">
            <p>IMDB Votes</p>
            <h4>${movieInfo.imdbVotes}</h4>
        </div>
    `;
}
const displayResults = () => {
    const leftCritics = document.querySelectorAll(".one .resultmovie-critic");
    const rightCritics = document.querySelectorAll(".two .resultmovie-critic");
    leftCritics.forEach((leftCritic,index) => {
        const rightCritic = rightCritics[index];
        leftCritic.classList.remove("green");
        rightCritic.classList.remove("green");
        leftCritic.classList.remove("red");
        rightCritic.classList.remove("red");
        if(parseFloat(leftCritic.dataset.value) > parseFloat(rightCritic.dataset.value)) {
            leftCritic.classList.add("green");
            rightCritic.classList.add("red");
        }
        else if(parseFloat(leftCritic.dataset.value) < parseFloat(rightCritic.dataset.value)){
            leftCritic.classList.add("red");
            rightCritic.classList.add("green");
        }
        else {
            leftCritic.classList.add("green");
            rightCritic.classList.add("green");
        }
    });
}
const onMovieSelect = async (id,ele) => {
    const response = await axios.get("https://www.omdbapi.com/",{
        params: {
            apikey: "5bb9de4e",
            i : id
        }
    });
    if(ele.classList.contains("one")) leftSummary = response.data;
    else rightSummary = response.data;
    ele.innerHTML = renderSingleMovie(response.data);
    if(leftSummary && rightSummary) {
        displayResults();
    }
}