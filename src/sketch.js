
// * --- CONFIGURAÇÕES DO USUÁRIO ---
/** @type {number} @const */
const cellSize = 70;

/** @type {number} @const */
const cols = 12;

/** @type {number} @const */
const rows = 9;

/** @type {number} @const */
const delayTime = 100;

// * --- VARIÁVEIS GLOBAIS DO PROJETO ---
let foodImg, agentImg;
let grid;
let agent, food;
let startTime;

let visitedCells;
let visitedIndex;

let pathCells;
let pathIndex;

let frontierCells;
let frontierIndex;

let steppedCells;
let steppedIndex;

let snapshots;
let snapshotIndex;

let currentGameState;
let pathToFood;
let searchRegistry;
let lootedFood;

function preload() {
    // * Precarregamento das imagens que serão utilizadas na comida e no saqueador
    agentImg = loadImage('src/img/saqueador3.png');
    foodImg = loadImage('src/img/marmita.png');
}

function createPair() {
    const validSpots = [];

    // 1. Percorre o grid uma vez para encontrar todos os locais válidos
    for (let y = 0; y < grid.rows; y++) {
        for (let x = 0; x < grid.cols; x++) {
            if (grid.grid[y][x].terrain.name !== 'obstacle') {
                validSpots.push({ x, y });
            }
        }
    }

    // 2. Se não houver nenhum local válido, avisa e retorna null
    if (validSpots.length === 0) {
        console.error("ERRO: Não existe nenhum local válido no grid para criar o agente!");
        return null;
    }

    // 3. Escolhe um local aleatório da lista de locais válidos
    const spotAgent = random(validSpots);
    const newValidSpots = validSpots.filter(spot => spot !== spotAgent);
    const spotFood = random(newValidSpots);

    // 4. Cria e retorna o par
    return [ new Agent(spotAgent.x, spotAgent.y, cellSize, agentImg), new Food(spotFood.x, spotFood.y, cellSize, foodImg)];
}

function setup() {
    // * Para que o número de grid seja um número natural:
    createCanvas(cols*cellSize, rows*cellSize);

    grid = new Grid(cols, rows, cellSize);
    console.log(`Tamanho do Canvas em Pixels: ${width}w x ${height}h`);
    console.log(`Tamanho do Grid em Células: ${cols} colunas - ${rows} linhas, total: ${cols*rows} células`);
    console.log(`Tamanho da Célula: ${cellSize} pixeis`);

    // Cria food e agent em células válidas para não ocorrer de nascer em cima de um obstáculo por exemplo
    [ agent, food ] = createPair();

    startTime = millis();
    visitedCells = new Set();
    visitedIndex = 0;
    pathCells = new Set();
    pathIndex = 0;
    frontierCells = new Set();
    frontierIndex = 0;
    steppedCells = new Set();
    steppedIndex = 0;
    snapshots = [];
    snapshotIndex = 0;
    currentGameState = 0;
    pathToFood = [];
    searchRegistry = {};
    lootedFood= 0;

}

function drawSet(set, r = null, g = null, b = null, a = null, img = null, rotate = null) {
    // console.log(set);
    if (img && rotate) {
        push();
        imageMode(CENTER);
        for (let item of set) {
            translate(item.x, item.y);
            rotate(rotate);
            image(img, 0, 0, cellSize, cellSize);
        }
        pop();
        return;
    }

    if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number' && typeof a === 'number') {
        noStroke()
        fill(r, g, b, a);
        for (let item of set) {
            console.log(item);
            rect(item.x * cellSize, item.y * cellSize, cellSize, cellSize);
        }
    }
}

