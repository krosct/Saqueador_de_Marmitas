# Documentação Técnica: Saqueador de Marmitas
###### *Code documentation*
---
<br>
<br>
<br>


# 📜 Sumário
- [1. Arquitetura e Módulos Principais 🏗️](#1-arquitetura-e-módulos-principais-️)
  - [1.1. Grid.js - O Ambiente 🗺️](#11-gridjs---o-ambiente-️)
  - [1.2. Node.js - A Célula 🧱](#12-nodejs---a-célula-)
  - [1.3. Agent.js - O Agente 🤖](#13-agentjs---o-agente-)
  - [1.4. Food.js - O Objetivo 🎯](#14-foodjs---o-objetivo-)
  - [1.5. terrain.js - As Regras do Terreno ⛰️](#15-terrainjs---as-regras-do-terreno-️)
- [2. Módulos de Algoritmos 🧠](#2-módulos-de-algoritmos-)
  - [2.1. search.js 🔍](#21-searchjs-)
  - [2.2. heuristics.js 📏](#22-heuristicsjs-)
- [3. Fluxo de Execução Principal (sketch.js) 🚀](#3-fluxo-de-execução-principal-sketchjs-)
  - [Ciclo Principal 🔄](#ciclo-principal-)
  - [Fluxo de Exceção (Arrastar Objeto) ⚠️](#fluxo-de-exceção-arrastar-objeto-️)

---

# 1. Arquitetura e Módulos Principais 🏗️
Esta seção detalha as "APIs" internas do sistema, descrevendo as classes e suas principais funcionalidades.

## 1.1. Grid.js - O Ambiente 🗺️
Gerencia o mapa do jogo.

* **Construtor:** `new Grid(cols, rows, cellSize)`
    * `cols` (number): Número de colunas.
    * `rows` (number): Número de linhas.
    * `cellSize` (number): Tamanho de cada célula em pixels.

* **Exemplo de Uso:**
    ```javascript
    // Cria um novo grid com 12 colunas, 9 linhas e células de 70x70 pixels.
    const myGrid = new Grid(12, 9, 70);
    ```

* **Métodos Principais:**
    * `generateMap()`: Preenche o grid com objetos `Node`, utilizando ruído de Perlin para criar uma distribuição de terrenos natural.
    * `getNeighbors(node)`: Retorna um array de `Nodes` vizinhos válidos (não-obstáculos) a um nó específico. Essencial para os algoritmos de busca.
        * **Exemplo de Uso:**
            ```javascript
            // Supondo que 'startNode' é um objeto Node na posição (5, 5)
            // e não está cercado por obstáculos.
            const neighbors = myGrid.getNeighbors(startNode);

            // Retorno Esperado (exemplo, a ordem pode variar):
            // [ Node(5, 6), Node(5, 4), Node(6, 5), Node(4, 5) ]
            ```
    * `getNode(x, y)`: Retorna o objeto `Node` nas coordenadas (x, y) do grid.
        * **Exemplo de Uso:**
            ```javascript
            const specificNode = myGrid.getNode(3, 4);

            // Retorno Esperado:
            // O objeto Node localizado na coluna 3, linha 4.
            // Node { x: 3, y: 4, terrain: { name: 'sand', ... }, ... }
            ```
    * `draw()`: Renderiza o estado visual de cada célula no canvas.

## 1.2. Node.js - A Célula 🧱
A unidade fundamental do grid.

* **Propriedades:**
    * `x`, `y` (number): Coordenadas no grid.
    * `terrain` (object): Referência a um tipo de terreno definido em `terrain.js`.
    * `state` (string): Estado visual do nó (`'default'`, `'frontier'`, `'visited'`, `'path'`).

* **Propriedades de Busca:**
    * `parent` (Node): Nó pai no caminho encontrado. Usado para reconstruir o caminho.
    * `g` (number): Custo do caminho desde o nó inicial até este nó.
    * `h` (number): Custo heurístico estimado deste nó até o objetivo.
    * `f` (number): Custo total (`g + h`).

## 1.3. Agent.js - O Agente 🤖
Controla o personagem que se move pelo grid.

* **Construtor:** `new Agent(gridX, gridY, size, img)`
    * `gridX`, `gridY` (number): Posição inicial no grid.
    * `size` (number): Tamanho de renderização em pixels.
    * `img` (p5.Image): Imagem do agente.

* **Exemplo de Uso:**
    ```javascript
    let agentImage;
    function preload() {
      agentImage = loadImage('path/to/agent.png');
    }

    function setup() {
      const myAgent = new Agent(1, 1, 70, agentImage);
    }
    ```

* **Métodos Principais:**
    * `setPath(newPath)`: Recebe um array de `Nodes` (o caminho) e inicia o estado de movimento.
        * **Exemplo de Uso:**
            ```javascript
            // 'pathToFood' é um array de Nodes retornado por um algoritmo de busca
            // Ex: [ Node(1,1), Node(1,2), Node(2,2) ]
            myAgent.setPath(pathToFood);

            // Efeito: myAgent.isMoving se torna true. O agente começará a se mover
            // no próximo chamado de myAgent.update().
            ```
    * `update(speed)`: Atualiza a posição visual do agente a cada frame, interpolando suavemente (lerp) entre sua posição atual e o próximo nó no caminho. A velocidade final é ajustada com base no custo do terreno do nó de destino.
        * **Exemplo de Uso:**
            ```javascript
            // Dentro do loop draw() do p5.js
            function draw() {
              // ...
              myAgent.update(0.2); // 0.2 é a velocidade base
              // Efeito: A propriedade visual 'pixelPos' do agente é atualizada
              // para se aproximar do próximo nó no caminho definido.
            }
            ```
    * `setPosition(gridX, gridY)`: Define instantaneamente a posição lógica e visual do agente.
        * **Exemplo de Uso:**
            ```javascript
            myAgent.setPosition(10, 8);
            // Efeito: O agente é "teleportado" instantaneamente para a
            // célula do grid (10, 8), tanto lógica quanto visualmente.
            ```
    * `show()`: Desenha o agente no canvas.

## 1.4. Food.js - O Objetivo 🎯
Objeto simples que serve como alvo para o agente. Sua funcionalidade é um subconjunto da classe `Agent`, focada em posição e renderização.

## 1.5. terrain.js - As Regras do Terreno ⛰️
Define os tipos de terreno como um objeto `Terrain` congelado (`Object.freeze`), funcionando como um Enum.

* **Tipos de Terreno:**
    * **SAND:** Custo 1.
    * **SWAMP:** Custo 5.
    * **WATER:** Custo 10.
    * **OBSTACLE:** Custo `Infinity`, `isObstacle: true`.

# 2. Módulos de Algoritmos 🧠
Esta seção detalha as funções de busca, que são o cérebro da simulação.

## 2.1. search.js 🔍
Fornece as implementações dos algoritmos. Todas as funções de busca seguem um padrão de retorno consistente.

* **Formato do Retorno:**
    ```javascript
    {
      finalPath: [Node, Node, ...], // Array de nós do início ao fim. Vazio se não houver caminho.
      gridHistory: [Grid, Grid, ...] // Array de "snapshots" do grid em cada passo da busca.
    }
    ```
* **Exemplo de Uso:**
    ```javascript
    const startNode = myGrid.getNode(1, 1);
    const goalNode = myGrid.getNode(10, 8);

    const result = uniformCostSearch(myGrid, startNode, goalNode);

    // Estrutura esperada de 'result':
    // {
    //   finalPath: [ Node(1,1), Node(1,2), ..., Node(10,8) ],
    //   gridHistory: [ Grid_Snapshot_1, Grid_Snapshot_2, ... ]
    // }
    // Onde cada Grid_Snapshot é uma cópia do objeto Grid
    // representando um passo da exploração do algoritmo.
    ```
* **Endpoints (Funções):**
    * `uniformCostSearch(initialGrid, startNode, goalNode)`: Encontra o caminho com o menor custo acumulado, considerando os valores de `terrain.cost`.
    * `greedyBestFirstSearch(initialGrid, startNode, goalNode, heuristic)`: Expande o nó que parece estar mais perto do objetivo, conforme determinado pela função de `heuristic`. Não garante o caminho ótimo.
    * `reconstructPath(node)`: Função auxiliar que percorre os ponteiros `parent` a partir do `goalNode` para construir o `finalPath`.
        * **Exemplo de Uso:**
            ```javascript
            // 'goalNode' é o nó final retornado por uma busca bem-sucedida,
            // que agora contém a propriedade 'parent' preenchida recursivamente.
            const path = reconstructPath(goalNode);

            // Retorno Esperado:
            // [ Node_inicial, ..., Node_final ]
            ```

## 2.2. heuristics.js 📏
Fornece funções de cálculo de distância.

* `manhattanDistance(nodeA, nodeB)`: Calcula a distância em um grid onde apenas movimentos horizontais e verticais são permitidos.
    * **Exemplo de Uso:**
        ```javascript
        const nodeA = { x: 2, y: 3 };
        const nodeB = { x: 5, y: 7 };
        const distance = manhattanDistance(nodeA, nodeB);
        // Retorno Esperado: 7 ( |5-2| + |7-3| = 3 + 4 )
        ```
* `euclideanDistance(nodeA, nodeB)`: Calcula a distância em linha reta entre dois nós.
    * **Exemplo de Uso:**
        ```javascript
        const nodeA = { x: 0, y: 0 };
        const nodeB = { x: 3, y: 4 };
        const distance = euclideanDistance(nodeA, nodeB);
        // Retorno Esperado: 5 ( sqrt(3^2 + 4^2) = sqrt(25) )
        ```

# 3. Fluxo de Execução Principal (sketch.js) 🚀
O `sketch.js` gerencia a simulação através de uma máquina de estados controlada pela variável `currentGameState`.

## Ciclo Principal 🔄

* **Estado 0: Buscando Rota**
    1.  O algoritmo selecionado na UI é executado.
    2.  O resultado (`finalPath` e `gridHistory`) é armazenado na variável global `searchRegistry`.
    3.  Se um caminho é encontrado, o estado avança para 1.

* **Estado 1: Animando a Busca**
    1.  O `gridHistory` (snapshots) é percorrido e desenhado frame a frame, mostrando a exploração do algoritmo (fronteira e nós visitados).
    2.  Ao final da animação, o estado avança para 2.

* **Estado 2: Animando o Caminho**
    1.  O `finalPath` é desenhado passo a passo, mostrando o caminho final encontrado.
    2.  Ao final, o estado avança para 3.

* **Estado 3: Movimentando o Agente**
    1.  O método `agent.setPath(pathToFood)` é chamado.
    2.  A cada frame, `agent.update()` é chamado para mover o agente visualmente ao longo do caminho.
    3.  Quando o agente chega ao destino, o estado avança para 4.

* **Estado 4, 5 e 6: Coleta e Reinício**
    1.  O contador de comida (`lootedFood`) é incrementado.
    2.  Um novo objeto `Food` é criado em uma posição válida aleatória.
    3.  As variáveis de estado são resetadas, e o ciclo retorna ao **Estado 0**.

## Fluxo de Exceção (Arrastar Objeto) ⚠️

* **Estado 99: Arrastando**
    1.  Quando o usuário clica e arrasta o agente, o estado muda para 99.
    2.  Isso pausa o ciclo principal, permitindo que a posição do agente siga o mouse.
    3.  Ao soltar o mouse, a nova posição é validada. Se for válida, o agente é movido. O estado do jogo então avança para 6 para preparar um novo ciclo de busca a partir da nova posição.