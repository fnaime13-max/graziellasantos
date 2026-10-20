/* Tudo que a Graziella pode querer trocar fica aqui. */
window.CONFIG = {
  nome: 'Graziella Santos',
  whatsapp: '5512991581505',
  crn: 'CRN-3 75590/P',
  cidade: 'São José dos Campos/SP',
  google: { nota: '5,0', total: 54 },
  mensagem: 'Olá, Graziella! Vi seu site e gostaria de agendar uma consulta.'
};

window.linkWA = function (msg) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensagem);
};