function draw() {
    console.log(`currentGameState ${currentGameState}`);

    if (currentGameState == 0) {

        // ! Agente vai procurar uma rota até a comida
        searchRegistry = uniformCostSearch(grid, agent.node(grid), food.node(grid));
        snapshots = searchRegistry.gridHistory;
        pathToFood = searchRegistry.finalPath;
        console.log(searchRegistry);
        if (pathToFood.length !== 0) {
            currentGameState = 1;
        } else {
            console.log("Erro no pathToFood!");
        }

    } else if (currentGameState == 1) {

        // ! Animação da busca

        if (millis() - startTime > delayTime) {
            grid.draw();
            
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    
                    let cell = snapshots[snapshotIndex].grid[j][i];

                    // Percorre toda a matriz do snapshot para verificar qual celula já foi explorada
                    if (cell.state === 'frontier') {
                        if (!frontierCells.has(cell)) { frontierCells.add(cell); }
                        // if (visitedCells.has(cell)) { visitedCells.delete(cell); }
                    } else if (cell.state === 'visited') {
                        if (!visitedCells.has(cell)) { visitedCells.add(cell); }
                        if (frontierCells.has(cell)) { frontierCells.delete(cell); }
                    }
                }
            }

            drawSet(frontierCells, 255, 0, 0, 100);
            drawSet(visitedCells, 255, 255, 0, 100);

            snapshotIndex++;
            if (snapshotIndex >= snapshots.length) {
                currentGameState = 2;
            }
            startTime = millis();
        }

    } else if (currentGameState == 2) {
        
        // ! Animação do caminho
        
        if (millis() - startTime > delayTime) {
            grid.draw();

            let cell = pathToFood[pathIndex];

            // Percorre toda a lista do path para pintar o caminho
            if (!pathCells.has(cell)) { pathCells.add(cell); }
            if (visitedCells.has(cell)) { visitedCells.delete(cell); }
            if (frontierCells.has(cell)) { frontierCells.delete(cell); }

            drawSet(frontierCells, 255, 0, 0, 100);
            drawSet(visitedCells, 255, 255, 0, 100);
            drawSet(pathCells, 255, 255, 255, 100);

            pathIndex++;
            if (pathIndex >= pathToFood.length) {
                currentGameState = 3;
            }
            startTime = millis();
        }
    
    } else if (currentGameState == 3) {

        // ! Agente vai andar até a comida

        if (millis() - startTime > delayTime) {
            grid.draw();
            drawSet(frontierCells, 255, 0, 0, 100);
            drawSet(visitedCells, 255, 255, 0, 100);
            drawSet(pathCells, 255, 255, 255, 100);
            
            if (!agent.isMoving) {
                agent.setPath(pathToFood);
            }
            if (agent.path.length > 0 && !agent.isMoving) {
                // Se o caminho tinha algo E o agente parou de se mover, ele chegou.
                currentGameState = 4;
            }
            startTime = millis();
        }

    } else if (currentGameState == 4) {

        // ! Agente chegou na comida

        lootedFood++;
        console.log(`Comidas Saqueadas: ${lootedFood}`);

        [ _, food ] = createPair();

        currentGameState = 0;
        frontierCells.clear();
        visitedCells.clear();
        pathCells.clear();
        frontierIndex = 0;
        visitedIndex = 0;
        pathIndex = 0;
        snapshotIndex = 0;
        pathToFood = [];
        searchRegistry = {};
    }

    food.show();
    agent.update();
    agent.show();

}

// * --- FUNÇÕES DE CONVERSÃO ---
function pixelToGrid(pixel) {
    return floor(pixel / cellSize);
}

function gridToPixel(gridIndex) {
    return (gridIndex * cellSize) + (cellSize / 2);
}

//! APENAS PARA TESTE DA ANIMAÇÃO !!! APAGAR PARA PRODUÇÃO !!!
/**
 * Gera a matriz de terreno usando Ruído de Perlin para um resultado mais natural.
 * @returns {Array<Array<number>>} A matriz 2D do terreno.
 */
function generateTerrain() {
    let grid = [];
    const noiseScale = 0.3;

    for (let i = 0; i < cols; i++) {
        grid[i] = []; // Cria a coluna
        for (let j = 0; j < rows; j++) {
            // Pega um valor do Ruído de Perlin (entre 0 e 1)
            let noiseValue = noise(i * noiseScale, j * noiseScale);

            // Mapeia o valor do ruído para um tipo de terreno
            if (noiseValue < 0.3) {
                grid[i][j] = -1; // Obstáculo (20% de chance)
            } else if (noiseValue < 0.5) {
                grid[i][j] = 2; // Água (20% de chance)
            } else if (noiseValue < 0.8) {
                grid[i][j] = 1; // Atoleiro (20% de chance)
            } else {
                grid[i][j] = 0; // Areia (30% de chance)
            }
        }
    }
    return grid;
}

//! APENAS PARA TESTE DA ANIMAÇÃO !!! APAGAR PARA PRODUÇÃO !!!
/**
 * Cria uma sequência de matrizes (snapshots) mostrando a exploração do mapa.
 * Simula uma "névoa de guerra" sendo revelada passo a passo.
 * @returns {Array<Array<Array<number>>>} Um array de matrizes 2D de exploração.
 */
