
// * --- CONFIGURAÇÕES DO USUÁRIO ---

/** @type {number} @const */
const canvasWidthLimit = 1200; // Tamanho do canvas em pixels (eixo x). Tem que ser um número máximo divisor comum de 60 e 

/** @type {number} @const */
const defaultObjectSize = 0.85; // Tamanho padrão para os objetos.

/** @type {number} @const */
const maxObjectSize = 1; // Tamanho máximo permitido no slider.

/** @type {number} @const */
const minObjectSize = 0.2; // Tamanho mínimo permitido no slider.

/** @type {number} @const */
const defaultDelayTime = 1000; // Atraso padrão para animações (em milissegundos). Quanto maior mais rápido.

/** @type {number} @const */
const maxDelayTime = 1500; // Atraso máximo permitido no slider.

/** @type {number} @const */
const minDelayTime = 1; // Atraso mínimo permitido no slider.

/** @type {number} @const */
const defaultMapSize = 2; // Tamanho padrão do mapa.

/** @type {number} @const */
const maxMapSize = 9; // Tamanho máximo do mapa.

/** @type {number} @const */
const minMapSize = 1; // Tamanho mínimo do mapa.

// * --- IMAGENS DO PROETO ---

// ? --- Variáveis para as imagens padrão/atuais ---
/** @type {p5.Image} */
let defaultAgentImg; // Imagem padrão (ou atual) do agente.
/** @type {p5.Image} */
let defaultFoodImg; // Imagem padrão (ou atual) da comida.
/** @type {p5.Image} */
let defaultExploredImg; // Imagem padrão (ou atual) para células exploradas.
/** @type {p5.Image} */
let defaultFrontierImg; // Imagem padrão (ou atual) para células na fronteira da busca.
/** @type {p5.Image} */
let defaultStepImg; // Imagem padrão (ou atual) para as pegadas do caminho.
/** @type {p5.Image} */
let defaultSandImg; // Imagem padrão (ou atual) para areia.
/** @type {p5.Image} */
let defaultWaterImg; // Imagem padrão (ou atual) para agua.
/** @type {p5.Image} */
let defaultSwampImg; // Imagem padrão (ou atual) para atoleiro.
/** @type {p5.Image} */
let defaultObstacleImg; // Imagem padrão (ou atual) para obstaculo.

// ? --- Variáveis para a Skin 0 ("Grayilson") ---
/** @type {p5.Image} */
let agentImg0;
/** @type {p5.Image} */
let foodImg0;
/** @type {p5.Image} */
let exploredImg0;
/** @type {p5.Image} */
let frontierImg0;
/** @type {p5.Image} */
let stepImg0;

// ? --- Variáveis para a Skin 1 ("Coloricleide") ---
/** @type {p5.Image} */
let agentImg1;
/** @type {p5.Image} */
let foodImg1;
/** @type {p5.Image} */
let exploredImg1;
/** @type {p5.Image} */
let frontierImg1;
/** @type {p5.Image} */
let stepImg1;

// ? --- Variáveis para o Terreno 0 ("Elvilmar") ---
/** @type {p5.Image} */
let sand0;
/** @type {p5.Image} */
let water0;
/** @type {p5.Image} */
let swamp0;
/** @type {p5.Image} */
let obstacle0;

// ? --- Variáveis para o Terreno 1 ("Flatizina") ---
/** @type {p5.Image} */
let sand1;
/** @type {p5.Image} */
let water1;
/** @type {p5.Image} */
let swamp1;
/** @type {p5.Image} */
let obstacle1;

// ? --- Variáveis para o Terreno 2 ("Enderton") ---
/** @type {p5.Image} */
let sand2;
/** @type {p5.Image} */
let water2;
/** @type {p5.Image} */
let swamp2;
/** @type {p5.Image} */
let obstacle2;

// * --- VARIÁVEIS GLOBAIS DO PROJETO ---

// ? --- Variáveis para o agente, a comida e o terreno ---
/** @type {Grid} */
let grid; // Objeto que representa o grid do jogo.
/** @type {Agent} */
let agent; // Objeto que representa o agente (personagem).
/** @type {Food} */
let food; // Objeto que representa a comida.
/** @type {number} */
let startTime; // Armazena o tempo (em milissegundos) para controlar animações.
/** @type {number} */
let cellSize; // Tamanho de cada célula do grid em pixels.

// ? --- Variáveis para a animação da busca e do caminho ---
/** @type {Array<Object>} */
let snapshots; // Array com os "snapshots" do estado do grid durante a busca.
/** @type {number} */
let snapshotIndex; // Índice do snapshot atual a ser desenhado.
/** @type {Array<Node>} */
let pathToFood; // Array de nós que representa o caminho encontrado até a comida.
/** @type {number} */
let pathIndex; // Índice do passo atual no caminho a ser desenhado.
/** @type {Array<number>} */
let stepRotation; // Array com os ângulos de rotação para cada pegada no caminho.

