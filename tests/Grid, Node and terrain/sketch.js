// sketch.js

// --- Global Variables ---
let grid;

// --- Constants for Grid Configuration ---
const GRID_COLS = 50;
const GRID_ROWS = 40;
const CELL_SIZE = 16;

/**
 * p5.js setup function.
 */
function setup() {
    const canvasWidth = GRID_COLS * CELL_SIZE;
    const canvasHeight = GRID_ROWS * CELL_SIZE;
    
    createCanvas(canvasWidth, canvasHeight);
    
    // The Grid constructor now calls generateMap() internally.
    grid = new Grid(GRID_COLS, GRID_ROWS, CELL_SIZE);
    
    console.log("Grid created! Click the mouse or press any key to generate a new map.");
}

/**
 * p5.js draw function.
 */
function draw() {
    background(51);
    
    if (grid) {
        grid.draw();
    }
}

/**
 * p5.js event function for mouse press.
 */
function mousePressed() {
    console.log("Mouse pressed. Generating a new map...");
    grid.generateMap();
}

/**
 * p5.js event function for key press.
 */
function keyPressed() {
    console.log("Key pressed. Generating a new map...");
    grid.generateMap();
}