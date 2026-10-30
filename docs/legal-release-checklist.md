# Checklist interno de privacidade — Kynovra Deals

Não definir `NEXT_PUBLIC_PRIVACY_NOTICE_APPROVED=true`, não habilitar IDs de
analytics e não publicar as páginas legais como definitivas até concluir estes
itens:

- [ ] Confirmar nome civil do controlador pessoa física e os dados de
  identificação/contato que devem ser divulgados; localidade informada: Natal,
  RN. Não adicionar CNPJ.
- [ ] Testar o recebimento e o atendimento manual em `contato@kynovra.digital`.
- [ ] Conferir com a Netlify quais dados técnicos e logs esta configuração
  processa, quem pode acessá-los e os prazos de retenção.
- [ ] Definir e documentar a base legal aplicável aos logs técnicos e ao registro
  local da preferência de consentimento.
- [ ] Confirmar os períodos de retenção por categoria, inclusive mensagens,
  logs e dados configurados no GA4/Meta.
- [ ] Documentar destinos, finalidade, papéis dos fornecedores e mecanismo
  válido para transferências internacionais envolvendo Netlify, Google, Meta e
  Mercado Livre, conforme aplicável.
- [ ] Se os IDs forem configurados, validar os cookies/identificadores e os
  respectivos prazos efetivamente criados em produção.
- [ ] Revisar o texto final e o fluxo de consentimento; só então preencher os
  resumos públicos de retenção, logs e transferências, configurar o nome civil
  e marcar o aviso como aprovado.
- [ ] Fazer revisão jurídica final antes de remover o aviso de documento
  preliminar e liberar indexação das rotas legais.
