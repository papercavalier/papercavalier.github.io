function Paper ($index, $pos) {
	var index = $index;
	var scope  = this;
	var drag = .98;
	var homeforce = .05;
	var mouseforce = .4;
	var mouseforcerange = 34;
	//var topspeed = 10;
	
	var mouseZ = 0;
	var seed = Math.random();
	var counter = 0;
	//var type, velocity;
	
	//Vector3
	var loc, acceleration, vel, homedir, dir, newLoc;
	
	var w = 10;
	var h = 30;
	var steps=10;
	var fold = new THREE.Vector3 ((Math.random()-.5)*2+.3,Math.random()+.3,(Math.random()-.5)*2+.3);
	
	var geometry;
	
	var homePos = new THREE.Vector3($pos.x+seed*100-50, $pos.y, $pos.z);
	loc = homePos;
	
	acceleration = new THREE.Vector3(-0.001, 0.02, 0.01);
	vel = new THREE.Vector3(0.2, 0.4, 0.2);
	
	
	this.update = function update (mouseX, mouseY) {
			
			//this.draw();
			
			
			 drag = .98;
			var mouse = new THREE.Vector3 (mouseX, mouseY, mouseZ);
		    
			
			dir = new THREE.Vector3 ();
			dir.sub(mouse, loc);
			
			homedir = new THREE.Vector3();
			homedir.sub(homePos,loc);
			
			
			if(dir.length() < mouseforcerange){
				  dir.normalize();
				  dir.multiplyScalar(mouseforce);
				  acceleration = dir;
				  vel.addSelf(acceleration);
			} else {
				 homedir.normalize();
				 homedir.multiplyScalar(homeforce);
				 vel.addSelf(homedir);
	
			}
			
			/*if (homedir.length() < .06 && vel.length() < .06){
				newLoc = new PVector(random(10)-5, random(10)-5, random(10)-5);
				newLoc.add(home);
				home = newLoc;
				loc = home;
			 
			}*/
		   // velocity =  vel.length();
			//vel.limit(vel, topspeed);
			
			vel.multiplyScalar(drag);
			
			loc.addSelf(vel);
			
			this.position.x = loc.x;
			this.position.y = loc.y;
			this.position.z = loc.z;
			
			
			
			
	}
	
	this.draw = function (width){
		
		w = width;
		//GEOMETRY
		geometry = new THREE.Geometry();
		
		var v = new THREE.Vector3 (0,0,0);
		//fold.y = Math.sin(counter)*10;
		createNewPoint(v);
		
		var vStart = v;
		for (var k = 0; k <steps; k++){
			fold.z = k/steps*h/steps;
			//fold.normalize();
			//fold.multiplyScalar(h/steps);
			v.addSelf(fold);
			createNewPoint(v);
		}
		
		v.x = v.x -w;
		createNewPoint(v);
	
		for (var k = 0; k < steps; k++){
			fold.z = (9-k)/steps*h/steps;
			//fold.normalize();
			//fold.multiplyScalar(h/steps);
			v.subSelf( fold);
			createNewPoint(v);
		}
		
		v.x = vStart.x+w;
		v.y = vStart.y;
		v.z = vStart.z;
		createNewPoint(v);
		
		this.position.x = index*12-60;
	}
	
	function createNewPoint (v){
			vertex = new THREE.Vertex();
			vertex.position.x = v.x;
			vertex.position.y = v.y;
			vertex.position.z = v.z;
			geometry.vertices.push( new THREE.Vertex( vertex.position ) );
		}
	//creates flat circle material = particle
	/*var PI2 = Math.PI * 2;
	var material = new THREE.vertexCanvasMaterial( {

		color: 0xffffff,
		program: function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();

		}

	} );*/
	
	
	//SETUP
	this.draw(w);
	THREE.Line.call( scope, geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5} ));
}

Paper.prototype = new THREE.Line();
Paper.prototype.constructor = Paper;