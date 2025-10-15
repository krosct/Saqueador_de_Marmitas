
/**
 * Representa um objeto de comida no grid.
 */
class Food {
    /**
     * @param {number} gridX A posição X da comida no grid (coluna).
     * @param {number} gridY A posição Y da comida no grid (linha).
     * @param {number} size O tamanho em que a imagem/forma da comida será desenhada.
     */
    constructor(gridX, gridY, size, img) {
        // Armazena a posição no grid como um vetor p5.js.
        this.gridPos = createVector(gridX, gridY);
        this.size = size;
        this.img = img;
    }

    /**
     * Desenha a comida no canvas.
     * Esta função converte a posição do grid para pixels antes de desenhar.
     */
    show() {
        // Converte a posição do grid para a coordenada central em pixels.
        const pixelX = gridToPixel(this.gridPos.x);
        const pixelY = gridToPixel(this.gridPos.y);
        
        imageMode(CENTER);
        image(this.img, pixelX, pixelY, this.size, this.size);
    }

    node(grid) {
        return grid.grid[this.gridPos.y][this.gridPos.x];
    }
}
