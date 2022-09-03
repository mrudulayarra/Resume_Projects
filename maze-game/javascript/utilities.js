const shuffle = (arr) => {
    for(let i = 0; i < arr.length; ++i) {
        const idx = Math.floor(Math.random() * arr.length);
        const temp = arr[i];
        arr[i] = arr[idx];
        arr[idx] = temp;
    }
}