// ? --- Variáveis de estado e controle do jogo ---
/** @type {number} */
let currentGameState; // Controla a máquina de estados principal do jogo.
/** @type {Object} */
let searchRegistry; // Armazena o resultado da última busca (caminho, histórico, etc.).
/** @type {number} */
let lootedFood; // Contador de quantas comidas foram coletadas.
/** @type {Array<string>} */
let invalidSpawns; // Array com nomes de terrenos onde objetos não podem ser criados.
/** @type {boolean} */
let isDragging = false; // Flag que indica se o agente está sendo arrastado pelo mouse.
/** @type {(Agent|Food|null)} */
let dragging = null; // Armazena o objeto que está sendo arrastado pelo mouse;
/** @type {p5.Vector} */
let previousPos; // Armazena a posição anterior do agente antes de ser arrastado.
/** @type {boolean} */
let ERROR = false; // Flag global para indicar se ocorreu um erro crítico.

// ? --- Elementos de Interface (DOM) ---
/** @type {p5.Element} */
let canvas; // Referência ao canvas do p5.js.
/** @type {p5.Element} */
let cbPause; // Checkbox para pausar o jogo.
/** @type {p5.Element} */
let cbDebugMode; // Checkbox para ativar o modo de depuração.
/** @type {p5.Element} */
let btResetGame; // Botão para resetar o jogo.
/** @type {p5.Element} */
let lbSpeed; // Rótulo para o slider de velocidade.
/** @type {p5.Element} */
let slSpeed; // Slider para controlar a velocidade das animações.
/** @type {p5.Element} */
let btResetSpeed; // Botão para resetar a velocidade para o padrão.
/** @type {p5.Element} */
let btNewMap; // Botão para gerar um novo mapa.
/** @type {p5.Element} */
let ddAlgorithm; // Menu dropdown para selecionar o algoritmo de busca.
/** @type {p5.Element} */
let lbAlgorithm; // Rótulo para o dropdown de algoritmos.
/** @type {p5.Element} */
let lbAdviceAlgorithm; // Rótulo do aviso do algoritmo aplicado.
/** @type {p5.Element} */
let lbSkin; // Rótulo para o dropdown de skins.
/** @type {p5.Element} */
let ddSkin; // Menu dropdown para selecionar a skin.
/** @type {p5.Element} */
let lbTerrain; // Rótulo para o dropdown de terrenos.
/** @type {p5.Element} */
let ddTerrain; // Menu dropdown para selecionar o terreno.
/** @type {string} */
let previuosSkin = '-1'; // Armazena a skin selecionada anteriormente para detectar mudanças.
/** @type {string} */
let previuosTerrain = '-1'; // Armazena o terreno selecionado anteriormente para detectar mudanças.
/** @type {Array<string>} */
let searchAlgorithms = ['Uniform Cost', 'Greedy Best First (Manhattan)', 'Greedy Best First (Euclidean)', 'BFS', 'DFS', 'A* (Manhattan)', 'A* (Euclidean)']; // Nomes dos algoritmos disponíveis.
/** @type {Array<string>} */
let skins = ['Coloricleide', 'Grayilson']; // Nomes das skins disponíveis.
/** @type {Array<string>} */
let terrains = ['Elvilmar', 'Flatizina', 'Enderton']; // Nomes dos terrenos disponíveis.
/** @type {p5.Element} */
let lbMapSize; // Rótulo para o slider do tamanho do mapa.
/** @type {p5.Element} */
let slMapSize; // Slider para controlar o tamanho do mapa.
/** @type {p5.Element} */
let lbAdviceMapSize; // Rótulo do aviso do tamanho do mapa.
/** @type {p5.Element} */
let lbObjectSize; // Rótulo para o slider do tamanho dos objetos.
/** @type {p5.Element} */
let slObjectSize; // Slider para controlar o tamanho do objetos.
/** @type {number} */
let heightEtc = 0; // Variável auxiliar para posicionar elementos DOM verticalmente.

// ===================================================================================
// FUNÇÕES DO CICLO DE VIDA DO P5.JS (PRELOAD, SETUP, DRAW)
// ===================================================================================

/**
 * Função do p5.js executada uma vez antes do setup.
 * É usada para carregar assets externos, como imagens e sons, garantindo que
 * estejam prontos antes do início do jogo.
 */
function preload() {
    // * Precarregamento das imagens que serão utilizadas na comida e no saqueador

    // Pack Coloricleide
    agentImg0 = loadImage('src/img/agent0.png');
    foodImg0 = loadImage('src/img/food0.png');
    exploredImg0 = loadImage('src/img/explored0.png');
    frontierImg0 = loadImage('src/img/frontier0.png');
    stepImg0 = loadImage('src/img/step0.png');

    // Pack Grayilson
    agentImg1 = loadImage('src/img/agent1.png');
    foodImg1 = loadImage('src/img/food1.png');
    exploredImg1 = loadImage('src/img/explored1.png');
    frontierImg1 = loadImage('src/img/frontier1.png');
    stepImg1 = loadImage('src/img/step1.png');

    // Pack Elvilmar
    sand0 = loadImage('src/img/sand0.png');
    water0 = loadImage('src/img/water0.png');
    swamp0 = loadImage('src/img/swamp0.png');
    obstacle0 = loadImage('src/img/obstacle0.png');

    // Terrain Flatizina
    sand1 = loadImage('src/img/sand1.png');
    water1 = loadImage('src/img/water1.png');
    swamp1 = loadImage('src/img/swamp1.png');
    obstacle1 = loadImage('src/img/obstacle1.png');

    // Terrain Enderton
    sand2 = loadImage('src/img/sand2.png');
    water2 = loadImage('src/img/water2.png');
    swamp2 = loadImage('src/img/swamp2.png');
    obstacle2 = loadImage('src/img/obstacle2.png');

}

