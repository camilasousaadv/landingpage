# Camila Sousa Advocacia — versão estática

Conversão dos templates Elementor exportados (`.json`) para um site estático em
HTML5, CSS e JavaScript. Não depende de WordPress, Elementor, PHP ou banco de dados.

---

## 1. Origem dos arquivos

| JSON exportado | Título | Tipo | Convertido em |
|---|---|---|---|
| `elementor-1035-2026-09-06.json` | Header land | `header` | `components/header.html` + `assets/css/02-header.css` |
| `elementor-1077-2026-09-06.json` | Footer land | `footer` | `components/footer.html` + `assets/css/03-footer.css` |
| `elementor-1131-2026-09-06.json` | inicial | `page` | `pages/home.html` + `assets/css/06-home.css` |
| `elementor-229-2026-09-06.json` | Pop Menu | `popup` | `components/popup-menu.html` + `assets/css/04-popup.css` |

Cada bloco de HTML/CSS traz, em comentário, o ID do elemento Elementor de origem
(ex.: `#26f1a128`), para permitir conferência linha a linha com os JSONs.

---

## 2. Estrutura

```
site/
├── index.html                 página final montada (é o arquivo que se abre)
├── index.template.html        template usado para montar index.html
├── build.js                   montador (Node, sem dependências) — opcional
├── components/
│   ├── header.html            header reutilizável
│   ├── footer.html            footer reutilizável
│   └── popup-menu.html        pop-up "Pop Menu" (ID 229)
├── pages/
│   └── home.html              conteúdo da página "inicial"
└── assets/
    ├── css/
    │   ├── 01-base.css        reset + sistema de containers + widgets Elementor
    │   ├── 02-header.css
    │   ├── 03-footer.css
    │   ├── 04-popup.css
    │   ├── 05-components.css  blocos HTML customizados (copiados dos JSONs)
    │   └── 06-home.css        seções da página inicial
    ├── js/
    │   ├── main.js            sticky, pop-up, animações de entrada, ano do rodapé
    │   └── carousel.js        carrossel "Nossos Serviços" (script original)
    ├── images/                8 imagens baixadas do site de origem
    └── icons/
        └── bars.svg           ícone hambúrguer (inline no HTML)
```

`index.html` é auto-suficiente: header, página, footer e pop-up estão embutidos.
`components/` e `pages/` existem para que esses blocos tenham **uma única fonte de
verdade** ao criar novas páginas — `build.js` remonta o `index.html` a partir deles.

---

## 3. Como executar localmente

**Opção A — abrir direto (mais simples)**

Dê duplo clique em `index.html`, ou arraste-o para o navegador.
Funciona em `file://`, sem servidor.

**Opção B — servidor local** (recomendado se for adicionar páginas)

```bash
cd site
python -m http.server 8000        # ou:  npx serve .
```
Depois acesse `http://localhost:8000`.

**Regerar `index.html` após editar `components/` ou `pages/`**

```bash
cd site
node build.js
```

Requer Node.js apenas para o `build.js`. O site em si não precisa de Node.

---

## 4. Dependências externas

Duas, ambas por CDN — as mesmas que o site original carregava:

| Dependência | URL | Para quê |
|---|---|---|
| Google Fonts | `fonts.googleapis.com/css2?family=Cormorant+Garamond…` | Lora, Inter, DM Sans, Poppins, Work Sans, Cormorant Garamond |
| Font Awesome 5.15.4 | `cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css` | 9 ícones (`fa-phone-alt`, `fa-envelope`, `fa-user`, `fa-check-circle`, `fa-chevron-right`, `fa-map-marker-alt`, `fa-facebook`, `fa-instagram`, `fa-whatsapp`) e o `fa-times` do botão de fechar |

Nenhuma biblioteca JavaScript é usada — todo o JS é próprio (117 linhas) ou extraído
dos widgets HTML do projeto original.

