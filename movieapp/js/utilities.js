//this is the debouncing function
let timeoutId;
function debounce(func,delay = 1000) {
    return (...args) => {
        if(timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.call(null,...args);
        },delay);
    }
}