/**
 * Função do p5.js executada uma vez no início, após o preload.
 * É usada para configurar o ambiente inicial, como o tamanho do canvas,
 * criar objetos e inicializar variáveis.
 */
function setup() {
    // Cria o canvas com as dimensões baseadas no grid.
    canvas = createCanvas(canvasWidthLimit, canvasWidthLimit * 0.66666);

    // Variável para posicionamento vertical dos elementos DOM.
    heightEtc = 20;

    // Cria e posiciona os elementos de interface (checkboxes, botões, sliders, etc.).
    cbDebugMode = createCheckbox('Debug Mode', false);
    cbDebugMode.position(width + 10, heightEtc);
    heightEtc += 30;

    cbPause = createCheckbox('Pause', false);
    cbPause.position(width + 10, heightEtc);
    heightEtc += 30;

    btResetGame = createButton('Reset Game');
    btResetGame.position(width + 10, heightEtc);
    btResetGame.mousePressed(btResetGamePressed);
    heightEtc += 30;

    btNewMap = createButton('New Map');
    btNewMap.position(width + 10, heightEtc);
    btNewMap.mousePressed(btNewMapPressed);
    heightEtc += 30;

    btResetSpeed = createButton('Reset Speed');
    btResetSpeed.position(width + 10, heightEtc);
    btResetSpeed.mousePressed(btResetSpeedPressed);
    heightEtc += 30;

    lbSpeed = createP('Speed:');
    lbSpeed.position(width + 10, heightEtc);
    heightEtc += 30;

    slSpeed = createSlider(minDelayTime, maxDelayTime, defaultDelayTime, 1);
    slSpeed.position(width + 10, heightEtc);
    heightEtc += 20;

    lbAlgorithm = createP('Search Algorithm:');
    lbAlgorithm.position(width + 10, heightEtc);
    heightEtc += 40;

    ddAlgorithm = createSelect();
    ddAlgorithm.position(width + 10, heightEtc);
    for (let i = 0; i < searchAlgorithms.length; i++) {
        ddAlgorithm.option(searchAlgorithms[i], i);
    }
    heightEtc += 10;

    lbAdviceAlgorithm = createP('The algorithm will be applied in the next search.');
    lbAdviceAlgorithm.style('font-size', '12px');
    lbAdviceAlgorithm.position(width + 10, heightEtc);
    heightEtc += 40;

    lbSkin = createP('Skins:');
    lbSkin.position(width + 10, heightEtc);
    heightEtc += 40;

    ddSkin = createSelect();
    ddSkin.position(width + 10, heightEtc);
    for (let i = 0; i < skins.length; i++) {
        ddSkin.option(skins[i], i);
    }
    heightEtc += 30;

    lbTerrain = createP('Terrain:');
    lbTerrain.position(width + 10, heightEtc);
    heightEtc += 40;

    ddTerrain = createSelect();
    ddTerrain.position(width + 10, heightEtc);
    for (let i = 0; i < terrains.length; i++) {
        ddTerrain.option(terrains[i], i);
    }
    heightEtc += 30;

    lbMapSize = createP('Map Size:');
    lbMapSize.position(width + 10, heightEtc);
    heightEtc += 30;

    slMapSize = createSlider(minMapSize, maxMapSize, defaultMapSize, 0.1);
    slMapSize.position(width + 10, heightEtc);
    heightEtc += 10;

    lbAdviceMapSize = createP('You have to create a new map to change its size.');
    lbAdviceMapSize.style('font-size', '12px');
    lbAdviceMapSize.position(width + 10, heightEtc);
    heightEtc += 40;

    lbObjectSize = createP('Object Size:');
    lbObjectSize.position(width + 10, heightEtc);
    heightEtc += 30;

    slObjectSize = createSlider(minObjectSize, maxObjectSize, defaultObjectSize, 0.1);
    slObjectSize.position(width + 10, heightEtc);

    // Define o modo de ângulo para graus e o ponto de referência das imagens para o centro.
    angleMode(DEGREES);
    imageMode(CENTER);

    // Inicia o jogo pela primeira vez.
    // Cria uma nova instância do grid.
    btNewMapPressed();

    // Define as imagens padrão iniciais para a skin 0.
    defaultAgentImg = agentImg0;
    defaultFoodImg = foodImg0;
    defaultExploredImg = exploredImg0;
    defaultFrontierImg = frontierImg0;
    defaultStepImg = stepImg0;

    // Define as imagens padrão iniciais para o terreno.
    defaultSandImg = sand0;
    defaultWaterImg = water0;
    defaultSwampImg = swamp0;
    defaultObstacleImg = obstacle0;
    
    // Exibe informações de depuração no console se o modo estiver ativo.
    if (cbDebugMode.checked()) {
        console.log(`Tamanho do Canvas em Pixels: ${width}w x ${height}h`);
        console.log(`Tamanho do Grid em Células: ${cols} colunas - ${rows} linhas, total: ${cols*rows} células`);
        console.log(`Tamanho da Célula: ${cellSize} pixeis`);
    }
}

