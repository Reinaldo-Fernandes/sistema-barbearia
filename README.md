# Barber Shop & Club

Landing page de alta conversão para uma barbearia moderna em Natal (RN). O objetivo é um só: fazer o visitante **agendar um horário**, pelo formulário da página (que envia o pedido por WhatsApp) ou pelo sistema de agendamento da barbearia.

Feita com HTML, CSS e JavaScript puros, sem frameworks e sem etapa de build.

<!-- Depois de publicar, troque pelos seus links e, se quiser, adicione um print em docs/preview.png -->
**Demo:** `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`

<!-- ![Preview da página](docs/preview.png) -->

## Destaques

- **Foco em conversão:** botão de agendar no cabeçalho, no hero, nos cards de serviço, na barra fixa do celular e no botão flutuante do computador.
- **Agendamento por formulário:** modal com serviço, barbeiro, data e horário, que monta a mensagem e abre o WhatsApp.
  - Bloqueia segunda e domingo (dias fechados).
  - Mostra só horários em que o serviço termina até o fechamento.
  - Esconde horários que já passaram no dia de hoje.
- **Status de funcionamento em tempo real:** "Aberto agora" ou quando a barbearia abre de novo, calculado no fuso de Natal.
- **Tabela de preços** com combo em destaque, **clube de assinatura**, diferenciais, galeria de estilos, equipe, depoimento, garantia, FAQ e mapa.
- **Mobile-first**, com CSS de ajustes para telas até 768 px.
- **SEO local:** `meta description`, Open Graph e dados estruturados (`schema.org/HairSalon`).
- **Acessibilidade:** link para pular ao conteúdo, foco visível, modal nativo `<dialog>` (fecha com Esc e prende o foco) e respeito a `prefers-reduced-motion`.
- **Imagens em WebP**, com `loading="lazy"` e dimensões declaradas.

## Estrutura do projeto

```
.
├── index.html
├── README.md
└── src
    ├── css
    │   ├── reset.css      # reset básico
    │   ├── styles.css     # design, componentes e layout
    │   └── mobile.css     # ajustes para telas até 768px
    ├── js
    │   └── script.js      # CONFIG, modal de agendamento, status de funcionamento
    └── img
        ├── barbearia.webp
        ├── barba/
        ├── cabelo/
        └── limpeza/
```

## Como rodar

Não há dependências. Escolha uma das opções:

1. **Direto no navegador:** abra o `index.html`.
2. **Servidor local (recomendado):**

   ```bash
   # com Python
   python3 -m http.server 8000

   # ou com Node
   npx serve .
   ```

   Depois acesse `http://localhost:8000`.

## Configuração

Todos os contatos e links ficam no bloco `CONFIG`, no topo de `src/js/script.js`:

```js
const CONFIG = {
  whatsapp: "5584999824438",   // código do país + DDD + número, só dígitos
  bookingUrl: "",              // link do AppBarber/Booksy (vazio = abre o formulário da página)
  instagram: "https://www.instagram.com/barbeariaestilo",
  googleUrl: "",               // link do Perfil da Empresa no Google (vazio = busca no Maps)
  mensagemPadrao: "Olá! Gostaria de agendar um horário na barbearia.",
};
```

- Com `bookingUrl` **vazio**, todos os botões "Agendar" abrem o formulário da página.
- Com `bookingUrl` **preenchido**, os botões levam direto ao seu sistema de agendamento.

Horário de funcionamento e duração dos serviços ficam logo abaixo, nos objetos `HORARIO` e `SERVICOS` do mesmo arquivo.

## O que personalizar antes de publicar

- [ ] Número de WhatsApp, Instagram e link do Google em `CONFIG`
- [ ] Nome, foto e especialidade dos barbeiros (seção `#equipe` do `index.html`)
- [ ] Fotos reais da barbearia e dos cortes (troque os arquivos em `src/img/` mantendo o nome)
- [ ] Preço e duração da limpeza de pele (hoje aparece "Consulte o valor")
- [ ] CNPJ e página de política de privacidade no rodapé (LGPD)
- [ ] Depoimentos reais com autorização dos clientes
- [ ] Antes e depois: há um bloco comentado na seção `#galeria`, com o slider já funcional, para ativar quando houver fotos reais

## Publicar no GitHub Pages

1. Envie o projeto para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde o endereço `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Os caminhos são relativos (`./src/...`), então funcionam também em subpasta. Serve igualmente para Netlify, Vercel, Hostinger ou qualquer hospedagem de arquivos estáticos.

## Tecnologias

- HTML5 semântico
- CSS3 (variáveis, Grid, Flexbox)
- JavaScript (ES6+)
- Fontes: [Barlow e Barlow Condensed](https://fonts.google.com/) (Google Fonts)
- Mapa incorporado do Google Maps

## Imagens

As fotos incluídas são provisórias e servem apenas para demonstração. Antes de usar em produção, substitua por fotos próprias da barbearia ou confirme a licença de uso das imagens.

## Licença

Defina a licença do seu projeto. Se for de uso livre, adicione um arquivo `LICENSE` (por exemplo, MIT).