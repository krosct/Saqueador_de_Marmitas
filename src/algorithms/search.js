import { PriorityQueue } from './PriorityQueue.js';
import { manhattanDistance, euclideanDistance } from './heuristics.js';

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

                const newGrid = initialGrid.copy();
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

                const newGrid = initialGrid.copy();
                newGrid.getNode(neighbor.x, neighbor.y).state = 'frontier';
                newGrid.getNode(current.x, current.y).state = 'visited';
                gridHistory.push(newGrid);
            }
        }
    }

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

export { uniformCostSearch, greedyBestFirstSearch };