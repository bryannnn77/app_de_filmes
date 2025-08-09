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

    titulo.textContent = isSerie ? item.name : item.title;
    descricao.textContent = item.overview || 'Sem descrição disponível';
    
    async function carregaTrailer() {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${isSerie ? 'tv' : 'movie'}/${item.id}/videos?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
            const data = await res.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            if (trailer) {
                trailerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allowfullscreen></iframe>`;
            } else {
                trailerContainer.innerHTML = '<p>Trailer não disponível.</p>';
            }
        } catch (error) {
            trailerContainer.innerHTML = '<p>Erro ao carregar trailer.</p>';
        }
    }

    async function carregaIndicadores() {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${isSerie ? 'tv' : 'movie'}/${item.id}?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
            const data = await res.json();
            
            indicadoresContainer.innerHTML = '';
            
            // Adiciona avaliação
            const avaliacao = document.createElement('p');
            avaliacao.textContent = `⭐ ${data.vote_average.toFixed(1)}/10`;
            indicadoresContainer.appendChild(avaliacao);
            
            // Adiciona data de lançamento
            const dataLancamento = document.createElement('p');
            dataLancamento.textContent = `📅 ${isSerie ? data.first_air_date : data.release_date}`;
            indicadoresContainer.appendChild(dataLancamento);
            
            // Adiciona gêneros
            const generos = document.createElement('p');
            generos.textContent = `🎭 ${data.genres.map(g => g.name).join(', ')}`;
            indicadoresContainer.appendChild(generos);
            
        } catch (error) {
            indicadoresContainer.innerHTML = '<p>Erro ao carregar informações adicionais.</p>';
        }
    }

    carregaTrailer();
    carregaIndicadores();

    modal.style.display = 'flex';
}

function fechaModal() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

function voltarParaInicio() {
    // Mostra todas as seções novamente
    document.getElementById('secao-filmes-novidade').style.display = 'block';
    document.getElementById('secao-filmes-desenho').style.display = 'block';
    document.getElementById('secao-series-novidade').style.display = 'block';
    document.getElementById('secao-series-desenho').style.display = 'block';
    document.getElementById('secao-filmes-famosos').style.display = 'block';
    document.getElementById('secao-series-famosas').style.display = 'block';
    
    // Recarrega os filmes e séries originais
    carregaFamosos();
    carregaNovidade();
    carregaDesenho();
    carregaSeriesFamosas();
    carregaSeriesNovidade();
    carregaSeriesDesenho();
}

document.addEventListener('DOMContentLoaded', () => {
    carregaFaixa();
    carregaNovidade();
    carregaFamosos();
    carregaDesenho();
    carregaSeriesFamosas();
    carregaSeriesNovidade();
    carregaSeriesDesenho();

    // Adiciona evento de clique para os gêneros
    document.querySelectorAll('[data-genre]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const genreFilme = link.getAttribute('data-genre');
            const genreSerie = link.getAttribute('data-genre-serie');
            carregaPorGenero(genreFilme, genreSerie);
        });
    });

    // Adiciona evento de clique para o botão "Filmes & Séries"
    document.querySelector('.voltar-inicio').addEventListener('click', (e) => {
        e.preventDefault();
        voltarParaInicio();
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
    faixa.addEventListener('click', () => abreModal(destaque));
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
    preencheFilmes('series-famosas', dataSeries.results, true);
}

function preencheFilmes(containerId, itens, isSerie = false) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    itens.forEach(item => {
        const img = document.createElement('img');
        img.src = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
        img.alt = isSerie ? item.name : item.title;
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => abreModal(item, isSerie));
        container.appendChild(img);
    });
}

function preencheSeries(containerId, series) {
    preencheFilmes(containerId, series, true);
}

function procuraFilme() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim() !== "") {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(termo)}`;
    }
}