/**
 * Função principal do p5.js, executada continuamente em loop (normalmente 60 vezes por segundo).
 * É responsável por atualizar a lógica e desenhar os elementos na tela a cada frame.
 */
function draw() {
    background(255);
    // Desenha o fundo do grid.
    grid.draw();

    // Verifica se a skin selecionada no menu dropdown mudou.
    if (ddSkin.selected() !== previuosSkin) {

        if (cbDebugMode.checked()) {
            console.log(`Skins trocadas de ${skins[previuosSkin]} para ${skins[ddSkin.selected()]}`);
        }
        
        previuosSkin = ddSkin.selected();

        // Atualiza as imagens do agente, da comida e as imagens padrão de acordo com a skin escolhida.
        if (previuosSkin === '0') {
            agent.img = agentImg0;
            food.img = foodImg0;
            defaultAgentImg = agentImg0;
            defaultFoodImg = foodImg0;
            defaultExploredImg = exploredImg0;
            defaultFrontierImg = frontierImg0;
            defaultStepImg = stepImg0;
        } else if (previuosSkin === '1') {
            agent.img = agentImg1;
            food.img = foodImg1;
            defaultAgentImg = agentImg1;
            defaultFoodImg = foodImg1;
            defaultExploredImg = exploredImg1;
            defaultFrontierImg = frontierImg1;
            defaultStepImg = stepImg1;
        }
    }

    // Verifica se a skin selecionada no menu dropdown mudou.
    if (ddTerrain.selected() !== previuosTerrain) {

        if (cbDebugMode.checked()) {
            console.log(`Terreno trocado de ${terrains[previuosTerrain]} para ${terrains[ddTerrain.selected()]}`);
        }
        
        previuosTerrain = ddTerrain.selected();

        // Atualiza as imagens do agente, da comida e as imagens padrão de acordo com a skin escolhida.
        if (previuosTerrain === '0') {
            defaultSandImg = sand0;
            defaultWaterImg = water0;
            defaultSwampImg = swamp0;
            defaultObstacleImg = obstacle0;
        } else if (previuosTerrain === '1') {
            defaultSandImg = sand1;
            defaultWaterImg = water1;
            defaultSwampImg = swamp1;
            defaultObstacleImg = obstacle1;
        } else if (previuosTerrain === '2') {
            defaultSandImg = sand2;
            defaultWaterImg = water2;
            defaultSwampImg = swamp2;
            defaultObstacleImg = obstacle2;
        }
    }

    // ! ---- MÁQUINA DE ESTADOS PRINCIPAL ---- !
    
    // Se a flag de erro estiver ativa, exibe uma tela de erro e para a execução.
    if (ERROR) {
        strokeWeight(0);
        fill(255, 0, 0, 100);
        rect(0, 0, cols*cellSize, rows*cellSize);
        
        textSize(64);
        stroke(0);
        strokeWeight(5);
        fill(255, 200, 0);
        textAlign(CENTER, CENTER);
        text("ERRO:", width/2, (height/2)-70);
        text("Verifique o console (F12)!", width/2, height/2);
        return;
    }

    // Se o jogo não estiver pausado, executa a lógica principal.
    if (!cbPause.checked()) {

        if (cbDebugMode.checked()) {
            console.log(`Game: #${lootedFood} - CurrentGameState: ${currentGameState}`);
        }

        // Se o agente estiver sendo arrastado, atualiza sua posição para a do mouse.
        if (isDragging) {
            // Verifica se o mouse está segurando algum objeto válido
            if (dragging) {
                let currentInvalidDragging = false;
                dragging.setPosition(pixelToGrid(mouseX), pixelToGrid(mouseY));
                for (let type of invalidSpawns) {
                    if (grid.grid[pixelToGrid(mouseY)][pixelToGrid(mouseX)].terrain.name === type) {
                        currentInvalidDragging = true;
                        break;
                    }
                }

                // Se o objeto estiver em um espaço inválido este espaço é pintado de vermelho
                if (currentInvalidDragging) {
                    fill(255, 0, 0, 125);
                    square(pixelToGrid(mouseX) * cellSize, pixelToGrid(mouseY) * cellSize, cellSize);
                }
            }
        }

        // --- Lógica baseada no estado atual do jogo (currentGameState) ---

        if (currentGameState == 0) {
            // ! Agente vai procurar uma rota até a comida

            // Executa o algoritmo de busca selecionado.
            if (ddAlgorithm.selected() === '0') {
                searchRegistry = uniformCostSearch(grid, agent.node(grid), food.node(grid));
            } else if (ddAlgorithm.selected() === '1') {
                searchRegistry = greedyBestFirstSearch(grid, agent.node(grid), food.node(grid), manhattanDistance);
            } else if (ddAlgorithm.selected() === '2') {
                searchRegistry = greedyBestFirstSearch(grid, agent.node(grid), food.node(grid), euclideanDistance);
            } else if (ddAlgorithm.selected() === '3') {
                searchRegistry = breadthFirstSearch(grid, agent.node(grid), food.node(grid));
            } else if (ddAlgorithm.selected() === '4') {
                searchRegistry = depthFirstSearch(grid, agent.node(grid), food.node(grid));
            } else if (ddAlgorithm.selected() === '5') {
                searchRegistry = aStarSearch(grid, agent.node(grid), food.node(grid), manhattanDistance);
            } else if (ddAlgorithm.selected() === '6') {
                searchRegistry = aStarSearch(grid, agent.node(grid), food.node(grid), euclideanDistance); 
            } else  {
                console.error(`Algoritmo de busca indefinido: ${ddAlgorithm.selected()} !`);
                ERROR = true;
                return;
            }
            
            // Armazena o histórico da busca (snapshots) e o caminho final.
            snapshots = searchRegistry.gridHistory;
            pathToFood = searchRegistry.finalPath;

            if (cbDebugMode.checked()) {
                console.log(`snapshots:`);
                console.log(snapshots);
                console.log(`pathToFood:`);
                console.log(pathToFood);
            }

            // Se um caminho foi encontrado, avança para o próximo estado.
            if (pathToFood.length !== 0) {
                currentGameState = 1;
                stepRotation = getStepRotation(pathToFood); // Calcula as rotações para as pegadas.
            } else {
                // Se não encontrou caminho, exibe erro e reseta o jogo.
                console.error("Impossível encontrar um caminho até a comida. O jogo será resetado.");
                btResetGamePressed();
                return; // Sai do draw() para evitar erros no mesmo frame.
            }

        } else if (currentGameState == 1) {
            // ! Animação da busca
            
            // Avança o índice do snapshot da busca com base no tempo de delay.
            if (millis() - startTime > getDelayTime()) {
                snapshotIndex++;
                if (snapshotIndex >= snapshots.length) {
                    currentGameState = 2; // Passa para a animação do caminho.
                }
                startTime = millis();
            }

        } else if (currentGameState == 2) {
            // ! Animação do caminho
            
            // Avança o índice do passo do caminho com base no tempo de delay.
            if (millis() - startTime > getDelayTime()) {
                pathIndex++;
                if (pathIndex >= pathToFood.length) {
                    currentGameState = 3; // Passa para o movimento do agente.
                }
                startTime = millis();
            }

        } else if (currentGameState == 3) {
            // ! Agente vai andar até a comida

            // Se o agente chegou na comida, avança de estado.
            if (agent.pos.x == food.pos.x && agent.pos.y == food.pos.y) {
                currentGameState = 4;
            } else if (!agent.isMoving) {
                // Se não estiver se movendo, define o caminho a ser seguido.
                agent.setPath(pathToFood);
            }
            // Atualiza a posição do agente ao longo do caminho.
            agent.update(getSpeedMovement());

        } else if (currentGameState == 4) {
            // ! Agente chegou na comida e conta o ponto
            
            lootedFood++;
            console.log(`Comidas Saqueadas: ${lootedFood}`);
            currentGameState = 5;

        } else if (currentGameState == 5) {
            // ! Comida é resetada
            
            // Cria uma nova comida em uma posição válida.
            food = createObj('food', null, [agent.node(grid)]);
            currentGameState = 6;

        } else if (currentGameState == 6) {
            // ! Preparação para reiniciar o jogo
            
            // Reseta todas as variáveis de estado para iniciar uma nova busca.
            resetGridNodes(grid);
            pathIndex = 0;
            snapshotIndex = 0;
            pathToFood = [];
            searchRegistry = {};
            currentGameState = 0;

        } else if (currentGameState == 99) {
            // ! Obj sendo arrastado pelo mouse
            // Nenhum código aqui, o estado apenas impede a lógica normal de rodar.
        } else {
            console.error(`ERRO: Estado não definido!`);
            ERROR = true;
        }
    }

    // ! ---- FUNÇÕES DE DESENHO (EXECUTADAS TODO FRAME) ---- !

    // Desenha as animações da busca e do caminho.
    drawSearch(snapshotIndex);
    drawPath(pathIndex);

    // Desenha a comida e o agente.
    food.show();
    agent.show();

    // Desenha o contador de saques e o nome do algoritmo na tela.
    push();
    stroke(150);
    strokeWeight(1);
    fill(255, 255, 255, 150);
    textAlign(RIGHT, CENTER);
    textSize(32);
    text(`Saques: ${lootedFood}`, width - 10, 30);
    // textAlign(RIGHT, CENTER);
    // textSize(32);
    // text(`Algorithm: ${searchAlgorithms[ddAlgorithm.selected()]}`, width - 10, cellSize * rows + 30);
    pop();

    // Se o jogo estiver pausado, desenha uma sobreposição e para a execução do frame.
    if (cbPause.checked()) {
        strokeWeight(0);
        fill(255, 255, 100, 100);
        rect(0, 0, cols*cellSize, rows*cellSize);
        
        textSize(64);
        stroke(0);
        strokeWeight(5);
        fill(255, 200, 0);
        textAlign(CENTER, CENTER);
        text("Jogo Pausado", width/2, height/2);
        return;
    }
}

