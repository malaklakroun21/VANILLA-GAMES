const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('gameBoard');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

let currentPlayer = 'X';
let gameActive = true;

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click
cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
    const cell = e.target;
    if (!gameActive) return;

    cell.classList.add(currentPlayer);
    cell.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        statusText.textContent = currentPlayer +' Wins!';
        gameActive = false;
        return;
    }

    if (isDraw()) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = "The Player "+ currentPlayer +"'sTurn";
}

// Check for win
function checkWin(player) {
    return winningCombos.some(combo => {
        return combo.every(index => cells[index].classList.contains(player));
    });
}

// Check for draw
function isDraw() {
    return [...cells].every(cell => cell.classList.contains('X') || cell.classList.contains('O'));
}

// Restart game
restartButton.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.classList.remove('X', 'O');
        cell.textContent = '';
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent ='The Player '+currentPlayer+"'s Turn";
});
function checkWin(player) {
    for (let combo of winningCombos) {
        if (combo.every(index => cells[index].classList.contains(player))) {
            highlightWinningCells(combo);
            return true;
        }
    }
    return false;
}

function highlightWinningCells(combo) {
    combo.forEach(index => {
        cells[index].classList.add('win'); // Apply a class to winning cells
    });
}
restartButton.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.classList.remove('X', 'O', 'win'); // Remove win highlight
        cell.textContent = '';
        cell.style.backgroundColor = ''; // Reset background color
        cell.addEventListener('click', handleClick, { once: true });
    });
    currentPlayer = 'X';
    gameActive = true;
    statusText.textContent = 'The Player '+currentPlayer+"'s Turn";
});
// Initialize game status
statusText.textContent = 'The Player '+currentPlayer+"'s Turn";