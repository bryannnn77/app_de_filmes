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

function buscaFilme(termo) {
    const filmesURL = `https://api.themoviedb.org/3/search/movie?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&query=${encodeURIComponent(termo)}`;
    const seriesURL = `https://api.themoviedb.org/3/search/tv?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&query=${encodeURIComponent(termo)}`;

    Promise.all([fetch(filmesURL), fetch(seriesURL)])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(([filmesData, seriesData]) => {
            const container = document.getElementById('lista-resultados');
            container.innerHTML = '';

            const todos = [
                ...filmesData.results.map(f => ({ 
                    id: f.id,
                    title: f.title, 
                    poster_path: f.poster_path, 
                    data: f.release_date, 
                    tipo: 'Filme' 
                })),
                ...seriesData.results.map(s => ({ 
                    id: s.id,
                    title: s.name, 
                    poster_path: s.poster_path, 
                    data: s.first_air_date, 
                    tipo: 'Série' 
                }))
            ];

            if (todos.length === 0) {
                container.innerHTML = '<p>Nenhum resultado encontrado.</p>';
                return;
            }

            todos.forEach(item => {
                const div = document.createElement('div');
                div.className = 'filme-caixa';
                div.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.tipo} • ${item.data ? item.data.substring(0, 4) : ''}</p>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar dados:", error);
            document.getElementById('lista-resultados').innerHTML = '<p>Ocorreu um erro ao buscar os dados. Tente novamente.</p>';
        });
}
