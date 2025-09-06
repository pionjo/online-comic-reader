async function fetchComics(){
    const apiUrl = 'http://localhost:3000/api/comics';
    const comicsContainer = document.getElementById('comics-container');

    try {
        const response = await fetch(apiUrl);
        if(!response.ok){
            throw new Error(`HTTP error! sttaus: ${response.status} `);
        }
        const data = await response.json();
        console.log(data);

        const comics =data.data.results;

        comics.forEach(comic => {
            const comicCard = document.createElement('div');
            comicCard.classList.add('comic-card');
            const thumbnailurl = `${comic.thumbnail.path}.${comic.thumbnail.extension}`;
            comicCard.innerHTML = `<img src="${thumbnailurl}" alt="${comic.title}">
            <h3>${comic.title}</h3>`;
            comicsContainer.appendChild(comicCard);
        });
    } catch(error){
        console.error("Could not fetch comics:", error);
        comicsContainer.innerText = 'Failed tp load comics from the server.';
    }
}

fetchComics();