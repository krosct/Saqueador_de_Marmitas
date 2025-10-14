// /modules/Node.js

// This code assumes the 'terrain.js' file has already been loaded.

class Node {
    /**
     * Node class constructor.
     * @param {number} x - The X coordinate of the node in the grid.
     * @param {number} y - The Y coordinate of the node in the grid.
     * @param {object} terrain - The terrain type, coming from 'Terrain' enum.
     * @param {string} [state='default'] - The visual state of the node. 'default', 'frontier', 'visited' or 'path'
     * @param {Node|null} [parent=null] - The parent node in the search path.
     * @param {number} [g=Infinity] - The path cost from the start to this node.
     * @param {number} [h=0] - The heuristic cost from this node to the goal.
     * @param {number} [f=Infinity] - The total cost (g + h).
     */
    constructor(x, y, terrain, state = 'default', parent = null, g = Infinity, h = 0, f = Infinity) {
        // Core properties
        this.x = x;
        this.y = y;
        this.terrain = terrain;
        
        // Visualization properties
        this.state = state; // 'default', 'frontier', 'visited' or 'path'

        // Properties for search algorithms
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = f;
    }

    /**
     * Creates and returns a new Node instance that is an exact copy of this one.
     * This method encapsulates cloning logic, making it reusable and cleaner.
     * @returns {Node} A new Node object with the same properties.
     */
    copy() {
        return new Node(
            this.x,
            this.y,
            this.terrain,
            this.state,
            this.parent, // The parent reference is copied, which is the expected behavior.
            this.g,
            this.h,
            this.f
        );
    }
}