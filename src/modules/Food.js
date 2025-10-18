
/**
 * Representa um objeto de comida no grid.
 */
class Food {
    /**
     * @param {number} gridX A posição X da comida no grid (coluna).
     * @param {number} gridY A posição Y da comida no grid (linha).
     * @param {number} size O tamanho em que a imagem/forma da comida será desenhada.
     * @param {p5.Image} img A imagem para desenhar a comida.
     */
    constructor(gridX, gridY, size, img) {
        this.pos = createVector(gridX, gridY);
        this.size = size;
        this.img = img;
    }

    /**
     * Define a posição lógica e visual da comida.
     * Use esta função para "teleportar" ou posicionar a comida.
     * @param {number} gridX Nova posição X no grid.
     * @param {number} gridY Nova posição Y no grid.
     */
    setPosition(gridX, gridY) {
        this.pos.set(gridX, gridY);
    }

    /**
     * Desenha a comida no canvas.
     * Esta função converte a posição do grid para pixels antes de desenhar.
     */
    show() {
        // Converte a posição do grid para a coordenada central em pixels.
        if (cbDebugMode.checked()) {
            push();
            rectMode(CENTER);
            fill(255, 255, 0);
            square(gridToPixel(this.pos.x), gridToPixel(this.pos.y), slObjectSize.value() * cellSize);
            pop();
        } else {
            image(this.img, gridToPixel(this.pos.x), gridToPixel(this.pos.y), slObjectSize.value() * this.size, slObjectSize.value() * this.size);
        }
    }

    /**
     * Retorna o nó do grid em que a comida  está logicamente.
     * @param {Grid} grid O objeto grid.
     * @returns {Node} A célula/nó atual.
     */
    node(grid) {
        return grid.grid[this.pos.y][this.pos.x];
    }

    /**
     * Verifica se o mouse está sobre a posição visual da comida.
     * @param {number} mx Posição X do mouse.
     * @param {number} my Posição Y do mouse.
     * @returns {boolean}
     */
    isOver(mx, my) {
        console.log(`mx: ${mx}, my: ${my} -- gmx: ${pixelToGrid(mx)}, gmy: ${pixelToGrid(my)}`);
        let d = dist(pixelToGrid(mx), pixelToGrid(my), this.pos.x, this.pos.y);
        return d === 0;
    }
}
