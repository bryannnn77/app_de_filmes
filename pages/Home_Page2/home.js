
    function openMenu() {
        document.getElementById("menu").style.left = "0";
        document.getElementById("overlay").style.display = "block";
    }

    function closeMenu() {
        document.getElementById("menu").style.left = "-250px";
        document.getElementById("overlay").style.display = "none";
    }

    const API_KEY = '1cf50e6248dc270629e802686245c2c8';  
    const BASE_URL = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', () => {
    carregarBanner();
    carregarEstreias();
    carregarMaisVistos();
    carregarAnimacoes();

    document.querySelectorAll('[data-genre]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const genreId = link.getAttribute('data-genre');
            carregarPorGenero(genreId);
        });
    });
});

async function carregarBanner() {
    const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=1cf50e6248dc270629e802686245c2c8&language=pt-BR`);
    const data = await res.json();
    const destaque = data.results[Math.floor(Math.random() * data.results.length)];

    const banner = document.getElementById('banner');
    const bannerTitle = document.getElementById('banner-title');
    const bannerOverview = document.getElementById('banner-overview');

    banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${destaque.backdrop_path})`;
    bannerTitle.textContent = destaque.title;
    bannerOverview.textContent = destaque.overview;
}


async function carregarMaisVistos() {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=1cf50e6248dc270629e802686245c2c8&sort_by=revenue.desc&language=pt-BR`);
  const data = await res.json();
  preencherFilmes('filmes-mais-vistos', data.results);
}

async function carregarEstreias() {
    const res = await fetch(`${BASE_URL}/movie/upcoming?api_key=1cf50e6248dc270629e802686245c2c8&language=pt-BR&vote_count.gte=500`);
    const data = await res.json();
    preencherFilmes('filmes-estreias', data.results);
}


async function carregarAnimacoes() {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=1cf50e6248dc270629e802686245c2c8&with_genres=16&sort_by=vote_average.desc&vote_count.gte=500`);
    const data = await res.json();
    preencherFilmes('filmes-animacoes', data.results);
}

async function carregarPorGenero(genreId) {
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=1cf50e6248dc270629e802686245c2c8&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=500`);
    const data = await res.json();
    preencherFilmes('filmes-mais-vistos', data.results);
}

function preencherFilmes(containerId, filmes) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    filmes.forEach(filme => {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${filme.poster_path}`;
        img.alt = filme.title;
        container.appendChild(img);
    });
}


