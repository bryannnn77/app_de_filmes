function abreMenu() {
    document.getElementById("menu").style.left = "0";
    document.getElementById("fundo-sidebar").style.display = "block";
}

function fechaMenu() {
    document.getElementById("menu").style.left = "-250px";
    document.getElementById("fundo-sidebar").style.display = "none";
}

function abreModal(item, isSerie = false) {
    const modal = document.getElementById('modal-detalhes');
    const titulo = document.getElementById('modal-titulo');
    const descricao = document.getElementById('modal-descricao');
    const trailerContainer = document.getElementById('modal-trailer');
    const indicadoresContainer = document.getElementById('modal-indicadores');
    const botaoFavorito = document.getElementById('botao-favorito');

    const tipo = isSerie ? 'Série' : 'Filme';
    titulo.textContent = isSerie ? item.name : item.title;
    descricao.textContent = item.overview || 'Sem descrição disponível';

    // Configurar botão de favorito
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const isFavorito = favoritos.some(fav => fav.id == item.id && fav.tipo === tipo);
    botaoFavorito.textContent = isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
    botaoFavorito.dataset.id = item.id;
    botaoFavorito.dataset.tipo = tipo;
    botaoFavorito.classList.toggle('favoritado', isFavorito);

    trailerContainer.innerHTML = '<div class="loading">Carregando trailer...</div>';
    indicadoresContainer.innerHTML = '<div class="loading">Carregando informações...</div>';

    async function carregaTrailer() {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${isSerie ? 'tv' : 'movie'}/${item.id}/videos?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
            const data = await res.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            trailerContainer.innerHTML = trailer
                ? `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`
                : '<p>Trailer não disponível.</p>';
        } catch (error) {
            trailerContainer.innerHTML = '<p>Erro ao carregar trailer.</p>';
        }
    }

    async function carregaIndicadores() {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${isSerie ? 'tv' : 'movie'}/${item.id}?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
            const data = await res.json();
            indicadoresContainer.innerHTML = '';
            const avaliacao = document.createElement('p');
            avaliacao.textContent = `⭐ ${data.vote_average?.toFixed(1) || 'N/A'}/10`;
            indicadoresContainer.appendChild(avaliacao);
            const dataLancamento = document.createElement('p');
            dataLancamento.textContent = `📅 ${isSerie ? data.first_air_date : data.release_date || 'N/A'}`;
            indicadoresContainer.appendChild(dataLancamento);
            const generos = document.createElement('p');
            generos.textContent = `🎭 ${data.genres?.map(g => g.name).join(', ') || 'N/A'}`;
            indicadoresContainer.appendChild(generos);
        } catch (error) {
            indicadoresContainer.innerHTML = '<p>Erro ao carregar informações adicionais.</p>';
        }
    }

    carregaTrailer();
    carregaIndicadores();
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
}

function fechaModal() {
    const modal = document.getElementById('modal-detalhes');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
}

function toggleFavorito() {
    const botaoFavorito = document.getElementById('botao-favorito');
    const id = botaoFavorito.dataset.id;
    const tipo = botaoFavorito.dataset.tipo;
    const titulo = document.getElementById('modal-titulo').textContent;
    const poster = document.querySelector(`img[alt="${titulo}"]`)?.src || 'https://via.placeholder.com/200x300?text=Sem+Imagem';

    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.findIndex(fav => fav.id === id && fav.tipo === tipo);

    if (index === -1) {
        favoritos.push({ id, tipo, titulo, poster, data: new Date().toISOString().split('T')[0] });
        botaoFavorito.textContent = 'Remover dos Favoritos';
        botaoFavorito.classList.add('favoritado');
    } else {
        favoritos.splice(index, 1);
        botaoFavorito.textContent = 'Adicionar aos Favoritos';
        botaoFavorito.classList.remove('favoritado');
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function voltarParaInicio() {
    const sections = ['secao-filmes-novidade', 'secao-filmes-desenho', 'secao-series-novidade', 'secao-series-desenho', 'secao-filmes-famosos', 'secao-series-famosas'];
    sections.forEach(id => document.getElementById(id).style.display = 'block');
    carregaFamosos();
    carregaNovidade();
    carregaDesenho();
    carregaSeriesFamosas();
    carregaSeriesNovidade();
    carregaSeriesDesenho();
}

async function carregaFaixa() {
    const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
    const data = await res.json();
    const destaque = data.results[Math.floor(Math.random() * data.results.length)];

    const faixa = document.getElementById('faixa');
    const tituloFaixa = document.getElementById('titulo-faixa');

    faixa.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${destaque.backdrop_path})`;
    tituloFaixa.textContent = destaque.title;
    faixa.addEventListener('click', () => abreModal(destaque));
}

async function carregaFamosos() {
    const container = document.getElementById('filmes-famosos');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&sort_by=revenue.desc&language=pt-BR`);
        const data = await res.json();
        preencheFilmes('filmes-famosos', data.results);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar filmes famosos.</p>';
    }
}