**Para rodar 100% offline**, baixe as fontes (`.woff2`) para `assets/fonts/`, o CSS do
Font Awesome + a pasta `webfonts/` para `assets/icons/`, e troque os dois `<link>` do
`<head>` de `index.template.html` por caminhos locais.

---

## 5. Assets

Todas as imagens foram baixadas de
`https://dominio.ascorretoradeseguros.com.br/wp-content/uploads/`:

| Arquivo local | Origem | Usado em |
|---|---|---|
| `logo.png` | `2026/09/logo.png` | header (3×), footer, CTA final, pop-up |
| `bbner-cmilaa2.png` | `2026/09/` | fundo do hero (desktop) |
| `banner-ddddfs.png` | `2026/09/` | fundo do hero (tablet/mobile) + textura da seção "O que você vai aprender" |
| `banner-ctt.png` | `2026/09/` | fundo do rodapé, do CTA final e do pop-up (tablet) |
| `png-capa-2-removebg-preview.png` | `2026/09/` | mockup do e-book (tablet/mobile) |
| `img-ldpg.png` | `2026/09/` | imagem da seção "Este e-book é para você?" |
| `camilsa-pg.png` | `2026/09/` | foto do card "Quem é Camila Sousa" |
| `a243fe33-…png` | `2026/08/` | ícone/avatar nas barras dos cards (2×) |
| `bars.svg` | `2026/09/` | hambúrguer (inline no HTML) |

Deduplicações: `2026/02/logo.png` e `2026/09/logo.png` são o mesmo arquivo (MD5
idêntico); `2026/08/banner-ctt.png` e `2026/09/banner-ctt.png` também.

### ⚠️ Asset ausente

| Arquivo | Onde era usado | Situação |
|---|---|---|
| `2026/02/logo-thaygo-veloso.png` | logo do pop-up (`#30bedefc`) | **HTTP 404 no servidor de origem.** Foi usado `logo.png` como placeholder. Trata-se, além disso, de logo de outra marca (Thyago Veloso) dentro de um projeto da Camila Sousa. |

Também não é um asset real: `graphic_image` do widget `call-to-action` `#dddb51c`
apontava para o `placeholder.png` do próprio Elementor (valor padrão do controle).
Não foi renderizado — só a imagem de fundo `camilsa-pg.png`, que é o visual pretendido.

---

## 6. Responsividade

Breakpoints do Elementor (padrão, os únicos usados nos JSONs):

| Faixa | Regra |
|---|---|
| Desktop | `min-width: 1025px` |
| Tablet | `768px – 1024px` |
| Mobile | `max-width: 767px` |

As classes `hidden-desktop` / `hidden-tablet` / `hidden-mobile` reproduzem
`hide_desktop` / `hide_tablet` / `hide_mobile`. Todos os valores responsivos dos JSONs
(`*_tablet`, `*_mobile`) foram convertidos: 46 overrides de tablet e 55 de mobile.

Os blocos HTML customizados mantêm os breakpoints próprios que já tinham
(`1100px`, `980px`, `700px`, `640px`, `520px`, `480px`, `380px`) — não foram alinhados
aos do Elementor, porque isso mudaria o layout original.

### Ajustes solicitados (desvios conscientes do JSON)

Dois pontos em que o mobile foi corrigido a pedido. Ambos estão isolados em
`@media (max-width: 767px)`, então desktop e tablet seguem idênticos ao export.

1. **Links do rodapé empilhados no mobile.** No bloco exibido em tablet/mobile
   (`#6fe3b5e3`), os três subblocos — *Institucional*, *Áreas de Atuação* e
   *Serviços* — têm apenas `width_tablet` (27% / 31% / 30%) e nenhum `width_mobile`.
   Como os valores responsivos do Elementor herdam para baixo, no mobile eles ficavam
   lado a lado e espremidos. Passaram a `width: 100%`, um abaixo do outro.
   → `assets/css/03-footer.css`

   No mesmo arquivo, a coluna da marca (`#5b09e5a3` — logo, texto institucional e
   redes sociais) tinha o mesmo problema: `width_tablet: 68%` sem `width_mobile`,
   o que espremia o parágrafo em nove linhas. Também passou a `width: 100%` no mobile.

