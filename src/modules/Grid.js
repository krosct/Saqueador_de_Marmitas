// /modules/Grid.js

// This code assumes that 'terrain.js' and 'Node.js' have been loaded

class Grid {
    /**
     * The main class for managing the game map.
     * @param {number} cols - The number of columns in the grid.
     * @param {number} rows - The number of rows in the grid.
     * @param {number} cellSize - The pixel size (width and height) of each cell.
     */
    constructor(cols, rows, cellSize) {
        this.cols = cols;
        this.rows = rows;
        this.cellSize = cellSize;
        
        // The grid is a 2D array that will be filled with Node objects.
        this.grid = [];

        this.generateMap();
    }

    /**
     * Fills the grid with Node objects, assigning a terrain type to each
     * using Perlin Noise for a natural, smooth look.
     * This method uses a two-phase approach:
     * 1. Base terrain (water, swamp, sand) - highly clustered using low-frequency noise
     * 2. Obstacles - more dispersed using high-frequency noise
     */
    generateMap() {
        // PHASE 1: Generate base terrain (water, swamp, sand) with high clustering
        // Low scale = larger, smoother, more clustered areas
        const terrainScale = 0.1;
        
        // Use a random offset to vary the noise pattern each time
        const terrainOffsetX = 0; //random(1000);
        const terrainOffsetY = 0; //random(1000);
        
        const waterThreshold = 0.3;
        const swampThreshold = 0.4;

        // PHASE 2: Add obstacles as a separate layer with more dispersion
        // Higher scale = smaller, more scattered, dispersed patterns
        const obstacleScale = 0.4;
        const obstacleOffsetX = random(1000);
        const obstacleOffsetY = random(1000);
        
        // Obstacle density threshold - adjust this to control obstacle quantity
        // Higher threshold = fewer obstacles
        const obstacleThreshold = 0.6;

        for (let y = 0; y < this.rows; y++) {
            this.grid[y] = []; // Initialize the row
            for (let x = 0; x < this.cols; x++) {
                // Generate smooth, clustered base terrain
                const terrainNoise = noise(
                    (x * terrainScale) + terrainOffsetX,
                    (y * terrainScale) + terrainOffsetY
                );
                
                let terrainType;

                // Map noise to base terrain types (no obstacles yet)
                // Adjusted thresholds to create more balanced terrain distribution
                if (terrainNoise < waterThreshold) {
                    terrainType = Terrain.WATER;
                } else if (terrainNoise < swampThreshold) {
                    terrainType = Terrain.SWAMP;
                } else {
                    terrainType = Terrain.SAND;
                }
                
                // Create the node with base terrain
                this.grid[y][x] = new Node(x, y, terrainType);
            }
        }

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                // Generate dispersed obstacle pattern
                const obstacleNoise = noise(
                    (x * obstacleScale) + obstacleOffsetX,
                    (y * obstacleScale) + obstacleOffsetY
                );
                
                // Only place obstacles where noise exceeds threshold
                // This creates a more scattered, dispersed distribution
                if (obstacleNoise > obstacleThreshold) {
                    // Replace the existing terrain with an obstacle
                    this.grid[y][x].terrain = Terrain.OBSTACLE;
                }
            }
        }
    }

    /**
     * Gets a specific node from the grid by its coordinates.
     * @param {number} x - The column index of the node.
     * @param {number} y - The row index of the node.
     * @returns {Node|null} The Node object at the given coordinates, or null if out of bounds.
     */
    getNode(x, y) {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
            return this.grid[y][x];
        }
        return null;
    }

    /**
     * Finds all valid, non-obstacle neighbors of a given node.
     * This method is essential for all search algorithms.
     * @param {Node} node - The node to find neighbors for.
     * @returns {Node[]} An array of neighboring Node objects.
     */
    getNeighbors(node) {
        const neighbors = [];
        const { x, y } = node;

        // Check the four cardinal directions (up, down, left, right)
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 }   // Right
        ];

        for (const dir of directions) {
            const neighborX = x + dir.dx;
            const neighborY = y + dir.dy;

            const neighborNode = this.getNode(neighborX, neighborY);
            
            // If the neighbor exists and is not an obstacle, add it to the list.
            if (neighborNode && !neighborNode.terrain.isObstacle) {
                neighbors.push(neighborNode);
            }
        }

        return neighbors;
    }

    /**
     * Draws the entire grid onto the p5.js canvas.
     * It colors each node based on its state ('frontier', 'visited', etc.)
     * or its natural terrain color if its state is 'default'.
     */
    draw() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const node = this.grid[y][x];
                let nodeColor;

                // The state property takes precedence for coloring.
                switch (node.state) {
                    case 'frontier':
                        nodeColor = '#FFFF00'; // Yellow
                        break;
                    case 'visited':
                        nodeColor = '#ADD8E6'; // Light Blue
                        break;
                    case 'path':
                        nodeColor = '#FF00FF'; // Magenta
                        break;
                    default:
                        // If the state is 'default', use the terrain's natural color.
                        nodeColor = node.terrain.color;
                        break;
                }

                fill(nodeColor);
                stroke(200); // Light grey border for cells
                strokeWeight(0.5);
                rect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }
    
    /**
     * Creates and returns a deep copy of this grid.
     * This is CRITICAL for creating the frame-by-frame history of the search algorithms
     * without modifying previous steps.
     * @returns {Grid} A new Grid object that is an exact copy.
     */
    copy() {
        // Create a new Grid instance. Note that we pass 'null' for the cell size
        // and then manually set the properties to avoid re-running generateMap.
        const newGrid = new Grid(this.cols, this.rows, 0);
        newGrid.cellSize = this.cellSize;
        newGrid.grid = [];

        for (let y = 0; y < this.rows; y++) {
            newGrid.grid[y] = [];
            for (let x = 0; x < this.cols; x++) {
                // Use the Node's own copy() method for a clean and encapsulated copy.
                newGrid.grid[y][x] = this.grid[y][x].copy();
            }
        }
        return newGrid;
    }
}