async function carregaNovidade() {
    const container = document.getElementById('filmes-novidade');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&vote_count.gte=500`);
        const data = await res.json();
        preencheFilmes('filmes-novidade', data.results);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar novidades.</p>';
    }
}

async function carregaDesenho() {
    const container = document.getElementById('filmes-desenho');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=16&sort_by=vote_average.desc&vote_count.gte=500`);
        const data = await res.json();
        preencheFilmes('filmes-desenho', data.results);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar animações.</p>';
    }
}

async function carregaSeriesFamosas() {
    const container = document.getElementById('series-famosas');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&sort_by=vote_average.desc&vote_count.gte=500`);
        const data = await res.json();
        preencheFilmes('series-famosas', data.results, true);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar séries famosas.</p>';
    }
}

async function carregaSeriesNovidade() {
    const container = document.getElementById('series-novidade');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
        const data = await res.json();
        preencheFilmes('series-novidade', data.results, true);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar séries novas.</p>';
    }
}

async function carregaSeriesDesenho() {
    const container = document.getElementById('series-desenho');
    container.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const res = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=16&sort_by=vote_average.desc&vote_count.gte=100&language=pt-BR`);
        const data = await res.json();
        preencheFilmes('series-desenho', data.results, true);
    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar animações em série.</p>';
    }
}

async function carregaPorGenero(genreFilme, genreSerie) {
    const sections = ['secao-filmes-novidade', 'secao-filmes-desenho', 'secao-series-novidade', 'secao-series-desenho'];
    sections.forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('secao-filmes-famosos').style.display = 'block';
    document.getElementById('secao-series-famosas').style.display = 'block';

    const filmesContainer = document.getElementById('filmes-famosos');
    filmesContainer.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const resFilmes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=${genreFilme}&sort_by=popularity.desc&vote_count.gte=500`);
        const dataFilmes = await resFilmes.json();
        preencheFilmes('filmes-famosos', dataFilmes.results);
    } catch (error) {
        filmesContainer.innerHTML = '<p>Erro ao carregar filmes por gênero.</p>';
    }

    const seriesContainer = document.getElementById('series-famosas');
    seriesContainer.innerHTML = '<div class="loading">Carregando...</div>';
    try {
        const resSeries = await fetch(`https://api.themoviedb.org/3/discover/tv?api_key=673e3727601cd851fa4802daf03edfeb&with_genres=${genreSerie}&sort_by=popularity.desc&vote_count.gte=500`);
        const dataSeries = await resSeries.json();
        preencheFilmes('series-famosas', dataSeries.results, true);
    } catch (error) {
        seriesContainer.innerHTML = '<p>Erro ao carregar séries por gênero.</p>';
    }
}

function preencheFilmes(containerId, itens, isSerie = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    itens.forEach(item => {
        const img = document.createElement('img');
        img.src = item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem';
        img.alt = isSerie ? item.name : item.title;
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => abreModal(item, isSerie));
        container.appendChild(img);
    });
}

function procuraFilme() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim() !== "") {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(termo)}`;
    }
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

    document.querySelector('.voltar-inicio').addEventListener('click', (e) => {
        e.preventDefault();
        voltarParaInicio();
    });
});