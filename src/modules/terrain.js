// /modules/terrain.js

/**
Defines the map terrain types.
Works as an "enum" to ensure consistency across the project.

Each terrain has the properties:
    - name: A string identifier.
    - cost: The energy cost for the agent to traverse a node of this type.
    - color: A HEX color code used for p5.js fill.
    - isObstacle: Boolean indicating if the node is an obstacle (not traversable).
 */
const Terrain = {
    SAND: {
    name: 'sand',
        cost: 1,
        color: '#e7be89ff', //
        isObstacle: false,
    },
    SWAMP: {
    name: 'swamp',
        cost: 5,
        color: '#548107ff', //
        isObstacle: false,
    },
    WATER: {
    name: 'water',
        cost: 10,
        color: '#3e97e0ff', //
        isObstacle: false,
    },
    OBSTACLE: {
        name: 'obstacle',
        cost: Infinity,
        color: '#595959ff',
        isObstacle: true,
    }
};

// Prevents the object from being modified accidentally elsewhere in the code
Object.freeze(Terrain);