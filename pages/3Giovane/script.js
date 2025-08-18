document.getElementById('suporteBtn').addEventListener('click', function() {
    const subject = encodeURIComponent("Solicitação de Suporte");
    const body = encodeURIComponent("Olá, preciso de ajuda com...");
    window.location.href = `mailto:giovane.campanha@escola.pr.gov.br?subject=${subject}&body=${body}`;
});