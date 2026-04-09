# AuriPlan — Guia de Funcionalidades

## 1. Dashboard

Tela inicial do app após login.

- **Projetos Recentes** — grid com os últimos 10 projetos acessados, thumbnail, data, área
- **Favoritos** — projetos marcados com estrela
- **Templates rápidos** — atalho para abrir galeria de templates
- **Estatísticas** — total de projetos, área total planejada, horas de trabalho
- **Ações rápidas** — Novo Projeto, Importar, Escanear cômodo

---

## 2. Editor 2D

Interface principal para desenho de plantas baixas.

### Ferramentas (Toolbar lateral)
| Atalho | Ferramenta | Descrição |
|---|---|---|
| `V` | Selecionar | Clica, arrasta e edita elementos |
| `H` | Pan | Move a câmera da vista |
| `W` | Parede | Desenha paredes clicando pontos |
| `R` | Cômodo | Desenha polígono de cômodo |
| `D` | Porta | Adiciona porta em parede existente |
| `J` | Janela | Adiciona janela em parede existente |
| `M` | Medida | Cria dimensão com cota |
| `Ctrl+Z` | Desfazer | Histórico ilimitado |
| `Ctrl+Y` | Refazer | Avança no histórico |
| `Ctrl+S` | Salvar | Salva projeto |
| `Ctrl+K` | Command Palette | Busca global de ações |

### Grid e Snap
- **Grid**: ligável/desligável, tamanho configurável (0.1m a 2m)
- **Snap to Grid**: alinha movimentos à grade
- **Snap to Objects**: alinha a pontos de outros elementos
- **Snap to Wall**: encaixa paredes nas extremidades de outras

### Visualizações
- **2D**: vista superior tradicional
- **3D**: modelo tridimensional (ver seção 3D)
- **Split**: lado a lado 2D e 3D simultâneos

---

## 3. Visualizador 3D

Renderização em Three.js com React Three Fiber.

- **Câmera Orbital** — rotação, zoom, pan via mouse
- **Materiais PBR** — pisos, paredes, móveis com texturas realistas
- **Iluminação** — luz ambiente + direcional configuráveis
- **Sombras** — sombras em tempo real (WebGL)
- **Export OBJ** — exporta modelo 3D completo
- **Qualidade** — baixo/médio/alto configurável (Settings)

---

## 4. Assistente IA

Geração de plantas por linguagem natural.

### Como usar
1. Abrir via botão "IA" na toolbar ou `Ctrl+K` → "Assistente IA"
2. Digitar a descrição: _"Criar apartamento de 2 quartos, cozinha americana, 60m²"_
3. O AI interpreta → gera paredes, cômodos, portas e janelas automaticamente
4. Preview interativo antes de aplicar
5. Botão "Aplicar ao Projeto" confirma as alterações

### Comandos Suportados
- Criar cômodos por tipo (quarto, sala, cozinha, banheiro, etc.)
- Definir dimensões em metros quadrados ou metros lineares
- Posicionamento relativo ("quarto ao norte da sala")
- Templates rápidos: "Apartamento Studio", "Casa 3Q", "Escritório Open Space"
- Conformidade **ABNT NBR 15575** — dimensões mínimas por tipo

---

## 5. Catálogo de Móveis

Biblioteca com 500+ itens em 15 categorias.

### Categorias
- Sala de Estar (sofás, mesas, poltronas, estantes)
- Quarto (camas, guarda-roupas, criados, cômodas)
- Cozinha (armários, bancadas, eletrodomésticos)
- Banheiro (sanitários, pias, box)
- Escritório (mesas, cadeiras, estantes, filing)
- Externo (jardim, piscina, deck)
- ...e mais 9 categorias

### Funcionalidades
- **Busca full-text** — filtra por nome e categoria
- **Favoritos** — salva itens para acesso rápido
- **Arraste para canvas** — posicionamento intuitivo
- **Rotação** — girar com alça ou campo de entrada numérica
- **Redimensionamento** — alças nos cantos, mantém proporção opcional

---

## 6. Scanner AR

Digitalização automática de cômodos físicos.

### Fluxo
1. Clicar "Escanear" (botão flutuante no canvas ou na toolbar)
2. Selecionar câmera (câmera do dispositivo ou webcam)
3. Apontar para o cômodo — guias na tela orientam o ângulo correto
4. Scanner detecta paredes, portas e janelas automaticamente
5. Preview gerado — confirmar ou ajustar antes de aplicar
6. Cômodo adicionado à planta com dimensões reais

### Fallback (Desktop)
- Se câmera não disponível, oferece upload de foto
- Análise por Computer Vision da imagem enviada

---

## 7. Tour Virtual

