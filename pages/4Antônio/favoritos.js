function procuraFilme() {
    const termo = document.getElementById('campo-busca').value;
    if (termo.trim() !== "") {
        window.location.href = `pesquisar.html?q=${encodeURIComponent(termo)}`;
    }
}

function abreModal(item) {
    const modal = document.getElementById('modal-detalhes');
    const titulo = document.getElementById('modal-titulo');
    const descricao = document.getElementById('modal-descricao');
    const trailerContainer = document.getElementById('modal-trailer');
    const indicadoresContainer = document.getElementById('modal-indicadores');
    const botaoFavorito = document.getElementById('botao-favorito');

    titulo.textContent = item.titulo;
    descricao.textContent = item.overview || 'Sem descrição disponível';
    botaoFavorito.dataset.id = item.id;
    botaoFavorito.dataset.tipo = item.tipo;

    trailerContainer.innerHTML = '<div class="loading">Carregando trailer...</div>';
    indicadoresContainer.innerHTML = '<div class="loading">Carregando informações...</div>';

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
    let favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    const index = favoritos.findIndex(fav => fav.id === Number(id) && fav.tipo === tipo);

    if (index !== -1) {
        favoritos.splice(index, 1);
        botaoFavorito.textContent = 'Adicionar aos Favoritos';
        botaoFavorito.classList.remove('favoritado');
        carregaFavoritos();
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
}

function carregaFavoritos() {
    const container = document.getElementById('lista-favoritos');
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    container.innerHTML = '';

    if (favoritos.length === 0) {
        container.innerHTML = '<p class="sem-resultados">Nenhum favorito adicionado.</p>';
        return;
    }

    favoritos.forEach(item => {
        const div = document.createElement('div');
        div.className = 'filme-caixa';
        const dataFormatada = item.data ? new Date(item.data).toLocaleDateString('pt-BR') : 'N/A';
        div.innerHTML = `
            <img src="${item.poster || 'https://via.placeholder.com/200x300?text=Sem+Imagem'}" alt="${item.titulo}" style="cursor: pointer;">
            <h3>${item.titulo}</h3>
            <p>${item.tipo} • ${dataFormatada}</p>
        `;
        div.querySelector('img').addEventListener('click', () => abreModal(item));
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', carregaFavoritos);