2. **Respiro lateral no CTA final.** O container `#202b69e6` não define padding
   nenhum, então a caixa arredondada (`border-radius: 30px`) encostava nas bordas da
   tela. Foram adicionados `padding-left/right: 20px` — mesmo valor que a seção
   "Conteúdo" já usa no mobile. → `assets/css/06-home.css`

   Observação: no **tablet** essa mesma caixa também vai de borda a borda, porque o
   container boxed de 1140px é mais largo que a viewport. Não foi alterado, já que o
   pedido era sobre o mobile — se quiser o mesmo respiro lá, basta estender a regra
   para `@media (max-width: 1024px)`.

   No mesmo pedido, a coluna interna `#4a9abaaa` deixou de herdar `width_tablet: 60%`
   no mobile e passou a `width: 100%`. Com 60% sobravam ~210px de conteúdo: o título
   quebrava em três linhas e o botão dourado — que tem `width: 100%` abaixo de 700px
   no CSS original do widget — era espremido em duas linhas. No tablet os 60%
   originais foram mantidos.

3. **Véu das barras do card "Dra. Camila Sousa" (seções 5 e 8).** Os containers
   `#13e2ccc`, `#99832b5`, `#43db4bc1` e `#550d2e54` definem
   `background_color: #50110454` (vinho), mas o `custom_css` deles aplica
   `background: rgba(255,255,255,0.71)` — e no Elementor o CSS customizado é impresso
   depois, então vencia, deixando texto branco sobre fundo claro e ilegível.
   Substituído por um degradê vinho → quase preto com blur:
   `linear-gradient(180deg, rgba(72,16,7,.78), rgba(20,4,2,.86))` + `blur(12px)`.
   O valor está isolado na variável `--doctor-card-veil`, em `.doctor-card`.
   → `assets/css/06-home.css`

   No mesmo pedido, o card deixou de herdar `width_tablet: 75%` no mobile e passou a
   ocupar a coluna inteira (`width: 100%` abaixo de 768px), porque sobrava margem
   demais nas laterais. No tablet os 75% originais foram mantidos.

4. **Nome "Thyago Veloso Advogados" removido.** Os cinco widgets `divider`
   (`#52652462`, `#35c98491`, `#177d5714`, `#74eff23`, `#12908441`) traziam esse texto,
   que é a marca de outro escritório. O `<span class="e-divider__text">` foi removido
   dos cinco. → `pages/home.html`

   Sem efeito colateral visual: com o separador vazio, o `width` percentual do
   divisor resolve para zero dentro do pai *shrink-to-fit*, então os três divisores do
   corpo da página continuam sem renderizar nada — exatamente como antes, quando o
   texto branco sobre fundo branco os deixava invisíveis. Nos dois dentro dos cards,
   onde o texto **aparecia** em branco, ele simplesmente sumiu.

   O único vestígio do nome no projeto é um comentário em `components/popup-menu.html`
   identificando o arquivo ausente `logo-thaygo-veloso.png` (ver §5).

5. **Cor do header: `#3f120b`** (desktop, tablet e mobile).
   → `assets/css/02-header.css`

   O `custom_css` do container `#71680671` pintava a barra grudada com
   `rgba(122,68,68,.61)`. Trocou-se **apenas o RGB**, para `rgba(63,18,11,.61)`
   (= `#3f120b`). A opacidade `0.61`, o `backdrop-filter: blur(8px)` e o resto da
   regra continuam exatamente como no JSON, então o efeito de vidro segue visível.

   O comportamento por breakpoint não mudou: em **desktop e tablet** a barra segue
   transparente sobre o hero e só ganha a cor ao grudar no topo; no **mobile** não
   existe topbar acima dela, então ela já nasce grudada e aparece colorida desde o
   scroll 0. Há uma regra extra em `@media (max-width: 767px)` aplicando a cor também
   ao estado não-sticky, só para evitar um piscar transparente antes de o JS marcar
   a classe.

   Como a opacidade original foi mantida, o tom acompanha o que está por baixo:
   escuro sobre o hero e as seções vinho, mais claro sobre os blocos brancos da
   página — é o mesmo comportamento que o `rgba(122,68,68,.61)` do JSON tinha, só que
   na cor nova. Cor absolutamente uniforme e blur visível são excludentes; se em
   algum momento a prioridade for o tom exato, basta subir a opacidade para `1`.

