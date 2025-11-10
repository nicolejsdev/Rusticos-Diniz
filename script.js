document.addEventListener('DOMContentLoaded', function() {

    // ===============================================
    // FUNÇÃO PARA POPULAR A SEÇÃO #TODOS COM TODOS OS PROJETOS
    // (MANTIDA COMENTADA, conforme seu código original)
    // ===============================================
    
    /*
    function popularSecaoTodos() {
        const secaoTodos = document.getElementById('todos');
        const galeriaTodos = secaoTodos ? secaoTodos.querySelector('.galeria') : null;

        if (!galeriaTodos) return;

        // Linha original: APAGAVA suas 106 imagens. Comentamos para usar as imagens do HTML.
        // galeriaTodos.innerHTML = ''; 

        // Seleciona todas as galerias de produtos, EXCLUINDO a galeria dentro da própria #todos
        const todasGaleiras = document.querySelectorAll('.page-section .galeria:not(#todos .galeria)');

        todasGaleiras.forEach(galeria => {
            const cartoes = galeria.querySelectorAll('.cartao-projeto');
            
            cartoes.forEach(cartao => {
                // Clona o cartão (deep: true)
                const cartaoClonado = cartao.cloneNode(true);
                
                // Adiciona a cópia na galeria da seção #todos
                galeriaTodos.appendChild(cartaoClonado);
            });
        });
    }
    */

    // ===============================================
    // VARIÁVEIS GLOBAIS
    // ===============================================
    const menuLateral = document.getElementById('menuLateral');
    const abrirMenuBtn = document.getElementById('abrirMenuBtn');
    const fecharMenuBtn = document.getElementById('fecharMenuBtn');
    // Usada para fechar o submenu ao navegar para outra seção
    const submenu = document.querySelector('.submenu'); 
    const modal = document.getElementById("modal-madeira"); 
    const allPageSections = document.querySelectorAll('.page-section'); 
    
    
    // ===============================================
    // 1. LÓGICA DE NAVEGAÇÃO E EXIBIÇÃO DE SEÇÕES (Ajuste Final de Fluxo)
    // ===============================================
    function navigateToSection(hash) {
        
        // 1. Oculta todas as seções
        allPageSections.forEach(section => {
            section.classList.remove('active');
        });

        // 2. Fecha tudo (Modal, Menu Principal e Submenu)
        // CRÍTICO: Fecha o modal antes de qualquer navegação
        if (modal) modal.style.display = "none";
        if (menuLateral) menuLateral.classList.remove('menu-aberto');
        
        // CORREÇÃO CRÍTICA: Se o submenu estiver aberto, feche-o!
        if (submenu) submenu.classList.remove('mostrar'); 


        // 3. Ativa a nova seção
        const sectionId = hash.startsWith('#') ? hash : `#${hash}`;
        const targetSection = document.querySelector(sectionId);
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // ===============================================
            // CÓDIGO CRÍTICO: Abre o modal se for a seção Orçamento
            // ===============================================
            if (sectionId === '#orcamento' && modal) {
                // Usamos setTimeout para garantir que a transição da seção seja iniciada
                setTimeout(() => {
                    // Abre o modal com display 'flex' ou 'block' (use o que seu CSS usa para centralizar)
                    modal.style.display = 'flex'; 
                }, 100); // Pequeno atraso para garantir que a seção carregue
            }
            // ===============================================
        }
        
        // Atualiza a URL (opcional, mas bom para histórico)
        window.history.pushState(null, null, hash);
    }
    
    // A - NAVEGAÇÃO INICIAL
    const initialHash = window.location.hash || '#home';
    navigateToSection(initialHash);

    // B - LIDA COM CLIQUES NOS LINKS DO MENU 
    document.querySelectorAll('#menuLateral a[href^="#"]').forEach(anchor => {
        
        anchor.addEventListener('click', function (e) {
            
            const hash = this.getAttribute('href');
            
            // --- 1. TRATAMENTO DE LINKS ESPECIAIS (NÃO NAVEGÁVEIS) ---
            
            // Link Catálogo: Apenas alterna o submenu (Solução robusta)
            if (hash === '#catalogo') {
                e.preventDefault();
                
                // CRÍTICO: Usa 'this.nextElementSibling' para encontrar o submenu correto.
                const catalogoSubmenu = this.nextElementSibling; 
                
                if (catalogoSubmenu && catalogoSubmenu.classList.contains('submenu')) {
                    catalogoSubmenu.classList.toggle('mostrar');
                }
                return; // IMPEDE que o JS tente navegar como uma seção
            }
            
            // --- 2. NAVEGAÇÃO PARA SEÇÕES PADRÃO (Home, Sobre, Orçamento, Contato, Todos, Categorias) ---
            e.preventDefault(); 
            navigateToSection(hash); 
        });
    });

    // ===============================================
    // 2. LÓGICA DO MENU LATERAL (SIDEBAR)
    // ===============================================

    if (abrirMenuBtn && menuLateral) {
        abrirMenuBtn.onclick = function() {
            menuLateral.classList.add('menu-aberto');
        };
    }

    if (fecharMenuBtn && menuLateral) {
        fecharMenuBtn.onclick = function() {
            menuLateral.classList.remove('menu-aberto');
        };
    }
    
    // ===============================================
    // 3. LÓGICA DO MODAL (Janela Pop-up)
    // ===============================================
    const closeButton = document.querySelector(".close-button");
    
    if (closeButton && modal) {
        closeButton.onclick = function() {
            modal.style.display = "none";
        };
    }

    if (modal) {
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }
    // NOVO: Fechar modal com tecla ESC
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
    // 5. LÓGICA DOS CARROSSÉIS DE PRODUTO
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
                if (dots[index]) {
                    dots[index].classList.add('active');
                }
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
            
            if (nextBtn) {
                nextBtn.addEventListener('click', nextImage);
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', prevImage);
            }
            
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
// 6. LÓGICA DE ENVIO DO FORMULÁRIO PARA WHATSAPP
// ===============================================

const orcamentoForm = document.getElementById('orcamentoForm');
const whatsappNumber = "5531993170196"; // <-- SUBSTITUA PELO SEU NÚMERO (Apenas dígitos!)

if (orcamentoForm) {
    orcamentoForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o envio padrão do formulário

        // Coleta os valores dos campos
        const nome = document.getElementById('nome-orcamento').value;
        const email = document.getElementById('email-orcamento').value;
        const telefone = document.getElementById('telefone-orcamento').value;
        const tipo = document.getElementById('tipo').value;
        const madeira = document.getElementById('madeira').value;
        const ambiente = document.getElementById('ambiente').value;
        const detalhes = document.getElementById('detalhes').value;

        const quebraLinha = '%0A';

        let mensagem = `*🚨 NOVO PEDIDO DE ORÇAMENTO RÚSTICOS DINIZ 🚨*${quebraLinha}${quebraLinha}`;
        mensagem += `*Nome:* ${nome}${quebraLinha}`;
        mensagem += `*Email:* ${email}${quebraLinha}`;
        mensagem += `*Telefone:* ${telefone || 'Não Informado'}${quebraLinha}${quebraLinha}`;
        mensagem += `*Detalhes do Projeto:*${quebraLinha}`;
        mensagem += `  - Tipo: ${tipo || 'Não Informado'}${quebraLinha}`;
        mensagem += `  - Madeira Preferida: ${madeira || 'Não Informado'}${quebraLinha}`;
        mensagem += `  - Ambiente: ${ambiente || 'Não Informado'}${quebraLinha}${quebraLinha}`;
        mensagem += `*Descrição/Dimensões:*${quebraLinha}${detalhes}${quebraLinha}${quebraLinha}`;
        mensagem += `A foto de referência deve ser enviada após esta mensagem.`;

        const urlMensagem = encodeURIComponent(mensagem);
        const url = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${urlMensagem}`;

        window.open(url, '_blank');
        orcamentoForm.reset();
    });
}

    // ===============================================
    // 7. CHAMADAS FINAIS DE FUNÇÃO (EXECUÇÃO)
    // ===============================================

    // Chama a função para iniciar todos os carrosséis
    initializeCarousels();

    // Se a função popularSecaoTodos for descomentada, ela deve ser chamada aqui:
    // if (typeof popularSecaoTodos === 'function') { popularSecaoTodos(); }


}); // <--- FECHAMENTO FINAL DO document.addEventListener