// ===================================================================================
// FUNÇÕES DE EVENTOS (BOTÕES, MOUSE)
// ===================================================================================

/**
 * Função chamada quando o botão "New Map" é pressionado.
 * Reseta o jogo e gera um novo mapa com uma nova seed de ruído.
 */
function btNewMapPressed() {
    let currentMapSize = slMapSize.value();
    cols = floor(10 * currentMapSize);
    rows = floor(cols * 0.66666);
    cellSize = canvasWidthLimit / cols;
    noiseSeed(random(10000));
    grid = new Grid(cols, rows, cellSize);
    if (!grid) {
        ERROR = true;
        return;
    }
    btResetGamePressed();
}

/**
 * Função chamada quando o botão "Reset Speed" é pressionado.
 * Restaura o valor do slider de velocidade para o padrão.
 */
function btResetSpeedPressed() {
    slSpeed.value(defaultDelayTime);
}

/**
 * Função chamada para resetar o estado do jogo para o início.
 * Zera contadores, limpa caminhos e cria novos agente e comida.
 */
function btResetGamePressed() {
    resetGridNodes(grid);
    startTime = millis();
    snapshots = [];
    snapshotIndex = 0;
    currentGameState = 0;
    pathToFood = [];
    pathIndex = 0;
    searchRegistry = {};
    lootedFood = 0;
    stepRotation = [];
    invalidSpawns = ['obstacle'];

    // Cria food e agent em células válidas.
    agent = createObj('agent');
    if (!agent) {
        ERROR = true;
        return;
    }
    food = createObj('food', null, [agent.node(grid)]);
    if (!food) {
        ERROR = true;
        return;
    }
}