6. **Pop-up de menu: fundo `#3f120b` e logo de 160px centralizada.**
   → `assets/css/04-popup.css`

   A cor entrou em **dois** pontos, porque o fundo visível era a soma dos dois: o
   `background_color` do pop-up (era `#000000`) e o `background_overlay_color` do
   container `#6a5b5a2a` (era `#180000`, a 50%). Com os dois em `#3f120b` o resultado
   final é exatamente `#3f120b`.

   A logo (`#30bedefc`) tinha `width_tablet: 30%` / `width_mobile: 51%`; passou a
   `width: 160px` fixo com `text-align: center` no wrapper.

   O `background_image_tablet` (`banner-ctt.png`) foi **suprimido**: com o fundo em
   `#3f120b` a imagem cobria a cor no tablet e derrubava o contraste do texto. A
   declaração continua no arquivo, comentada, para reativar se preferir.

   ⚠️ A logo do pop-up é a única que **não** recebe `filter: brightness(0) invert(1)`
   (o `custom_css` que deixa as do header e do rodapé brancas não existe nesse
   widget no JSON). Sobre o `#3f120b`, que é mais claro que o preto anterior, ela
   ficou com pouco contraste. Se quiser a logo branca aqui também, adicione
   `filter: brightness(0) invert(1);` em `.popup-logo img`.

Comportamento por dispositivo no header, exatamente como no JSON:

* **Desktop** — topbar (contatos) + logo + menu + botão dourado
* **Tablet** — logo + hambúrguer (linha `#49ff0fd7`)
* **Mobile** — ícone de usuário (transparente) + logo + hambúrguer (linha `#1a2ab866`)

---

## 7. Funcionalidades implementadas

| Funcionalidade | Origem | Onde |
|---|---|---|
| Header sticky com fundo `rgba(122,68,68,.61)` + `blur(8px)` | `sticky: top` + `custom_css` de `#71680671` | `main.js` + `02-header.css` |
| Pop-up de menu: abrir pelo hambúrguer, overlay `#000000B3`, botão de fechar `#970101`, `slideInRight` 0.9s, trava de scroll, ESC **não** fecha | `elementor-229` `page_settings` | `main.js` + `04-popup.css` |
| Carrossel de 5 cards, 3→2→1 por breakpoint, setas com estado `disabled` | script do widget `#38c09a94` | `carousel.js` |
| Animações de entrada (`fadeIn`, `fadeInUp`, `fadeInDown`, `zoomIn`, `bounce`) disparadas ao entrar na viewport | `_animation` dos widgets | `main.js` + `01-base.css` |
| Marquee do rodapé (`carrossel 30s linear infinite`) | `custom_css` de `#59d5c922` | `03-footer.css` |
| Hover-cards (título some, descrição sobe) | `custom_css` de `#5d1e0595` / `#77db0709` | `05-components.css` |
| Ano do copyright | dynamic tag `current-date-time` (`Y`) | `main.js` |
| Hover/focus/active de botões, ícones, menu, listas e cards | valores `*_hover` dos JSONs | todos os CSS |
| Menu dropdown (estilos preservados) | `#6969fc4a` | `02-header.css` |

---

## 8. O que não pôde ser reproduzido exatamente

### 8.1 Dados que não existem nos arquivos exportados

