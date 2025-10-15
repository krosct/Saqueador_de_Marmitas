/**
 * Calcula a distância Manhattan entre dois nós.
 * A distância Manhattan é a soma das diferenças absolutas das coordenadas.
 * É uma boa heurística quando o movimento é permitido apenas nas direções horizontal e vertical.
 * @param {Node} nodeA - O nó inicial
 * @param {Node} nodeB - O nó objetivo
 * @returns {number} A distância Manhattan entre os nós
 */
function manhattanDistance(nodeA, nodeB) {
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

/**
 * Calcula a distância Euclidiana entre dois nós.
 * A distância Euclidiana é a distância em linha reta entre dois pontos.
 * @param {Node} nodeA - O nó inicial
 * @param {Node} nodeB - O nó objetivo
 * @returns {number} A distância Euclidiana entre os nós
 */
function euclideanDistance(nodeA, nodeB) {
    const dx = nodeA.x - nodeB.x;
    const dy = nodeA.y - nodeB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Calcula o custo estimado considerando o terreno.
 * Multiplica a distância pelo custo mínimo possível do terreno (custo da areia = 1).
 * Isso mantém a heurística admissível para o A*.
 * @param {Node} nodeA - O nó inicial
 * @param {Node} nodeB - O nó objetivo
 * @param {Function} distanceFunction - A função de distância a ser usada (Manhattan ou Euclidiana)
 * @returns {number} O custo estimado do caminho
 */
function terrainAwareHeuristic(nodeA, nodeB, distanceFunction) {
    // Usando o custo mínimo (areia = 1) para manter a heurística admissível
    const minTerrainCost = 1;
    return distanceFunction(nodeA, nodeB) * minTerrainCost;
}
