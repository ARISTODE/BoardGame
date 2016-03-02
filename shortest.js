		/*
			methods for finding shortest path
		 */
		
		
		function moveForward(ori,tar){
			var posOri = ori[0]+","+ori[1];  
			var posTar = tar[0]+","+tar[1];
			var oriCel = document.getElementById(posOri).childNodes;
			var oriEle = oriCel[0];
			var tarCel = document.getElementById(posTar).childNodes;
			var tarEle = tarCel[0];
			var ctxOri = oriEle.getContext("2d");
			var ctxTar = tarEle.getContext("2d");
			ctxTar.drawImage(oriEle,0,0);
			setTimeout(function(){
				ctxOri.clearRect(0,0,55,55);	
			}, 150); 
		}
		
		function findShortestPath(start,board){
			// if has return a path, if no return invalid try
			var location = {
				disFromTop: start[0],
				disFromLeft: start[1],
				path:[],
				status: 'Start'
			};
			
			// initial the queue by put first location inside it.
			var queue = [location];
			
			while(queue.length>0){
				var currentLocation = queue.shift();
				// explore north(up direction)
				var newLocation = goDirect(currentLocation,'North',board); // board is the validTable
				if(newLocation.status === 'Goal'){
					return newLocation.path;
				}else if(newLocation.status==='true'){
					queue.push(newLocation);	
				}
			
				// explore East, right direction
				var newLocation = goDirect(currentLocation,'East',board); // board is the validTable
				if (newLocation.status === 'Goal') {
			      return newLocation.path;
			    } else if (newLocation.status === 'true') {
			      queue.push(newLocation);
			    }	
			
				// explore South, down direction
				var newLocation = goDirect(currentLocation,'South',board); // board is the validTable
				if (newLocation.status === 'Goal') {
			      return newLocation.path;
			    } else if (newLocation.status === 'true') {
			      queue.push(newLocation);
			    }
			
				// explore West, left direction
				var newLocation = goDirect(currentLocation,'West',board); // board is the validTable
				if (newLocation.status === 'Goal') {
			      return newLocation.path;
			    } else if (newLocation.status === 'true') {
			      queue.push(newLocation);
			    }
			}
			
			return false;
		}
		
		function locationStatus(location,board){
			var dft = location.disFromTop;
			var dfl = location.disFromLeft;
			if(dft<0||dft>7||dfl<0||dfl>7){
				return 'false';
			}else if(board[dft][dfl]==='Goal'){
				return 'Goal';
			}else if(board[dft][dfl]!=='true'){
				return 'false';
			}else{
				return 'true';
			}
			
		}
		
		// explore new direction and record the path. Refresh status
		function goDirect(currentLocation,direction,board){
			var newPath = currentLocation.path.slice();
			
			var dft = currentLocation.disFromTop;
			var dfl = currentLocation.disFromLeft;
			if(direction==='North'){
				dft -= 1;
			}else if(direction==='East'){
				dfl +=1;
			}else if(direction==='South'){
				dft += 1;
			}else if(direction==='West'){
				dfl -=1;
			}
			
			var newLocation = {
				disFromTop: dft,
				disFromLeft: dfl,
				path: newPath,
				status: 'Unknown'
			}
			
			newPath.push(new Array(dft,dfl)); // push the next location into the queue
		
			newLocation.status = locationStatus(newLocation,board);
			
			if(newLocation.status==='true'){
				board[dft][dfl] = 'valid'; // change valid, and the next time detect the position return false
			}	
			return newLocation;
		}
		
		function resetValidToTrue(){
			for(var i=0;i<8;i++){
				for(var j=0;j<8;j++){
					if(validTable[i][j]==='valid'){
						validTable[i][j] = 'true';
					}
				}
			}
		}


		