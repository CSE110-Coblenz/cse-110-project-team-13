// wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-button');
    
    if(startButton !== null){
        startButton.addEventListener('click', function() {
            alert('Game started! (This would go to the map screen)');
            // add the screen transition here later
        });
    } else {
        console.error("Start button not found");
    }
});