1. **Itens do menu principal.** O widget `nav-menu` `#6969fc4a` guarda apenas o slug
   `menu-lp`; os itens ficam no banco do WordPress e **não estão em nenhum JSON**.
   Foram reconstruídos a partir do `icon-list` do pop-up (`#f38310f`), que é a versão
   mobile do mesmo menu: *Início* `#inicio` · *O que encontrar?* `#encontrar` ·
   *Para você* `#paramim` · *Conteúdo* `#conteudo` · *Quem sou?* `#quem`.
   Confira em `components/header.html` se corresponde ao menu real.

2. **Kit global do Elementor.** Não há uma única referência `__globals__` preenchida
   nos JSONs, então cores e tipografia globais não foram exportadas. Onde um valor
   dependia do kit, foi usado o padrão do Elementor, sempre anotado no CSS:
   * largura de container: **1140px**
   * espaçamento entre widgets (`gap`): **20px**
   * opacidade padrão de overlay de fundo: **0.5**
   * tag padrão de heading: **`h2`**
   * padding dos itens do menu: **13px / 16px**
   * tamanho do ícone do botão de fechar do pop-up no desktop: **20px**
     (o JSON só traz tablet 22px e mobile 17px)

3. **Gatilhos e condições de exibição do pop-up.** Ficam em metadados do WordPress.
   O único gatilho presente nos JSONs é o clique no hambúrguer (dynamic tag
   `popup` id 229), e foi esse o implementado. Não há regras de tempo, scroll ou saída.
   O campo `jedv_conditions` (JetEngine) existe no pop-up mas está **sem regra
   configurada** — nada a converter.

4. **Título da página.** O JSON traz `title: "inicial"` (nome interno) e
   `hide_title: yes`. Foi usado `<title>Camila Sousa Advocacia</title>`.

### 8.2 Aproximações técnicas

5. **Animação do "pointer" do menu.** O JSON define `animation_line: slide` e
   `pointer_color #B61B19`, mas não a largura do pointer nem o tipo (`pointer` está
   ausente). Foi implementado o padrão do Elementor: sublinhado de 3px deslizando da
   esquerda no hover. É uma reimplementação, não o CSS original do Elementor Pro.

6. **Ícone do botão de fechar do pop-up.** O Elementor usa o ícone `eicon-close`
   (fonte própria do plugin). Foi usado `fa-times` do Font Awesome — mesmo desenho
   (um "×"), fonte diferente.

7. **`_animation_mobile: fadeInUp` do carrossel (`#38c09a94`)** — animação que só
   valia no mobile. Não foi implementada; o carrossel aparece sem animação de entrada
   em todos os tamanhos.

8. **Plugins Jet.** As ~70 chaves `jet_sticky_section_*` do JSON estão todas com
   `jet_sticky_section` desligado, e `jet_parallax_layout_list` está vazio — nada
   visual a converter. O sticky que existe de fato é o do Elementor Pro (`sticky: top`),
   e esse foi reproduzido.

### 8.3 Peculiaridades do projeto original preservadas de propósito

Estes pontos parecem defeitos, mas **estão assim no projeto Elementor** e foram
mantidos conforme a instrução de não alterar o design. Cada um vem com a correção
de uma linha, caso você decida corrigir:

9. **Card "Dra. Camila Sousa" da seção 5 fica invisível.**
   O container `#5d1e0595` tem `.hover-card { overflow: hidden }` e sua primeira
   caixa (`#13e2ccc`) tem `margin-top: -89px`. Na seção 8 o container equivalente
   (`#77db0709`) começa com o widget `call-to-action` de 470px de altura, e a barra do
   título se sobrepõe corretamente ao rodapé da foto. Na seção 5 **não existe esse
   widget de imagem**, então a altura do card resulta em zero e o conteúdo é cortado.
   Só a imagem `img-ldpg.png` (irmã seguinte) aparece.
   *Correção:* adicionar uma imagem de fundo ao `.hover-card` da seção 5, ou remover
   o `margin-top: -89px` dessa instância.

