function abreMenu() {
    document.getElementById("menu").style.left = "0";
    document.getElementById("fundo-sidebar").style.display = "block";
}

function fechaMenu() {
    document.getElementById("menu").style.left = "-250px";
    document.getElementById("fundo-sidebar").style.display = "none";
} 

document.addEventListener('DOMContentLoaded', () => {
    carregaFaixa();
    carregaNovidade();
    carregaFamosos();
    carregaDesenho();

    document.querySelectorAll('[data-genre]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const genreId = link.getAttribute('data-genre');
            carregaPorGenero(genreId);
        });
    });
});

async function carregaFaixa() {
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
    const data = await res.json();
    const destaque = data.results[Math.floor(Math.random() * data.results.length)];

    const faixa = document.getElementById('faixa');
    const tituloFaixa = document.getElementById('titulo-faixa');

    faixa.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${destaque.backdrop_path})`;
    tituloFaixa.textContent = destaque.title;
}

async function carregaFamosos() {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&sort_by=revenue.desc&language=pt-BR`);
    const data = await res.json();
    preencheFilmes('filmes-famosos', data.results);
}

async function carregaNovidade() {
    const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&vote_count.gte=500`);
    const data = await res.json();
    preencheFilmes('filmes-novidade', data.results);
}

async function carregaDesenho() {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=16&sort_by=vote_average.desc&vote_count.gte=500`);
    const data = await res.json();
    preencheFilmes('filmes-desenho', data.results);
}

async function carregaPorGenero(genreId) {
    const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=500`);
    const data = await res.json();
    preencheFilmes('filmes-famosos', data.results);
}

function preencheFilmes(containerId, filmes) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    filmes.forEach(filme => {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${filme.poster_path}`;
        img.alt = filme.title;
        container.appendChild(img);
    });
}

function procuraFilme() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim() !== "") {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(termo)}`;
    }
}
