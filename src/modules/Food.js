
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
        this.size = size - 5;
        this.img = img;
    }

    /**
     * Desenha a comida no canvas.
     * Esta função converte a posição do grid para pixels antes de desenhar.
     */
    show() {
        // Converte a posição do grid para a coordenada central em pixels.
        if (cbDebugMode.checked()) {
            fill(200, 200, 0);
            square(this.pos.x * cellSize, this.pos.y * cellSize, cellSize);
        } else {
            image(this.img, gridToPixel(this.pos.x), gridToPixel(this.pos.y), this.size, this.size);
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
}
