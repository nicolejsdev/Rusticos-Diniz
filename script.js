
document.addEventListener('DOMContentLoaded', function () {
    // ===============================================
    // VARIÁVEIS GLOBAIS
    // ===============================================
    const menuLateral = document.getElementById('menuLateral');
    const abrirMenuBtn = document.getElementById('abrirMenuBtn');
    const fecharMenuBtn = document.getElementById('fecharMenuBtn');
    const submenu = document.querySelector('.submenu'); 
    const modal = document.getElementById("modal-madeira"); 
    const allPageSections = document.querySelectorAll('.page-section'); 

    // ===============================================
    // 1. NAVEGAÇÃO ENTRE SEÇÕES (POSSÍVEL CAUSA DO PROBLEMA DAS ABAS)
    // ===============================================
    function navigateToSection(hash) {
        // Remove a classe 'active' de todas as seções
        allPageSections.forEach(section => section.classList.remove('active'));
        
        // Esconde o modal, fecha o menu lateral e esconde o submenu
        if (modal) modal.style.display = "none";
        if (menuLateral) menuLateral.classList.remove('menu-aberto');
        if (submenu) submenu.classList.remove('mostrar'); // <--- Linha importante para fechar o submenu

        const sectionId = hash.startsWith('#') ? hash : `#${hash}`;
        const targetSection = document.querySelector(sectionId);

        if (targetSection) {
            targetSection.classList.add('active');
            if (sectionId === '#orcamento' && modal) {
                setTimeout(() => {
                    modal.style.display = 'flex';
                }, 100);
            }
        }

        window.history.pushState(null, null, hash);
    }

    const initialHash = window.location.hash || '#home';
    navigateToSection(initialHash);

    document.querySelectorAll('#menuLateral a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hash = this.getAttribute('href');
            
            // LÓGICA ESPECÍFICA PARA O LINK '#catalogo'
            if (hash === '#catalogo') {
                e.preventDefault(); // Previne a navegação
                const catalogoSubmenu = this.nextElementSibling;
                if (catalogoSubmenu && catalogoSubmenu.classList.contains('submenu')) {
                    catalogoSubmenu.classList.toggle('mostrar'); // Apenas mostra/esconde o submenu
                }
                return; // Pára aqui, NÃO executa navigateToSection
            }
            
            // LÓGICA PARA TODOS OS OUTROS LINKS (INCLUINDO 'Todos os Produtos' se for um link direto)
            e.preventDefault();
            navigateToSection(hash); // Navega e FECHA o submenu (dentro da função)
        });
    });

    // ===============================================
    // 2. MENU LATERAL
    // ===============================================
    if (abrirMenuBtn && menuLateral) {
        abrirMenuBtn.onclick = () => menuLateral.classList.add('menu-aberto');
    }
    if (fecharMenuBtn && menuLateral) {
        fecharMenuBtn.onclick = () => menuLateral.classList.remove('menu-aberto');
    }

    // ===============================================
    // 3. MODAL
    // ===============================================
    const closeButton = document.querySelector(".close-button");
    if (closeButton && modal) {
        closeButton.onclick = () => modal.style.display = "none";
    }
    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });

    // ===============================================
    // 4. SLIDESHOW DO CABEÇALHO
    // ===============================================
    const headerSlides = document.querySelectorAll('.header-slideshow-container .slide'); 
    let currentHeaderSlide = 0; 

    function nextHeaderSlide() {
        if (headerSlides.length === 0) return;
        headerSlides[currentHeaderSlide].classList.remove('active');
        currentHeaderSlide = (currentHeaderSlide + 1) % headerSlides.length;
        headerSlides[currentHeaderSlide].classList.add('active');
    }

    if (headerSlides.length > 0) {
        headerSlides[0].classList.add('active');
        setInterval(nextHeaderSlide, 5000); 
    }

    // ===============================================
    // 5. CARROSSÉIS DE PRODUTO
    // ===============================================
    function initializeCarousels() {
        const carrosseis = document.querySelectorAll('.carrossel-container');
        carrosseis.forEach(container => {
            const imagensContainer = container.querySelector('.carrossel-imagens'); 
            if (!imagensContainer) return; 
            const imagens = imagensContainer.querySelectorAll('a');
            const prevBtn = container.querySelector('.anterior-btn'); 
            const nextBtn = container.querySelector('.proximo-btn'); 
            const dots = container.querySelectorAll('.dot');
            let currentIndex = 0;

            if (imagens.length <= 1) {
                if (prevBtn) prevBtn.style.display = 'none';
                if (nextBtn) nextBtn.style.display = 'none';
                dots.forEach(dot => dot.style.display = 'none');
                if (imagens.length === 1) {
                    imagensContainer.style.transform = 'translateX(0)';
                }
                return; 
            }

            function showImage(index) {
                currentIndex = index; 
                const offset = -currentIndex * 100; 
                imagensContainer.style.transform = `translateX(${offset}%)`;
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[index]) dots[index].classList.add('active');
            }

            function nextImage(e) {
                if (e) e.preventDefault(); 
                currentIndex = (currentIndex + 1) % imagens.length;
                showImage(currentIndex);
            }

            function prevImage(e) {
                if (e) e.preventDefault(); 
                currentIndex = (currentIndex - 1 + imagens.length) % imagens.length; 
                showImage(currentIndex);
            }

            if (nextBtn) nextBtn.addEventListener('click', nextImage);
            if (prevBtn) prevBtn.addEventListener('click', prevImage);
            dots.forEach((dot, index) => {
                dot.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    showImage(index);
                });
            });

            showImage(currentIndex);
        });
    }

    // ===============================================