/**
 * Função de evento do p5.js chamada quando qualquer botão do mouse é pressionado.
 */
function mousePressed() {
    // Se o mouse for pressionado sobre o agente, inicia o modo de arrasto.
    if (agent.isOver(mouseX, mouseY)) {
        currentGameState = 99; // Estado especial de arrasto.
        isDragging = true;
        dragging = agent;
        previousPos = agent.pos.copy();
    } else if (food.isOver(mouseX, mouseY)) {
        currentGameState = 99; // Estado especial de arrasto.
        isDragging = true;
        dragging = food;
        previousPos = food.pos.copy();
    }
}

/**
 * Função de evento do p5.js chamada quando qualquer botão do mouse é solto.
 */
function mouseReleased() {
    // Se estava arrastando o agente, finaliza o modo de arrasto.
    if (isDragging) {
        isDragging = false;
        currentGameState = 6; // Estado para preparar um novo ciclo.

        // Converte a posição final do mouse para coordenadas do grid.
        let newGridX = floor(mouseX / cellSize);
        let newGridY = floor(mouseY / cellSize);

        // Garante que a nova posição esteja dentro dos limites do grid.
        newGridX = constrain(newGridX, 0, cols - 1);
        newGridY = constrain(newGridY, 0, rows - 1);

        // Verifica se a nova posição é válida (não é um obstáculo).
        let movementAccepted = true;
        for (let type of invalidSpawns) {
            if (grid.grid[newGridY][newGridX].terrain.name === type) {
                movementAccepted = false;
                break;
            }
        }

        // Se for válida, atualiza a posição do agente.
        if (movementAccepted) {
            dragging.setPosition(newGridX, newGridY);
        } else {
            // Senão, retorna o agente para a posição anterior.
            dragging.setPosition(previousPos.x, previousPos.y);
        }
    }
}

// ===================================================================================
// FUNÇÕES AUXILIARES E DE LÓGICA
// ===================================================================================

/**
 * Cria e retorna um objeto (Agente ou Comida) em uma posição aleatória e válida do grid.
 * @param {string} [objType='food'] O tipo de objeto a ser criado ('food' or 'agent').
 * @param {Array<string>} [excludeType=null] Um array de nomes de terrenos a serem evitados.
 * @param {Array<Node>} [excludeSpot=null] Um array de nós específicos a serem evitados.
 * @returns {(Agent|Food|undefined)} O objeto criado ou undefined se a criação falhar.
 */
function createObj(objType = 'food', excludeType = null, excludeSpot = null) {
    if (!excludeType) {
        excludeType = invalidSpawns;
    }
    const spot = getSpot(excludeType, excludeSpot);
    if (spot) {
        if (objType === 'food') {
            return new Food(spot.x, spot.y, cellSize, defaultFoodImg);
        } else if (objType === 'agent') {
            return new Agent(spot.x, spot.y, cellSize, defaultAgentImg);
        }

        console.error(`ERRO: objType não existe, verifique createObj() e tente novamente.`);
        ERROR = true;
        return;
    }

    console.error("Não existe nenhum local válido no grid atual para criar o objeto! O mapa será resetado.");
    btNewMapPressed();
}

