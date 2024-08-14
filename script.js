
// JavaScript para manejar el puzzle de 3x3 (9 piezas)
const container = document.getElementById('puzzle-container');
const resetButton = document.getElementById('reset-button');
const completionMessage = document.getElementById('completion-message');
const soundMove = new Audio('move.mp3'); // Sonido para mover piezas
const soundComplete = new Audio('complete.mp3'); // Sonido al completar el puzzle
const imageUrl = 'puzzle.jpg'; // La imagen que quieres usar
let pieces = [];
let emptyPiece, emptyIndex;

const rows = 3;
const cols = 3;
const totalPieces = rows * cols - 1; // Dejamos un espacio para la pieza vacía
const pieceWidth = 100 / (cols - 1); // Porcentaje de ancho de cada pieza
const pieceHeight = 100 / (rows - 1); // Porcentaje de altura de cada pieza;

// Crear las piezas del puzzle, dejando la última posición vacía
function initPuzzle() {
    pieces = [];
    container.innerHTML = '';
    completionMessage.classList.add('hidden');

    // Disposición fija con la pieza vacía en la posición 6 y las demás piezas configuradas para un desafío un poco más complejo
    const initialOrder = [1, 3, 2, 4, 6, 0, 7, 8, 5]; // La pieza vacía está en la posición 6 (índice 5)
    
    for (let i = 0; i < initialOrder.length; i++) {
        if (initialOrder[i] !== 0) {
            let piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.style.backgroundImage = `url(${imageUrl})`;
            piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
            piece.style.backgroundPosition = `${((initialOrder[i] - 1) % cols) * pieceWidth}% ${(Math.floor((initialOrder[i] - 1) / cols) * pieceHeight)}%`;
            pieces.push(piece);
        } else {
            emptyPiece = document.createElement('div');
            emptyPiece.classList.add('empty-piece');
            pieces.push(emptyPiece);
        }
    }

    emptyIndex = initialOrder.indexOf(0); // Ubicación de la pieza vacía

    pieces.forEach(piece => container.appendChild(piece));
}

function swapPieces(index1, index2) {
    [pieces[index1], pieces[index2]] = [pieces[index2], pieces[index1]];

    // Actualizar el DOM
    container.innerHTML = '';
    pieces.forEach(piece => container.appendChild(piece));
}

function checkCompletion() {
    for (let i = 0; i < totalPieces; i++) {
        const expectedX = (i % cols) * pieceWidth;
        const expectedY = Math.floor(i / cols) * pieceHeight;
        const actualPosition = pieces[i].style.backgroundPosition;

        if (actualPosition !== `${expectedX}% ${expectedY}%`) {
            return false;
        }
    }
    return true;
}

container.addEventListener('click', function(e) {
    const clickedPiece = e.target;
    const clickedIndex = Array.prototype.indexOf.call(container.children, clickedPiece);

    if (clickedPiece.classList.contains('puzzle-piece') && !clickedPiece.classList.contains('empty-piece')) {
        // Verificar si la pieza clicada está adyacente a la pieza vacía
        const validMoves = [
            emptyIndex - 1,  // Izquierda
            emptyIndex + 1,  // Derecha
            emptyIndex - cols, // Arriba
            emptyIndex + cols  // Abajo
        ];

        if (validMoves.includes(clickedIndex)) {
            // Reproducir sonido de movimiento
            soundMove.play();

            // Intercambiar la pieza clicada con la pieza vacía
            swapPieces(clickedIndex, emptyIndex);
            emptyIndex = clickedIndex; // Actualizar el índice de la pieza vacía

            // Comprobar si se ha completado el puzzle
            if (checkCompletion()) {
                soundComplete.play();
                completionMessage.classList.remove('hidden');
            }
        }
    }
});

resetButton.addEventListener('click', function() {
    initPuzzle();
});

// Iniciar el puzzle al cargar la página
initPuzzle();
