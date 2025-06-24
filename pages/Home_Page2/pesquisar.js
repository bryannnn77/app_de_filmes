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
    const url = `https://api.themoviedb.org/3/search/movie?api_key=673e3727601cd851fa4802daf03edfeb&language=pt-BR&query=${encodeURIComponent(termo)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('lista-resultados');
            container.innerHTML = '';
            if (data.results && data.results.length > 0) {
                data.results.forEach(filme => {
                    const div = document.createElement('div');
                    div.className = 'filme-caixa';
                    div.innerHTML = `
                        <img src="https://image.tmdb.org/t/p/w200${filme.poster_path}" alt="${filme.title}">
                        <h3>${filme.title}</h3>
                        <p>${filme.release_date ? filme.release_date.substring(0,4) : ''}</p>
                    `;
                    container.appendChild(div);
                });
            } else {
                container.innerHTML = '<p>Nenhum filme encontrado.</p>';
            }
        });
}