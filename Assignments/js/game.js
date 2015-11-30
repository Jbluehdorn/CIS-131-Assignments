var images = document.getElementsByClassName("player");
		var raceOccurring = false;
		var winner;
		var keyRight = false;
		
		resetPlayers();
		
		var myTimer;
		
		//makes sure the players get to the new start line on resize
		window.onresize = function() {resetPlayers()};
		
		//Begins the race
		function startRace() {
			resetPlayers();
			raceOccurring = true;
			for(var i = 0; i < images.length; i++){
				if(images[i].id != 'userCharacter'){
					images[i].src = images[i].dataset.running;	
				}
			}
			myTimer = setInterval(function() {movePlayers()}, 20);
			
			document.getElementById('characterSelect').disabled = true;
		}
		
		//Moves the players for each tick of the timer and checks if they have won
		function movePlayers() {
			var speed = document.getElementById('speedPicker').value;
			for(var i = 0; i < images.length; i++){
				if(images[i].id != 'userCharacter'){
					//Moves the player to the right
					var rightVal = parseInt(images[i].style.right, 10);
					images[i].style.right = (rightVal - Math.ceil(Math.random() * (speed/10 + 1))) + "px";
					checkWinner();
				}
			} //end for
		} //end movePlayers()
		
		//Clears timers and updates fields with winner's information
		function finishRace() {
			clearInterval(myTimer);
			clearTimeout(timePassed);
			
			for(var i = 0; i < images.length; i++){
				images[i].src = images[i] == winner ? images[i].dataset.celebration : images[i].dataset.loss;
			}
			
			document.getElementById('resultScreen').style.display = 'block';
			document.getElementById('resultBG').style.display = 'block';
			
			var losers = document.getElementsByClassName('losers');
			var winners = document.getElementsByClassName('winner');
			var curLoser = 0;
			
			//Sets image for winners and losers
			winners[0].src = winner.src;
			
			if(images[0] != winner) {
				losers[curLoser].src = images[0].src;
				losers[curLoser].dataset.name = images[0].dataset.name;
				curLoser++;
			}
			if(images[1] != winner) {
				losers[curLoser].src = images[1].src;
				losers[curLoser].dataset.name = images[1].dataset.name;
				curLoser++;
			}
			if(images[2] != winner) {
				losers[curLoser].src = images[2].src;
				losers[curLoser].dataset.name = images[2].dataset.name;
				curLoser++;
			}
			
			document.getElementById('loser1Small').innerHTML = losers[0].dataset.name;
			document.getElementById('loser2Small').innerHTML = losers[1].dataset.name;
			document.getElementById('winnerSmall').innerHTML = winner.dataset.name;
			
			//reanables character changing
			document.getElementById('characterSelect').disabled = false;
		} // end finishRace()
		
		//Determines if anyone has won yet
		function checkWinner() {
			for(var i = 0; i < images.length; i++){
				raceOccurring =  parseInt(images[i].style.right, 10) <= 75 ? false : true; //Ensures that the player gets substantially over the line before giving them the win
				
				//Ends the race if there's a winner
				if(raceOccurring == false){
					winner = images[i];
					finishRace();
					break;
				}
			}
		} //end checkWinner
		
		//Returns the players to the start
		function resetPlayers() {
			clearInterval(myTimer);
			for(var i = 0; i < images.length; i++){
				if(i == 0){
					
					images[i].style = "right: " + (window.innerWidth-125) + "px; bottom: 250px;";
				}
				else if(i == 1) {
					
					images[i].style = "right: " + (window.innerWidth-125) + "px; bottom: 125px;";
				}
				else if(i ==2) {
					
					images[i].style = "right: " + (window.innerWidth-125) + "px; bottom: 0px;";
				}
				images[i].src = images[i].dataset.idle;
				
				raceOccurring = false;
			}		
			document.getElementById('characterSelect').disabled = false;
		} //end resetPlayers()
		
		//closes any active menus
		function closeMenus() {
			document.getElementById('resultBG').style.display = 'none';
		} //end closeMenus
		
		//Changes the background of the gameboard
		function changeGameBackground() {
			document.getElementById('GameBoard').style = document.getElementById('backgroundSelect').value;
		} // end changeGameBackground
		
		//==========Controls for the user player===================//
		var timePassed;
		
		//selects the user character
		function chooseCharacter(character) {
			if(raceOccurring == false){
				for(var i = 0; i < images.length; i++){
					images[i].removeAttribute('id');	
				}
				images[character].setAttribute('id', 'userCharacter');	
			}
			
			document.getElementById('characterSelect').selectedIndex = parseInt(character) + 1;
		}
		
		//reacts to presses to move the character
		$(document).keydown(function(e) {
			if(raceOccurring){
				//checks the click for right clicks
				if(e.keyCode == 39) {
					if(keyRight == false){
						movePlayerChar();
						
						keyRight = true;
					}
				}
				
				//checks the click for left clicks
				if(e.keyCode == 37) {
					if(keyRight){
						movePlayerChar();
						keyRight = false;
					}
				}
				checkWinner();
			}
		}); //end keydown
		
		//moves the player's character
		function movePlayerChar() {
			clearTimeout(timePassed);
			
			var character = $('#userCharacter');
			
			var speedCoeficient = $('#speedPicker').val();
			var speed = speedCoeficient < 50 ? (speedCoeficient/5) + 5 : (speedCoeficient/9) + 10;
			
			var rightPos = parseInt(document.getElementById('userCharacter').style.right, 10);
			document.getElementById('userCharacter').style.right = (rightPos - speed) + "px";
			
			
			if(character.position().left >= $('#line').position().left){
				character.position().left = $('#line').position().left
				raceOccuring = false;
				character.clearQueue();
				character.stop();
			}
			
			var path = document.getElementById('userCharacter').src.split('/');
			var image = path[path.length - 2] + '/' + path[path.length-1];
			
			if(image != document.getElementById('userCharacter').dataset.running){
				document.getElementById('userCharacter').src = document.getElementById('userCharacter').dataset.running;
			}
			timePassed = setTimeout(function() {document.getElementById('userCharacter').src = document.getElementById('userCharacter').dataset.idle;}, 250);
		}//end movePlayerChar()
		