/**
 * Encontra e retorna um nó (célula) aleatório e válido no grid.
 * @param {Array<string>} [excludeType=null] Um array de nomes de terrenos a serem evitados.
 * @param {Array<Node>} [excludeSpot=null] Um array de nós específicos a serem evitados.
 * @returns {(Node|null)} Um nó válido ou null se nenhum for encontrado.
 */
function getSpot(excludeType = null, excludeSpot = null) {
    const validSpots = [];
    let arrayRemoved = [];

    // 1. Percorre o grid uma vez para encontrar todos os locais válidos.
    for (let y = 0; y < grid.rows; y++) {
        for (let x = 0; x < grid.cols; x++) {
            let eligible = true;

            // Exclui os tipos de terreno indesejáveis.
            if (excludeType) {
                for (let type of excludeType) {
                    if (grid.grid[y][x].terrain.name === type) {
                        if (cbDebugMode.checked()) {
                            arrayRemoved.push(`${grid.grid[y][x].terrain.name} removido (${type}) em x:${x} y:${y}`);
                        }
                        eligible = false;
                        break;
                    }
                }
            }
            if (!eligible) continue;

            // Exclui os spots indesejáveis.
            if (excludeSpot) {
                for (let spot of excludeSpot) {
                    if (spot.x === x && spot.y === y) {
                        if (cbDebugMode.checked()) {
                            arrayRemoved.push(`${grid.grid[y][x].terrain.name} removido (${spot.x}, ${x} : ${spot.y}, ${y}) em x:${x} y:${y}`);
                        }
                        eligible = false;
                        break;
                    }
                }
            }

            // Se o local continuar sendo elegível, ele é adicionado a lista de locais válidos.
            if (eligible) {
                validSpots.push(grid.grid[y][x]);
            }
        }
    }

    // 2. Se não houver nenhum local válido, avisa e retorna null.
    if (validSpots.length === 0) {
        return null;
    }

    // 3. Escolhe um local aleatório da lista de locais válidos.
    const bestSpot = random(validSpots);

    if (cbDebugMode.checked()) {
        console.log(`Lista de Nós Inválidos:`);
        console.log(arrayRemoved);
        console.log(`Grid:`);
        console.log(grid.grid);
        console.log(`Best Spot:`);
        console.log(bestSpot);
    }

    return bestSpot;
}

/**
 * Calcula o atraso para as animações com base no valor do slider.
 * Mapeia o valor do slider para que valores maiores resultem em animações mais rápidas.
 * @returns {number} O tempo de atraso em milissegundos.
 */
function getDelayTime() {
    return map(slSpeed.value(), minDelayTime, maxDelayTime, maxDelayTime, minDelayTime);
}

/**
 * Calcula a velocidade de movimento do agente com base no valor do slider.
 * @returns {number} Um valor entre 0.01 e 1 para a velocidade.
 */
function getSpeedMovement() {
    return map(slSpeed.value(), minDelayTime, maxDelayTime, 0.01, 0.5);
}

/**
 * Reseta as propriedades de busca de todos os nós no grid.
 * @param {Grid} gridToReset O grid que terá seus nós limpos.
 */
function resetGridNodes(gridToReset) {
    for (let y = 0; y < gridToReset.rows; y++) {
        for (let x = 0; x < gridToReset.cols; x++) {
            const node = gridToReset.grid[y][x];
            node.g = Infinity;    // custo inicial desconhecido
            node.h = 0;
            node.f = Infinity;
            node.parent = null;
            node.state = 'default'; // mantém reset visual
        }
    }
}

// ===================================================================================
// FUNÇÕES DE DESENHO E ANIMAÇÃO
// ===================================================================================

/**
 * Desenha a animação da busca (células visitadas e na fronteira).
 * @param {number} index O índice do snapshot a ser desenhado.
 */
function drawSearch(index) {
    // Validações para garantir que o índice é válido e que há snapshots para desenhar.
    if (!snapshots || snapshots.length === 0) return;
    if (typeof index !== 'number' || index < 0) return;
    if (index >= snapshots.length) {
        index = snapshots.length - 1;
    }

    // Percorre o grid do snapshot para desenhar o estado de cada célula.
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let cell = snapshots[index].grid[j][i];

            // Não desenha sobre a célula do agente.
            if (!(cell.x === agent.pos.x && cell.y === agent.pos.y)) {
                push();
                if (cbDebugMode.checked()) {
                    // No modo debug, desenha quadrados coloridos.
                    push();
                    rectMode(CENTER);
                    if (cell.state === 'frontier') {
                        fill(70, 0, 150);
                        square(gridToPixel(cell.x), gridToPixel(cell.y), slObjectSize.value() *cellSize);
                    } else if (cell.state === 'visited') {
                        fill(150, 50, 255);
                        square(gridToPixel(cell.x), gridToPixel(cell.y), slObjectSize.value() * cellSize);
                    }
                    pop();
                } else {
                    // No modo normal, desenha imagens.
                    translate(gridToPixel(i), gridToPixel(j));
                    rotate(random(0.09));
                    if (cell.state === 'frontier') {
                        image(defaultFrontierImg, 0, 0, slObjectSize.value() * cellSize, slObjectSize.value() * cellSize);
                    } else if (cell.state === 'visited') {
                        image(defaultExploredImg, 0, 0, slObjectSize.value() * cellSize, slObjectSize.value() * cellSize);
                    }
                }
                pop();
            }
        }
    }
}