// 6. FORMULÁRIO PARA WHATSAPP (VERSÃO SEGURA CONTRA ERROS DE ID)
// ===============================================
const orcamentoForm = document.getElementById('orcamentoForm');
const whatsappNumber = "5531993170196";

if (orcamentoForm) {
    orcamentoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // **ALTERAÇÃO AQUI:** Usando encadeamento opcional e verificação simples
        const getVal = (id) => document.getElementById(id)?.value || 'Não Informado/Faltante';

        const nome = getVal('nome-orcamento');
        const email = getVal('email-orcamento');
        const telefone = getVal('telefone-orcamento');
        const tipo = getVal('tipo');
        const madeira = getVal('madeira');
        const ambiente = getVal('ambiente');
        const detalhes = getVal('detalhes');

        // ... O resto do código permanece o mesmo
        
        const quebraLinha = '%0A';
        let mensagem = `*🚨 NOVO PEDIDO DE ORÇAMENTO RÚSTICOS DINIZ 🚨*${quebraLinha}${quebraLinha}`;
        mensagem += `*Nome:* ${nome}${quebraLinha}`;
        mensagem += `*Email:* ${email}${quebraLinha}`;
        mensagem += `*Telefone:* ${telefone}${quebraLinha}${quebraLinha}`; // Use 'telefone' aqui, pois já está tratado
        mensagem += `*Detalhes do Projeto:*${quebraLinha}`;
        mensagem += `  - Tipo: ${tipo}${quebraLinha}`;
        mensagem += `  - Madeira Preferida: ${madeira}${quebraLinha}`;
        mensagem += `  - Ambiente: ${ambiente}${quebraLinha}${quebraLinha}`;
        mensagem += `*Descrição/Dimensões:*${quebraLinha}${detalhes}${quebraLinha}${quebraLinha}`;
        mensagem += `A foto de referência deve ser enviada após esta mensagem.`;

        const urlMensagem = encodeURIComponent(mensagem);
        const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${urlMensagem}`;

        window.open(url, '_blank');
        orcamentoForm.reset();
    });
}

    // ===============================================
    // 7. EXECUÇÃO FINAL
    // ===============================================
    initializeCarousels();
    // if (typeof popularSecaoTodos === 'function') { popularSecaoTodos(); } // <-- MANTENHA COMENTADA SE A FUNÇÃO NÃO EXISTE!
});
