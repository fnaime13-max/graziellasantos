# Graziella Santos · Nutricionista (São José dos Campos/SP)

Um site estático (HTML, CSS e JS, sem build) com a identidade "Laranja em movimento". Partiu da prévia `localhost:3000/p/1WMA3t77VQHU-v2`, que é igual à de graziella-santos-nutricionista-clinica.felixdias.com.

- `js/config.js`: WhatsApp, CRN e nota do Google.
- `js/laranja.js`: a laranja das 4 especialidades. Clique num gomo para ver a especialidade; o clique solta gotas de suco, a laranja inclina na direção do mouse e a folha da logo balança.
- `js/main.js`: o loader (a logo enche de suco de 0 a 100% e a folha brota), a lista do Cantinho dos estudos com filtros e o formulário que abre o WhatsApp.
- `assets/logo-*.png`: a logo oficial (D:/video nitio/Logo Nutricional Graziella Santos.png) recortada; folha e laranja estão em camadas separadas.
- `qa/shots.cjs`: tira prints com o Playwright.

Pendências:
- Confirmar o CRN. A logo diz 75690/P, mas a foto e os posts dizem 75590. O site usa CRN-3 75590/P.
- Preços: o post de Gerontologia tem Clínica R$220 e Home Care R$300, e a tabela tem convênios (Aussel, Campo Vale, Prestomed, Solumedi, 33 Doctor). Preço é permitido (CFN 856/2026), mas ainda não está no site.
- Também atende no Centro Médico Sudeste (post 44). Falta confirmar se entra no site.
- As fotos do topo e do Sobre parecem montadas com IA. O CFN pede que o uso de IA seja declarado.
