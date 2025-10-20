
/**
 * Executa a busca em largura (BFS) para encontrar o caminho mais curto em número de passos
 * @param {Grid} initialGrid - O grid inicial do jogo
 * @param {Node} startNode - O nó inicial
 * @param {Node} goalNode - O nó objetivo
 * @returns {Object} Objeto contendo o caminho final e histórico de estados
 */
function breadthFirstSearch(initialGrid, startNode, goalNode) {
    if (!initialGrid || !startNode || !goalNode) {
        throw new Error('Parâmetros inválidos: grid, nó inicial e nó objetivo são obrigatórios');
    }

    const gridHistory = [];
    const frontier = [startNode];  // Usando array como fila
    const explored = new Set();
    
    // Marca o nó inicial como fronteira no primeiro grid
    const initialGridCopy = initialGrid.copy();
    initialGridCopy.getNode(startNode.x, startNode.y).state = 'frontier';
    gridHistory.push(initialGridCopy);

    while (frontier.length > 0) {
        const current = frontier.shift();  // Remove o primeiro elemento (FIFO)
        
        if (current === goalNode) {
            const finalPath = reconstructPath(current);
            return { finalPath, gridHistory };
        }

        explored.add(current);
        
        for (const neighbor of initialGrid.getNeighbors(current)) {
            if (!explored.has(neighbor) && !frontier.includes(neighbor)) {
                neighbor.parent = current;
                frontier.push(neighbor);

                // Cria uma nova cópia do último estado do grid
                const lastGrid = gridHistory[gridHistory.length - 1];
                const newGrid = lastGrid.copy();
                newGrid.getNode(neighbor.x, neighbor.y).state = 'frontier';
                newGrid.getNode(current.x, current.y).state = 'visited';
                gridHistory.push(newGrid);
            }
        }
    }

    return { finalPath: [], gridHistory };
}

/**
 * Executa a busca em profundidade (DFS) para encontrar um caminho até o objetivo
 * @param {Grid} initialGrid - O grid inicial do jogo
 * @param {Node} startNode - O nó inicial
 * @param {Node} goalNode - O nó objetivo
 * @returns {Object} Objeto contendo o caminho final e histórico de estados
 */
function depthFirstSearch(initialGrid, startNode, goalNode) {
    if (!initialGrid || !startNode || !goalNode) {
        throw new Error('Parâmetros inválidos: grid, nó inicial e nó objetivo são obrigatórios');
    }

    const gridHistory = [];
    const frontier = [startNode];  // Usando array como pilha
    const explored = new Set();
    
    // Marca o nó inicial como fronteira no primeiro grid
    const initialGridCopy = initialGrid.copy();
    initialGridCopy.getNode(startNode.x, startNode.y).state = 'frontier';
    gridHistory.push(initialGridCopy);

    while (frontier.length > 0) {
        const current = frontier.pop();  // Remove o último elemento (LIFO)
        
        if (current === goalNode) {
            const finalPath = reconstructPath(current);
            return { finalPath, gridHistory };
        }

        if (!explored.has(current)) {
            explored.add(current);
            
            // Pega os vizinhos em ordem reversa para manter a direção de busca consistente
            const neighbors = initialGrid.getNeighbors(current).reverse();
            
            for (const neighbor of neighbors) {
                if (!explored.has(neighbor) && !frontier.includes(neighbor)) {
                    neighbor.parent = current;
                    frontier.push(neighbor);

                    // Cria uma nova cópia do último estado do grid
                    const lastGrid = gridHistory[gridHistory.length - 1];
                    const newGrid = lastGrid.copy();
                    newGrid.getNode(neighbor.x, neighbor.y).state = 'frontier';
                    newGrid.getNode(current.x, current.y).state = 'visited';
                    gridHistory.push(newGrid);
                }
            }
        }
    }

    return { finalPath: [], gridHistory };
}

/**
 * Executa a busca de custo uniforme (UCS) para encontrar o caminho mais "barato"
 * @param {Grid} initialGrid - O grid inicial do jogo
 * @param {Node} startNode - O nó inicial
 * @param {Node} goalNode - O nó objetivo
 * @returns {Object} Objeto contendo o caminho final e histórico de estados
 */
function uniformCostSearch(initialGrid, startNode, goalNode) {
    
    if (!initialGrid || !startNode || !goalNode) {
        throw new Error('Parâmetros inválidos: grid, nó inicial e nó objetivo são obrigatórios');
    }

    const gridHistory = [];
    const frontier = new PriorityQueue();
    const explored = new Set();
    
    startNode.g = 0;
    frontier.enqueue(startNode, 0);
    
    gridHistory.push(initialGrid.copy());

    while (!frontier.isEmpty()) {
        const current = frontier.dequeue();
        
        if (current === goalNode) {
            const finalPath = reconstructPath(current);
            return { finalPath, gridHistory };
        }

        explored.add(current);
        
        for (const neighbor of initialGrid.getNeighbors(current)) {
            const newG = current.g + neighbor.terrain.cost;
            
            if (!explored.has(neighbor) && (!neighbor.g || newG < neighbor.g)) {
                neighbor.g = newG;
                neighbor.parent = current;
                frontier.enqueue(neighbor, newG);

                // const newGrid = initialGrid.copy();
                const lastGrid = gridHistory[gridHistory.length - 1]; 
                const newGrid = lastGrid.copy();
                newGrid.getNode(neighbor.x, neighbor.y).state = 'frontier';
                newGrid.getNode(current.x, current.y).state = 'visited';
                gridHistory.push(newGrid);
            }
        }
    }

    return { finalPath: [], gridHistory };
}

