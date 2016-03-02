		/*
		properties of board
		 */
		//initialize board Class
		Board={
			obj : document.getElementById('board'),
			boardsize : new Array(8,8),  //size of board
			table : new Array(8),
			create : function(){
				var tr='';
				for(var y =0;y<this.boardsize[0];y++){
					tr+="<tr>";
					this.table[y] = new Array(8);
					for(var x=0;x<this.boardsize[1];x++){
						var xy=new Array(y,x);
						tr+='<td id='+xy+'><canvas class="balls" width="55px" height="55px">     </canvas></td>';
					}
					tr+='</tr>';
				}
				this.obj.innerHTML=tr;
			}
		}
		Board.create();
		
		var validTable = new Array();
		for(var i =0;i<8;i++){
			validTable[i] = new Array('true','true','true','true','true','true','true','true');
		}

		// use color table to make the thing easier
		// create a table to record color of all items
		var colorTable = new Array();
		for(var i=0;i<8;i++){
			colorTable[i] = new Array('empty','empty','empty','empty','empty','empty','empty','empty');
		}

		// Class for disks
		Disk={
			red:{
				fill: 'red'
			},
			blue:{
				fill: 'blue'
			},
			black:{
				fill:'black'
			},
			green:{
				fill:'green'
			},
			yellow:{
				fill:'yellow'
			},
			orange:{
				fill:'orange'
			},
			createDiskList: function(){
				var arr = new Array(this.red,this.blue,this.black,this.green,this.yellow,this.orange);
				return arr;
			}
		}
		
		// draw disks.
		function DrawItem(position,color){
			
			validTable[position[0]][position[1]]="false";  // make the position invalid
			
			// mark the colorTable to record the color
			colorTable[position[0]][position[1]]=color.fill;
			// position is the cell to draw a item
			var temp = position[0]+","+position[1];
			
			var element = document.getElementById(temp);
			// get inner canvas
			var sub=element.childNodes[0];
			//draw circles
			var ctx = sub.getContext("2d");
			ctx.arc(28,28,23,0,2*Math.PI);
			ctx.fillStyle=color.fill;
			ctx.fill();
			ctx.stroke();
		}

		function checkCellValid(position){
			if(validTable[position[0]][position[1]]==='false'){
				return false;
			}
			return true;
		}

		/*
			if the first draw fails, find another cell to stuff balls
		 */
		function findValidCell(){
			for(var i=0;i<8;i++){
				for(var j=0;j<8;j++){
					if(checkCellValid(new Array(i,j))){
						var tmp = new Array(i,j); 
						return tmp;
					}
				}
			}
			return null;
		}

		//random make itmes and put them on board
		function randomGenerateItems(){
			var arr = Disk.createDiskList();
			for(var k=0;k<3;k++){
				//get a random position in the board
				var randomX = Math.floor(Math.random()*10)%8;
				var randomY = Math.floor(Math.random()*10)%8;
				var temp = new Array(randomX,randomY);

				// randomly pick up a color
				var colorNum = Math.floor(Math.random()*10)%6;
				if(checkCellValid(temp)){
				// false means the position is not aviliable
					DrawItem(temp,arr[colorNum]);	
				}else{
					var validPos = findValidCell(); // if the first try fails, manully choose valid position to put ball
					if(validPos==null){
						//means game over
						gameOver(); 
						location.reload(); // refresh the page
					}
					DrawItem(validPos,arr[colorNum]); 
				}
			}
		}
		
		// two clicks to move item
		var first = null;
		var firstPos = [];	

		//bind onclick event on each balls
		$('.balls').on('click',function(e){
			var pos = e.target.parentNode.id + "";
			var temp = pos.split(',');
			var arr = [parseInt(temp[0]),parseInt(temp[1])];
			if(first==null&&!checkCellValid(arr)){
				first = e.target; // store the first canvas
				firstPos = arr;
				e.target.style.opacity = '0.6';
			}else{
				// select the second canvas
				if(checkCellValid(arr)){
					
					var oriPos = firstPos[0]+","+firstPos[1]; // original value
					// operate valid table status
					validTable[firstPos[0]][firstPos[1]] = "true"; // set original avaliable again
					//set the target location to goal
					validTable[arr[0]][arr[1]] = "Goal";
					// operate color table status
					colorTable[arr[0]][arr[1]] = colorTable[firstPos[0]][firstPos[1]]; // assign new position origin color				
					
					colorTable[firstPos[0]][firstPos[1]] = "empty";
					
					// record shorest path
					var path = findShortestPath(firstPos,validTable);

					if(path==false){
						alert("No such path!!");
						validTable[arr[0]][arr[1]] = 'true';  // ret the goal position back to true.
						validTable[firstPos[0]][firstPos[1]] = 'false';
						resetPoint(oriPos);
						resetValidToTrue();
						return;
					}
					
					path.unshift(firstPos); // add the original position to path array
					//if has a valid path, draw items on these cells
					drawAllItems(path,first);
					//drawItem at the last position
					resetValidToTrue();					
					
					var ele = document.getElementById(oriPos).childNodes; //get canvas

					clearCanvas(ele);
					
					identifyPattern(arr,colorTable[arr[0]][arr[1]]); // clean items
					
					setTimeout(randomGenerateItems, 1000) 
					 
				}else{
					alert("Invalid Position");
				}
			}
		})

		function resetPoint(oriPos){
			var ele = document.getElementById(oriPos).childNodes;
			ele[0].style.opacity="";
			first = null; // reset the first canvas
			firstPos = []; 
		}
		
		function drawAllItems(path,ori){
			//get the shortest path and draw on every cell with delay effect. Final stop at the lastest point
			for(var i =0;i<path.length;i++){
				if(i==path.length-1){
					validTable[path[i][0]][path[i][1]] = 'false'; //set target value to be false
					return;
				}		
				moveForward(path[i],path[i+1]);
				//validTable[path[i][0]][[i][1]] = 'true';  // reset 'valid position back to true'
			}	
		}