/**
 * Desenha a animação do caminho encontrado.
 * @param {number} limit O número de passos do caminho a serem desenhados.
 */
function drawPath(limit) {
    // Validações para garantir que o limite é válido.
    if (typeof limit !== 'number' || limit < 0) return;
    if (limit >= pathToFood.length) {
        limit = pathToFood.length - 1;
    }

    push();
    rectMode(CENTER);
    strokeWeight(0);
    // Primeiro, preenche o fundo do caminho com a cor do terreno.
    for (let i = 0; i < limit; i++) {
        let cell = pathToFood[i];

        if (cbDebugMode.checked()) {
            fill(cell.terrain.color);
            square(gridToPixel(cell.x), gridToPixel(cell.y), cellSize);
            
        } else {
            push();
            translate(gridToPixel(cell.x), gridToPixel(cell.y));
            let imgToPaint;
            if (cell.terrain.name === 'sand') {
                imgToPaint = defaultSandImg;
            } else if (cell.terrain.name === 'swamp') {
                imgToPaint = defaultSwampImg;
            } else if (cell.terrain.name === 'water') {
                imgToPaint = defaultWaterImg;
            } else {
                imgToPaint = defaultSandImg;
            }
            image(imgToPaint, 0, 0, cellSize, cellSize);
            pop();
        }
    }
    pop();

    // Depois, desenha as pegadas sobre o caminho.
    for (let i = 0; i < limit; i++) {
        let cell = pathToFood[i];
        if (cbDebugMode.checked()) {
            push();
            rectMode(CENTER);
            strokeWeight(0);
            // No modo debug, desenha quadrados pretos.
            fill(0, 0, 0);
            square(gridToPixel(cell.x), gridToPixel(cell.y), slObjectSize.value() * cellSize);
            pop();
        } else {
            // No modo normal, desenha a imagem da pegada com a rotação correta.
            push();
            translate(gridToPixel(cell.x), gridToPixel(cell.y));
            rotate(stepRotation[i]);
            image(defaultStepImg, 0, 0, slObjectSize.value() * cellSize, slObjectSize.value() * cellSize);
            pop();
        }
    }
}

// ===================================================================================
// FUNÇÕES DE CONVERSÃO E CÁLCULO
// ===================================================================================

/**
 * Converte uma coordenada em pixels para o índice correspondente no grid.
 * @param {number} pixel A coordenada em pixels.
 * @returns {number} O índice no grid.
 */
function pixelToGrid(pixel) {
    return floor(pixel / cellSize);
}

/**
 * Converte um índice do grid para a coordenada central da célula em pixels.
 * Usado para posicionar imagens no centro das células.
 * @param {number} gridIndex O índice no grid.
 * @returns {number} A coordenada central em pixels.
 */
function gridToPixel(gridIndex) {
    return (gridIndex * cellSize) + (cellSize / 2);
}

/**
 * Calcula e retorna um array com as rotações necessárias para cada passo do caminho.
 * @param {Array<Node>} path O caminho (array de nós) a ser percorrido.
 * @returns {Array<number>} Um array de ângulos de rotação em graus.
 */
function getStepRotation(path) {
    let stepRotation = [];
    if (path.length > 1) {
        for (let i = 1; i < path.length; i++) {
            let angle = getRotationForStep(path[i - 1], path[i]);
            stepRotation.push(angle);
        }
    } else if (path.length === 1) {
        stepRotation.push(0);
    }
    return stepRotation;
}

/**
 * Calcula o ângulo de rotação (em graus) para uma imagem baseada no movimento entre duas células.
 * Assume que a imagem original aponta para cima (0 graus).
 * @param {Node} currentCell A célula de onde o movimento partiu.
 * @param {Node} nextCell A célula para onde o movimento chegou.
 * @returns {number} O ângulo em graus (0, 90, 180, 270).
 */
function getRotationForStep(currentCell, nextCell) {
    const dx = nextCell.x - currentCell.x;
    const dy = nextCell.y - currentCell.y;

    if (dy === -1) { // Movendo para Cima
        return 0;
    } else if (dx === 1) { // Movendo para a Direita
        return 90;
    } else if (dy === 1) { // Movendo para Baixo
        return 180;
    } else if (dx === -1) { // Movendo para a Esquerda
        return 270;
    }
    return 0; // Padrão, caso não haja movimento.
}
