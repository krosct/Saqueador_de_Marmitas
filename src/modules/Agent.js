
/**
 * Representa o agente Saqueador (Marauder) que se move pelo grid.
 */
class Agent {
    /**
     * @param {number} gridX A posição X inicial do saqueador no grid (coluna).
     * @param {number} gridY A posição Y inicial do saqueador no grid (linha).
     * @param {number} size O tamanho em que a imagem/forma do saqueador será desenhada.
     * @param {p5.Image} img A imagem para desenhar o saqueador.
     */
    constructor(gridX, gridY, size, img) {
        this.gridPos = createVector(gridX, gridY);
        this.pixelPos = createVector(gridToPixel(gridX), gridToPixel(gridY));
        this.size = size - 5;
        this.img = img;
        
        // * --- Propriedades para movimento ---
        this.targetPixelPos = this.pixelPos.copy();
        this.isMoving = false;
        
        // * --- CONTROLE DE VELOCIDADE ---
        // Valor entre 0 e 1. Quanto maior, mais rápido.
        this.animationSpeed = 0.2;

        // * --- NOVAS PROPRIEDADES PARA SEGUIR O CAMINHO ---
        this.path = []; // Armazena a lista de nós (caminho) a ser seguido
        this.currentPathIndex = 0; // O índice do nó no caminho para o qual estamos nos movendo
    }

    /**
     * Define um novo caminho para o saqueador seguir e inicia o movimento.
     * @param {Array<p5.Vector>} newPath Um array de vetores p5.js com as coordenadas do grid.
     */
    setPath(newPath) {
        this.path = newPath;
        this.currentPathIndex = 0;
        this.setNextTarget();
    }

    /**
     * Método interno privado para definir o próximo alvo do caminho.
     * É chamado quando o movimento começa e toda vez que um nó do caminho é alcançado.
     */
    setNextTarget() {
        if (!this.path || this.currentPathIndex >= this.path.length) {
            this.path = [];
            this.isMoving = false;
            return;
        }

        const nextNodeGridPos = this.path[this.currentPathIndex];
        this.targetPixelPos = createVector(gridToPixel(nextNodeGridPos.x), gridToPixel(nextNodeGridPos.y));
        this.isMoving = true;
    }

    /**
     * Atualiza a posição do saqueador a cada frame para criar a animação.
     */
    update() {
        if (!this.isMoving) {
            return;
        }

        // Interpola a posição atual em direção ao alvo para criar o movimento suave
        this.pixelPos.lerp(this.targetPixelPos, this.animationSpeed);

        const distance = this.pixelPos.dist(this.targetPixelPos);

        // Quando o saqueador chega perto o suficiente do alvo...
        if (distance < 1) {
            this.pixelPos.set(this.targetPixelPos);

            // Atualiza a posição lógica do grid
            const currentTargetNode = this.path[this.currentPathIndex];
            this.gridPos.set(currentTargetNode.x, currentTargetNode.y);

            // Prepara para ir para o PRÓXIMO nó do caminho
            this.currentPathIndex++;
            this.setNextTarget();
        }
    }

    /**
     * Desenha o saqueador no canvas na sua posição de pixel atual.
     */
    show() {
        imageMode(CENTER);
        image(this.img, this.pixelPos.x, this.pixelPos.y, this.size, this.size);
    }

    node(grid) {
        let a = grid.grid[this.gridPos.y][this.gridPos.x];
        // console.log(a);
        return a;
    }
}
