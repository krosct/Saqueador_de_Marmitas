
/**
 * Representa o agente Saqueador que se move pelo grid.
 */
class Agent {
    /**
     * @param {number} gridX A posição X inicial do saqueador no grid (coluna).
     * @param {number} gridY A posição Y inicial do saqueador no grid (linha).
     * @param {number} size O tamanho em que a imagem/forma do saqueador será desenhada.
     * @param {p5.Image} img A imagem para desenhar o saqueador.
     */
    constructor(gridX, gridY, size, img) {
        this.pos = createVector(gridX, gridY);
        this.pixelPos = createVector(gridToPixel(gridX), gridToPixel(gridY));
        this.size = size - 5;
        this.img = img;
        
        this.isMoving = false;
        this.path = [];
        this.currentPathIndex = 0;
    }

    /**
     * Define a posição lógica e visual do agente, parando qualquer movimento.
     * Use esta função para "teleportar" ou posicionar o agente.
     * @param {number} gridX Nova posição X no grid.
     * @param {number} gridY Nova posição Y no grid.
     */
    setPosition(gridX, gridY) {
        this.pos.set(gridX, gridY);
        this.pixelPos.set(gridToPixel(gridX), gridToPixel(gridY));
    }

    /**
     * Define um novo caminho para o agente seguir e inicia o movimento.
     * @param {Array<Node>} newPath Um array de nós do grid.
     */
    setPath(newPath) {
        if (!newPath || newPath.length === 0) {
            this.isMoving = false;
            return;
        }

        this.path = newPath;
        this.currentPathIndex = 0;
        
        if (this.path.length > 1) {
            this.isMoving = true;
        } else {
            this.isMoving = false; // O caminho tem apenas um nó (o local atual)
        }
    }

    /**
     * Atualiza a posição do agente a cada frame para criar a animação de movimento.
     * @param {number} speed Velocidade base da animação (0 a 1).
     */
    update(speed = 0.2) {
        if (!this.isMoving) {
            return;
        }

        let node = this.path[this.currentPathIndex];
        let target = createVector(node.x, node.y);
        
        // Ajusta a velocidade com base no custo do terreno do NÓ DE DESTINO
        let finalSpeed = speed * map(node.terrain.cost, 1, 10, 0.8, 0.3);

        let pixelTarget = createVector(gridToPixel(target.x), gridToPixel(target.y));
        this.pixelPos.lerp(pixelTarget, finalSpeed);
        const distance = this.pixelPos.dist(pixelTarget);
        
        // Quando o agente chega perto o suficiente do alvo...
        if (distance < 1) {
            this.setPosition(target.x, target.y);
            this.currentPathIndex++;
            
            // Verifica se o caminho terminou
            if (this.currentPathIndex >= this.path.length) {
                this.isMoving = false;
            }
        }
    }

    /**
     * Desenha o agente no canvas.
     */
    show() {
        if (cbDebugMode.checked()) {
            fill(150, 0, 0);
            square(this.pos.x * cellSize, this.pos.y * cellSize, cellSize);
        } else {
            image(this.img, this.pixelPos.x, this.pixelPos.y, this.size, this.size);
        }
    }

    /**
     * Retorna o nó do grid em que o agente está logicamente.
     * @param {Grid} grid O objeto grid.
     * @returns {Node} A célula/nó atual.
     */
    node(grid) {
        return grid.grid[this.pos.y][this.pos.x];
    }
    
    /**
     * Verifica se o mouse está sobre a posição visual do agente.
     * @param {number} mx Posição X do mouse.
     * @param {number} my Posição Y do mouse.
     * @returns {boolean}
     */
    isOver(mx, my) {
        const pos = this.pixelPos;
        let d = dist(mx, my, pos.x, pos.y);
        return d < this.size / 2;
    }
}