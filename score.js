	
		/*
			identify patterns and cancle to get scores
		 */

		 // Clean canvas table
		var cleanVerticalQueue = new Array(); // store the position in the cell that will be cleaned Vertically
		var cleanHoriQueue = new Array(); // store clean items in horizantoly
		var cleanRightQueue = new Array(); // right up to left down
		var cleanLeftQueue = new Array(); // left up to right down
		
		function clearItems(Queue){
			for(var i=0;i<Queue.length;i++){
				var current = Queue[i]; // get the cell position
				validTable[current[0]][current[1]] = 'true';
				colorTable[current[0]][current[1]] = 'empty';
				var ele = document.getElementById(current[0]+","+current[1]).childNodes;
				clearCanvas(ele);
			}
		}
		
		function clearCanvas(ele){
			var ctx = ele[0].getContext("2d");
			ctx.clearRect(0,0,55,55);
			ele[0].style.opacity="";
			first = null; // reset the first canvas
			firstPos = []; 
		}

		
		function identifyPattern(position,color){
			var addScore = 0;
			//use color table as reference to cancle balls, current position of balls
			// check veritcally
			if(checkVertical(position,color)){
				clearItems(cleanVerticalQueue);
				addScore += 1;
				//resetQueue();
			}
			// check Horizantolly		
			if(checkHori(position,color)){
				clearItems(cleanHoriQueue);
				addScore += 1
				//resetQueue();
			}			
			//check Right up to left down
			if(checkRightLine(position,color)){
				clearItems(cleanRightQueue);
				addScore += 1
				//resetQueue();
			}
			//check Left up to right down
			if(checkLeftLine(position,color)){
				clearItems(cleanLeftQueue);
				addScore += 1
			}			

			var oriScore = parseInt($('#currentScoreBoard').html()); 
			
			oriScore += addScore;
			
			// record the current score and display
			$('#currentScoreBoard').html(oriScore);
            
			resetQueue(); // rest set all queues for next click
		}

		//reset direction queues
		function resetQueue(){
			cleanVerticalQueue = new Array();
			cleanHoriQueue = new Array();
			cleanRightQueue = new Array();
			cleanLeftQueue = new Array();
		}

		// check vertical direction
		function checkVertical(position,color){
			var count = 0;
			count = checkUp(position,color)+checkDown(position,color);
			if(count>=5){
				return true;
			}
			return false;
		}
		
		// check horiziotal direction
		function checkHori(position,color){
			var count = 0;
			count = checkLeft(position,color)+checkRight(position,color);
			if(count>=5){
				return true;
			}
			return false;
		}
		
		function checkRightLine(position,color){
			var count = 0;
			count = checkRightUp(position,color)+checkLeftDown(position,color);
			if(count>=5){
				return true;
			}
			return false;
		}
		
		function checkLeftLine(position,color){
			var count = 0;
			count = checkRightDown(position,color)+checkLeftUp(position,color);
			if(count>=5){
				return true;
			}
			return false;
		}
		
		function checkUp(position,color){
			var count = 0;
			for(var i=position[0]-1;i>=0;i--){ //check from current up
				if(colorTable[i][position[1]] === color){
					count++;
					cleanVerticalQueue.push(new Array(i,position[1]));
				}else{
					return count;	
				}
			} 
			return count;
		}
		
		
		function checkDown(position,color){
			var count = 0;
			for(var i=position[0];i<8;i++){ //check from current up
				if(colorTable[i][position[1]] === color){
					count++;
					cleanVerticalQueue.push(new Array(i,position[1]));
				}else{
					return count;	
				}
			} 
			return count;
		}
		
		function checkLeft(position,color){
			var count = 0;
			for(var i=position[1]-1;i>=0;i--){ //check from current up
				if(colorTable[position[0]][i] === color){
					count++;
					cleanHoriQueue.push(new Array(position[0],[i]));
				}else{
					return count;	
				}
			} 
			return count;
		}
		
		function checkRight(position,color){
			var count = 0;
			for(var i=position[1];i<8;i++){ //check from current up
				if(colorTable[position[0]][i] === color){
					count++;
					cleanHoriQueue.push(new Array(position[0],[i]));
				}else{
					return count;	
				}
			} 
			return count;	
		}
		
		function checkRightUp(position,color){
			var count=0;
			for(var i=position[0],j=position[1];i>=0&&j<8;i--,j++){
				if(colorTable[i][j]===color){
					count++;
					cleanRightQueue.push(new Array(i,j));
				}else{
					return count;
				}
			}
			return count;
		}
		
		function checkLeftUp(position,color){
			var count = 0;
			for(var i=position[0],j=position[1];i>=0&&j>=0;i--,j--){
				if(colorTable[i][j]===color){
					count++;
					cleanLeftQueue.push(new Array(i,j));
				}else{
					return count;
				}
			}
			return count;
		}
		
		function checkRightDown(position,color){
			var count = 0;
			for(var i=position[0]+1,j=position[1]+1;i<8&&j<8;i++,j++){
				if(colorTable[i][j]===color){
					count++;
					cleanLeftQueue.push(new Array(i,j));
				}else{
					return count;
				}
			}
			return count;
		}

		function checkLeftDown(position,color){
			var count=0;
			for(var i=position[0]+1,j=position[1]-1;i<8&&j>=0;i++,j--){
				if(colorTable[i][j]===color){
					count++;
					cleanRightQueue.push(new Array(i,j));
				}else{
					return count;
				}
			}
			return count;	
		}		
		
		// after each movement, generate three more balls
		randomGenerateItems();