function initializeExplored() {
    // 1. Começa com uma matriz onde nada foi explorado (tudo 0)
    let exploredGrid = [];
    for (let i = 0; i < cols; i++) {
        exploredGrid[i] = [];
        for (let j = 0; j < rows; j++) {
            exploredGrid[i][j] = 0;
        }
    }

    // Array para guardar cada passo da exploração
    let snapshots = [];
    // Adiciona o estado inicial (mapa todo inexplorado) como o primeiro snapshot
    snapshots.push(exploredGrid.map(row => [...row]));

    // --- Parâmetros para customizar a geração ---
    const numRegions = floor(random(2, 5)); // Gera de 2 a 4 regiões de exploração
    const maxExplorationRatio = 0.4; // Explora no máximo 40% do mapa
    const expansionChance = 0.75; // 75% de chance de se expandir para um vizinho

    let exploredCount = 0;
    const maxExploredCells = cols * rows * maxExplorationRatio;

    // 2. Para cada região que queremos criar...
    for (let i = 0; i < numRegions; i++) {
        if (exploredCount >= maxExploredCells) break;

        // Escolhe um ponto de partida aleatório que ainda não foi explorado
        let startX, startY;
        do {
            startX = floor(random(cols));
            startY = floor(random(rows));
        } while (exploredGrid[startX][startY] === 1);

        // A "fila" de células que precisamos visitar para expandir
        let queue = [{ x: startX, y: startY }];
        exploredGrid[startX][startY] = 1;
        exploredCount++;
        // Tira um snapshot após marcar o ponto inicial
        snapshots.push(exploredGrid.map(row => [...row]));

        // 3. Loop de expansão (algoritmo de inundação/BFS)
        while (queue.length > 0 && exploredCount < maxExploredCells) {
            let current = queue.shift();

            const neighbors = [
                { x: current.x, y: current.y - 1 }, // Cima
                { x: current.x, y: current.y + 1 }, // Baixo
                { x: current.x - 1, y: current.y }, // Esquerda
                { x: current.x + 1, y: current.y }  // Direita
            ];

            for (const neighbor of neighbors) {
                if (neighbor.x >= 0 && neighbor.x < cols && neighbor.y >= 0 && neighbor.y < rows) {
                    if (exploredGrid[neighbor.x][neighbor.y] === 0) {
                        if (random() < expansionChance) {
                            exploredGrid[neighbor.x][neighbor.y] = 1;
                            exploredCount++;
                            queue.push(neighbor);
                            
                            // *** A MUDANÇA PRINCIPAL ESTÁ AQUI ***
                            // A cada célula explorada, salvamos uma cópia do estado atual do grid.
                            // `map(row => [...row])` cria uma cópia profunda para que o snapshot não mude depois.
                            snapshots.push(exploredGrid.map(row => [...row]));
                        }
                    }
                }
            }
        }
    }

    // Agora, a função retorna o array com todos os snapshots
    return snapshots;
}

//! APENAS PARA TESTE DA ANIMAÇÃO !!! APAGAR PARA PRODUÇÃO !!!
/**
 * Função temporária para calcular um caminho simples (ortogonal).
 * No futuro, será substituída pelos algoritmos de busca (A*, BFS, etc.).
 * @param {p5.Vector} startPos Posição inicial no grid.
 * @param {p5.Vector} endPos Posição final no grid.
 * @returns {Array<p5.Vector>} Um array de vetores representando o caminho.
 */
function calculateSimplePath(startPos, endPos) {
    let tempPath = [];
    let currentPos = startPos.copy();
    let safetyBreak = 0; // Evita loops infinitos

    while (currentPos.dist(endPos) > 0 && safetyBreak < (cols * rows)) {
        const diff = p5.Vector.sub(endPos, currentPos);

        if (abs(diff.x) > abs(diff.y)) {
            currentPos.x += Math.sign(diff.x);
        } else {
            currentPos.y += Math.sign(diff.y);
        }
        
        // A MUDANÇA: Em vez de adicionar o objeto p5.Vector (currentPos.copy()),
        // adicionamos um objeto simples com as propriedades x e y.
        tempPath.push([currentPos.x, currentPos.y]);
        
        safetyBreak++;
    }
    return tempPath;
}


/**
 * Gera um número aleatório entre min e max (inclusivo).
 * @param {number} min O valor mínimo.
 * @param {number} max O valor máximo.
 * @returns {number} Um número inteiro aleatório.
 */
function gerarIntAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Cria um conjunto (array) de objetos com coordenadas aleatórias.
 * @returns {Array<{x: number, y: number}>} Um array de objetos de coordenadas.
 */
function gerarConjuntoDeCoordenadas() {
  // 1. Define quantos objetos o conjunto terá (de 1 a 80).
  const quantidade = gerarIntAleatorio(1, 80);
  const conjunto = [];

  // 2. Cria cada objeto com coordenadas aleatórias e o adiciona ao array.
  for (let i = 0; i < quantidade; i++) {
    const ponto = {
      x: gerarIntAleatorio(0, 12), // Gera x entre 0 e 12
      y: gerarIntAleatorio(0, 9),  // Gera y entre 0 e 9
    };
    conjunto.push(ponto);
  }

  return conjunto;
}