/**
 * Executa a busca gulosa (Greedy Best-First Search) usando uma heurística
 * @param {Grid} initialGrid - O grid inicial do jogo
 * @param {Node} startNode - O nó inicial
 * @param {Node} goalNode - O nó objetivo
 * @param {Function} heuristic - Função de heurística (Manhattan ou Euclidiana)
 * @returns {Object} Objeto contendo o caminho final e histórico de estados
 */
function greedyBestFirstSearch(initialGrid, startNode, goalNode, heuristic) {

    if (!initialGrid || !startNode || !goalNode) {
        throw new Error('Parâmetros inválidos: grid, nó inicial e nó objetivo são obrigatórios');
    }

    if (typeof heuristic !== 'function') {
        throw new Error('Uma função de heurística válida deve ser fornecida');
    }

    const gridHistory = [];
    const frontier = new PriorityQueue();
    const explored = new Set();
    
    startNode.h = heuristic(startNode, goalNode);
    frontier.enqueue(startNode, startNode.h);
    
    gridHistory.push(initialGrid.copy());

    while (!frontier.isEmpty()) {
        const current = frontier.dequeue();
        
        if (current === goalNode) {
            const finalPath = reconstructPath(current);
            return { finalPath, gridHistory };
        }

        explored.add(current);
        
        for (const neighbor of initialGrid.getNeighbors(current)) {
            if (!explored.has(neighbor)) {
                neighbor.parent = current;
                neighbor.h = heuristic(neighbor, goalNode);
                frontier.enqueue(neighbor, neighbor.h);

                const lastGrid = gridHistory[gridHistory.length - 1];
                const newGrid = lastGrid.copy();
                newGrid.getNode(neighbor.x, neighbor.y).state = 'frontier';
                newGrid.getNode(current.x, current.y).state = 'visited';
                gridHistory.push(newGrid);
            }
        }
    }

    return { finalPath: [], gridHistory };
}
/**
 * Executa a busca A* (A-Star) para encontrar o caminho de menor custo.
 * O A* combina o custo do caminho (UCS) com uma heurística (Busca Gulosa).
 * @param {Grid} initialGrid - O grid inicial do jogo.
 * @param {Node} startNode - O nó inicial.
 * @param {Node} goalNode - O nó objetivo.
 * @param {Function} heuristic - A função de heurística a ser usada (ex: manhattanDistance).
 * @returns {Object} Um objeto contendo o caminho final e o histórico de estados do grid.
 */
function aStarSearch(initialGrid, startNode, goalNode, heuristic) {
    if (!initialGrid || !startNode || !goalNode) {
        throw new Error('Parâmetros inválidos: grid, nó inicial e nó objetivo são obrigatórios.');
    }
    if (typeof heuristic !== 'function') {
        throw new Error('Uma função de heurística válida deve ser fornecida.');
    }

    const gridHistory = [];
    const frontier = new PriorityQueue();
    const explored = new Set(); // Mantém o registro de nós já processados

    // Configuração inicial do nó de partida
    startNode.g = 0;
    startNode.h = heuristic(startNode, goalNode);
    startNode.f = startNode.g + startNode.h;

    frontier.enqueue(startNode, startNode.f);
    
    const initialGridCopy = initialGrid.copy();
    initialGridCopy.getNode(startNode.x, startNode.y).state = 'frontier';
    gridHistory.push(initialGridCopy);

    while (!frontier.isEmpty()) {
        const current = frontier.dequeue();

        if (current === goalNode) {
            const finalPath = reconstructPath(current);
            return { finalPath, gridHistory };
        }

        explored.add(current);

        const lastGrid = gridHistory[gridHistory.length - 1];
        const newGrid = lastGrid.copy();
        newGrid.getNode(current.x, current.y).state = 'visited';
        
    for (const neighbor of initialGrid.getNeighbors(current)) {
        // Ignora obstáculos ou nós já processados
        if (neighbor.terrain.type === 'obstacle' || explored.has(neighbor)) {
            continue;
        }
    
        const newG = current.g + neighbor.terrain.cost;
    
        // Inicializa valores caso ainda não definidos
        if (neighbor.g === undefined || neighbor.g === null || !isFinite(neighbor.g)) {
            neighbor.g = Infinity;
            neighbor.f = Infinity;
        }
    
        // Se encontrou um caminho melhor até o vizinho
        if (newG < neighbor.g) {
            neighbor.parent = current;
            neighbor.g = newG;
            neighbor.h = heuristic(neighbor, goalNode);
            neighbor.f = neighbor.g + neighbor.h;
        
            frontier.enqueue(neighbor, neighbor.f);
        
            const gridNode = newGrid.getNode(neighbor.x, neighbor.y);
            if (gridNode.state !== 'visited') {
                gridNode.state = 'frontier';
            }
        }
    }

        gridHistory.push(newGrid);
    }

    // Se a fronteira esvaziar, não há caminho
    return { finalPath: [], gridHistory };
}

/**
 * Reconstrói o caminho do nó inicial até o objetivo seguindo os ponteiros parent
 * @param {Node} node - O nó final (objetivo) a partir do qual reconstruir o caminho
 * @returns {Node[]} Array de nós representando o caminho do início ao fim
 * @throws {Error} Se o nó fornecido for inválido ou nulo
 */
function reconstructPath(node) {

    if (!node) {
        throw new Error('Nó inválido: não é possível reconstruir o caminho');
    }

    const path = [];
    let current = node;
    
    while (current) {
        path.unshift(current);
        current = current.parent;
    }
    
    return path;
}
