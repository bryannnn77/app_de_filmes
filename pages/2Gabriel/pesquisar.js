window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const termo = params.get('q');
    if (termo) {
        document.getElementById('campo-busca').value = termo;
        buscaFilme(termo);
    }
    document.querySelector('.busca-caixa button').onclick = function() {
        const novoTermo = document.getElementById('campo-busca').value;
        if (novoTermo.trim() !== "") {
            window.location.href = `pesquisar.html?q=${encodeURIComponent(novoTermo)}`;
        }
    };
};

function abreModal(item) {
    const modal = document.getElementById('modal-detalhes');
    const titulo = document.getElementById('modal-titulo');
    const descricao = document.getElementById('modal-descricao');
    const trailerContainer = document.getElementById('modal-trailer');
    const indicadoresContainer = document.getElementById('modal-indicadores');
    const botaoFavorito = document.getElementById('botao-favorito');

    titulo.textContent = item.title;
    descricao.textContent = item.overview || 'Sem descrição disponível';

    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const isFavorito = favoritos.some(fav => fav.id === item.id && fav.tipo === item.tipo);
    botaoFavorito.textContent = isFavorito ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos';
    botaoFavorito.dataset.id = item.id;
    botaoFavorito.dataset.tipo = item.tipo;
    botaoFavorito.dataset.posterPath = item.poster_path || '';
    botaoFavorito.classList.toggle('favoritado', isFavorito);

    async function carregaTrailer() {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/${item.tipo === 'Filme' ? 'movie' : 'tv'}/${item.id}/videos?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
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
            const res = await fetch(`https://api.themoviedb.org/3/${item.tipo === 'Filme' ? 'movie' : 'tv'}/${item.id}?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR`);
            const data = await res.json();
            indicadoresContainer.innerHTML = '';
            const avaliacao = document.createElement('p');
            avaliacao.textContent = `⭐ ${data.vote_average?.toFixed(1) || 'N/A'}/10`;
            indicadoresContainer.appendChild(avaliacao);
            const dataLancamento = document.createElement('p');
            dataLancamento.textContent = `📅 ${item.tipo === 'Filme' ? data.release_date : data.first_air_date || 'N/A'}`;
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
}

function fechaModal() {
    document.getElementById('modal-detalhes').style.display = 'none';
}

function toggleFavorito() {
    const botaoFavorito = document.getElementById('botao-favorito');
    const id = botaoFavorito.dataset.id;
    const tipo = botaoFavorito.dataset.tipo;
    const titulo = document.getElementById('modal-titulo').textContent;
    const posterPath = botaoFavorito.dataset.posterPath || '';
    const poster = posterPath ? `https://image.tmdb.org/t/p/w200${posterPath}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem';

    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    console.log('Favoritos antes:', favoritos);
    const index = favoritos.findIndex(fav => fav.id === Number(id) && fav.tipo === tipo); 
    console.log('Index encontrado:', index);

    if (index === -1) {
        const novoFavorito = { id: Number(id), tipo, titulo, poster, data: new Date().toISOString().split('T')[0] };
        favoritos.push(novoFavorito);
        botaoFavorito.textContent = 'Remover dos Favoritos';
        botaoFavorito.classList.add('favoritado');
        console.log('Adicionado:', novoFavorito);
    } else {
        favoritos.splice(index, 1);
        botaoFavorito.textContent = 'Adicionar aos Favoritos';
        botaoFavorito.classList.remove('favoritado');
        console.log('Removido:', { id, tipo });
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    console.log('Favoritos após:', favoritos);
}

async function buscaFilme(termo) {
    const filmesURL = `https://api.themoviedb.org/3/search/movie?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&query=${encodeURIComponent(termo)}`;
    const seriesURL = `https://api.themoviedb.org/3/search/tv?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&query=${encodeURIComponent(termo)}`;

    try {
        const [filmesRes, seriesRes] = await Promise.all([fetch(filmesURL), fetch(seriesURL)]);
        const [filmesData, seriesData] = await Promise.all([filmesRes.json(), seriesRes.json()]);
        const container = document.getElementById('lista-resultados');
        container.innerHTML = '';

        const todos = [
            ...filmesData.results.map(f => ({
                id: f.id,
                title: f.title,
                poster_path: f.poster_path,
                overview: f.overview,
                data: f.release_date,
                tipo: 'Filme'
            })),
            ...seriesData.results.map(s => ({
                id: s.id,
                title: s.name,
                poster_path: s.poster_path,
                overview: s.overview,
                data: s.first_air_date,
                tipo: 'Série'
            }))
        ];

        if (todos.length === 0) {
            container.innerHTML = '<p class="sem-resultados">Nenhum resultado encontrado.</p>';
            return;
        }

        todos.forEach(item => {
            const div = document.createElement('div');
            div.className = 'filme-caixa';
            div.innerHTML = `
                <img src="${item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : 'https://via.placeholder.com/200x300?text=Sem+Imagem'}" alt="${item.title}" style="cursor: pointer;">
                <h3>${item.title}</h3>
                <p>${item.tipo} • ${item.data ? item.data.substring(0, 4) : 'N/A'}</p>
            `;
            div.querySelector('img').addEventListener('click', () => abreModal(item));
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        document.getElementById('lista-resultados').innerHTML = '<p class="erro-busca">Ocorreu um erro ao buscar os dados. Tente novamente.</p>';
    }
}