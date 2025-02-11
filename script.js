
        function openGame(game) {
            const modal = document.getElementById('gameModal');
            const gameFrame = document.getElementById('gameFrame');
            
            // Set the appropriate game URL
            gameFrame.src = `./${game}.html`;
            modal.style.display = 'block';
        }

        function closeModal() {
            const modal = document.getElementById('gameModal');
            const gameFrame = document.getElementById('gameFrame');
            gameFrame.src = '';
            modal.style.display = 'none';
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('gameModal');
            if (event.target == modal) {
                closeModal();
            }
        }
    