Navegação imersiva 360° pelo projeto.

- **Modo câmera** — perspectiva de pessoa dentro do ambiente
- **Hotspots** — pontos de navegação clicáveis entre cômodos
- **Controles** — mouse para olhar em volta, WASD para mover
- **Visualização de materiais** — mesmos PBR do modo 3D
- **Export de fotos 360°** — captura frames para compartilhar

---

## 8. Templates

Galeria de plantas prontas para começar rapidamente.

### Categorias
- Apartamentos (Studio, T1, T2, T3, cobertura)
- Casas (térrea, sobrado, geminada)
- Comercial (escritório, loja, restaurante)
- Especiais (flat, kitnet, loft)

### Uso
- Preview antes de carregar
- Aplicar ao projeto atual (substitui) ou criar novo projeto
- Personalizar após carregar

---

## 9. Sistema de Orçamento

Estimativa automática de custos baseada no projeto.

### O que é calculado
- **Materiais de construção** — piso, tinta, revestimentos (por m²)
- **Mão de obra** — instalação por tipo de serviço (por m² ou hora)
- **Móveis e decoração** — catálogo de preços do mobiliário adicionado
- **Contingência** — percentual configurável (padrão 15%)
- **Total geral** — BRL/USD configurável

### Exportar Orçamento
- PDF com logo, detalhamento por categoria, totais
- CSV para importar em planilhas
- Compartilhar link do orçamento (junto com o projeto)

---

## 10. Sistema de Compartilhamento

Compartilhar projeto com clientes ou colaboradores.

### Opções de Link
- **Link público** — qualquer pessoa com o link visualiza
- **Link com senha** — requer senha para acessar
- **Link com expiração** — válido por X dias
- **Link de edição** — concede papel de editor

### Controle de Acesso
| Papel | Pode visualizar | Pode editar | Pode compartilhar |
|---|---|---|---|
| Proprietário | ✓ | ✓ | ✓ |
| Editor | ✓ | ✓ | — |
| Visualizador | ✓ | — | — |

---

## 11. Export

Exportar o projeto em múltiplos formatos.

| Formato | Conteúdo | Uso |
|---|---|---|
| PDF | Planta baixa com cotas, escala, título | Impressão, envio a clientes |
| PNG | Captura da vista atual (2D ou 3D) | Compartilhar imagem |
| SVG | Planta vetorial editável | Editar no Illustrator/Figma |
| OBJ | Modelo 3D completo | Importar em Blender, SketchUp |

---

## 12. Auto-Save

- Projeto salvo automaticamente a cada **30 segundos**
- Indicador visual discreto no título ("Salvo há 2min")
- Manual: `Ctrl+S` ou botão "Salvar" na toolbar
- Histórico de versões via `localStorage` (últimas 10 versões)

---

## 13. Histórico (Undo/Redo)

- **Ilimitado** durante a sessão
- Cada ação é um Command Object no histórico
- `Ctrl+Z` — desfazer
- `Ctrl+Y` ou `Ctrl+Shift+Z` — refazer
- Indicadores de undo/redo na toolbar mostram disponibilidade

---

## 14. Command Palette

Interface de busca global. Ativar com `Ctrl+K`.

- Busca ações: "Salvar", "Undo", "Adicionar parede", "Abrir templates"
- Busca elementos: nomes de cômodos, móveis inseridos
- Atalhos de teclado exibidos ao lado de cada ação
- Categorias: Ferramentas, Arquivo, Visualização, Módulos

---

## 15. Configurações

Painel de preferências do usuário e do projeto.

| Seção | Opções |
|---|---|
| Interface | Tema (escuro/claro/sistema), idioma (PT/EN) |
| Grade | Tamanho, visibilidade, cor |
| Snap | Ativar/desativar por tipo (grid, objeto, parede) |
| Renderização | Qualidade 3D (baixo/médio/alto), sombras, AO |
| Unidades | Métrico/Imperial, moeda (BRL/USD/EUR) |
| Atalhos | Visualizar mapa completo de atalhos |

---

## 16. Colaboração em Tempo Real

Editar junto com clientes ou colegas de equipe.

### Como Usar
1. Clicar "Colaborar" na toolbar
2. Copiar o link de convite
3. Convidar por e-mail ou link
4. Participantes entram com papel definido

### Funcionalidades
- **Cursores ao vivo** — ver onde cada usuário está
- **Presença** — lista de usuários online com cores únicas
- **Papéis** — Proprietário, Editor, Visualizador
- **Link protegido** — opcional com senha
- **Demo mode** — simulação local sem backend necessário

### Ativação WebSocket Real
Configure `VITE_WS_URL=wss://seu-servidor/collab` para habilitar colaboração real entre dispositivos.
