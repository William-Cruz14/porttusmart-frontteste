// Toggle do menu mobile
document.querySelector('.mobile-toggle').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('active');
});

// Fechar o menu ao clicar em um item (apenas mobile)
if (window.innerWidth <= 900) {
    document.querySelectorAll('.subitem').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.remove('active');
        });
    });
}

// Adicionar classe active aos itens clicados
document.querySelectorAll('.menu-fixed .item, .subitem').forEach(item => {
    item.addEventListener('click', function() {
        // Remover active de todos os itens do mesmo grupo
        const parent = this.closest('.menu-fixed') || this.closest('.submenu');
        if (parent) {
            parent.querySelectorAll('.active').forEach(activeItem => {
                activeItem.classList.remove('active');
            });
        }
        
        // Adicionar active ao item clicado
        this.classList.add('active');
    });
});

// Prevenir que cliques nos labels fechem o menu mobile
document.querySelectorAll('label').forEach(label => {
    label.addEventListener('click', function(e) {
        if (window.innerWidth <= 900) {
            e.stopPropagation();
        }
    });
});

// Adicionar event listener para redimensionamento da janela
window.addEventListener('resize', function() {
    // Se a largura da janela for maior que 900px, garantir que o menu lateral esteja visível
    if (window.innerWidth > 900) {
        document.querySelector('.sidebar').classList.remove('active');
    }
});