10. *(corrigido a pedido — ver §6, item 3)* As barras dos cards vinham brancas
    translúcidas em vez de vinho.

11. *(corrigido a pedido — ver §6, item 4)* Cinco divisores traziam o texto
    "Thyago Veloso Advogados".

12. **Âncoras quebradas.** A página define apenas `#encontrar`, `#paramim`,
    `#conteudo` e `#quem`. Continuam sem destino, como no original:
    * `#inicio` — usado pelo pop-up e pelo menu (a seção hero não tem `_element_id`)
    * `#historia`, `#servicos`, `#podcast`, `#faq` — coluna "Institucional" do rodapé (desktop)
    * `#quemsou` — coluna "Institucional" do rodapé (tablet/mobile); o correto seria `#quem`
    *Correção:* dar `id="inicio"` à `<section class="… hero">` e ajustar os `href` em
    `components/footer.html`.

13. **Botões sem destino.** Três blocos trazem `href="link aqui botao"` (texto
    literal, placeholder do autor) e dois `href="#"`. Preservados:
    * `href="link aqui botao"` — botão do hero, botão da seção "Quem é", botão do CTA final
    * `href="#"` — botão do header, botão "Agende uma visita" do card da seção 8

    O único link real é o botão glass "AGENDE UMA VISITA" → WhatsApp.

14. **Outros textos herdados de outro projeto.** O logo do pop-up é
    `logo-thaygo-veloso.png` (arquivo inexistente, ver §5). O e-mail do rodapé, o
    endereço e os telefones são da Camila Sousa e estão corretos.

15. **Bloco de links do rodapé duplicado.** As colunas `#351cc9f3`/`#58b92a82`
    (desktop) e `#6fe3b5e3` (tablet/mobile) repetem o mesmo conteúdo com pequenas
    divergências, herdadas do original: "Assessoria Jurídica" vs "**A**cessoria
    Jurídica", e âncoras diferentes entre as duas versões. Ambas foram mantidas
    literalmente.

16. **HTML mal formado nos widgets.** O widget `#38c09a94` era um documento HTML
    completo (`<!DOCTYPE html>…</html>`) dentro de um widget, e o `#772aa8ea` tinha
    `</head>`, `</body>` e `</html>` órfãos. Foram achatados. O `<style>` global que
    vinha dentro de `#38c09a94` (`:root{--brick…}`, `body{font-family:'Inter'}`) era
    aplicado à página inteira pelo navegador — esse efeito foi preservado no topo de
    `05-components.css`.

17. **CSS repetido.** O bloco `<style>` do `.cs-btn-gold` aparecia 5 vezes nos JSONs
    (widgets `#1cfe6c9b`, `#50f8aacc`, `#574b64fe`, `#7cc26487`, `#98fad50`), o
    `.hover-card` 2 vezes e o efeito de vidro 2 vezes. Foram unificados — **sem
    nenhuma mudança nos valores**; apenas deduplicados.

18. **Rolagem para âncoras.** Não foi adicionado `scroll-behavior: smooth` nem
    `scroll-margin-top`, porque os links são âncoras nativas (`_element_id`), não o
    widget "Menu Anchor" do Elementor. O comportamento é o mesmo do original: salto
    instantâneo, com o header fixo cobrindo o topo da seção.

---

## 9. Conferência feita

A implementação foi comparada com os JSONs elemento a elemento e validada em
renderização real (Chromium headless) nas três faixas — 1440px, 900px e 500px —
incluindo o pop-up aberto. A geometria confere com os valores do Elementor:
hero em `top: -32px` (header 118px com `margin-bottom: -150px`), topbar dividida
em 50/50, colunas do rodapé em 27% / 14% / 17% / 23%, `.cta-final__inner` em 55%,
e o card da seção 5 com altura 0 (item 9 acima).
