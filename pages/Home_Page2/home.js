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
    carregaSeriesFamosas();
    carregaSeriesNovidade();
    carregaSeriesDesenho();

document.querySelectorAll('[data-genre]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const genreFilme = link.getAttribute('data-genre');
        const genreSerie = link.getAttribute('data-genre-serie');
        carregaPorGenero(genreFilme, genreSerie);
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

async function carregaSeriesFamosas() {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&sort_by=vote_average.desc&vote_count.gte=500`);
    const data = await res.json();
    preencheFilmes('series-famosas', data.results, true);
}

async function carregaSeriesNovidade() {
    const res = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
    const data = await res.json();
    preencheFilmes('series-novidade', data.results, true);
}

async function carregaSeriesDesenho() {
    const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=16&sort_by=vote_average.desc&vote_count.gte=100&language=pt-BR`);
    const data = await res.json();
    preencheFilmes('series-desenho', data.results, true);
}


async function carregaPorGenero(genreFilme, genreSerie) {

    document.getElementById('secao-filmes-novidade').style.display = 'none';
    document.getElementById('secao-filmes-desenho').style.display = 'none';
    document.getElementById('secao-series-novidade').style.display = 'none';
    document.getElementById('secao-series-desenho').style.display = 'none';
    document.getElementById('secao-filmes-famosos').style.display = 'block';
    document.getElementById('secao-series-famosas').style.display = 'block';

    const resFilmes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=${genreFilme}&sort_by=popularity.desc&vote_count.gte=500`);
    const dataFilmes = await resFilmes.json();
    preencheFilmes('filmes-famosos', dataFilmes.results);

    const resSeries = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=${genreSerie}&sort_by=popularity.desc&vote_count.gte=500`);
    const dataSeries = await resSeries.json();
    preencheSeries('series-famosas', dataSeries.results);
}



function preencheFilmes(containerId, itens, isSerie = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    itens.forEach(item => {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
        img.alt = isSerie ? item.name : item.title;
        container.appendChild(img);
    });
}

function preencheSeries(containerId, series) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    series.forEach(serie => {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${serie.poster_path}`;
        img.alt = serie.name;
        container.appendChild(img);
    });
}


function procuraFilme() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim() !== "") {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(termo)}`;
    }
}
