function Hokusai (width) {
	var scope  = this;
	var w = width;
	
	this.draw = function (){

		w = width;
		var r = 1.41; //A4 ratio
		var h = w*r;
		var k = 4; //subdivisions y

		//sheet of A4
		v3( -w/2, -h/2,  0 ); //0
		v3(  w/2, -h/2,  0 ); //1


		for (var i=0; i<k; i++){
			v3( -w/2, -h/2+h/k*i,  0 );
			v3(  w/2, -h/2+h/k*i,  0 );
		}

		f3 (0,1,2);
		f3 (0,2,3);

		f3 (3,2,4);
		f3 (3,4,5);

		f3 (5,4,6);
		f3 (5,6,7);

		f3 (7,6,8);
		f3 (7,8,9);


		//v3(  w/2,  w/2,  0 );
		//v3( -w/2,  w/2,  0 );



		//flexible paper sheets
		//fold.y = Math.sin(counter)*10;

		/*
		var vStart = v;
		for (var k = 0; k <steps; k++){
			fold.z = k/steps*h/steps;
			//fold.normalize();
			//fold.multiplyScalar(h/steps);
			v.addSelf(fold);
			v3(v);
		}

		v.x = v.x -w;
		v3(v);

		for (var k = 0; k < steps; k++){
			fold.z = (9-k)/steps*h/steps;
			//fold.normalize();
			//fold.multiplyScalar(h/steps);
			v.subSelf( fold);
			v3(v);
		}

		v.x = vStart.x+w;
		v.y = vStart.y;
		v.z = vStart.z;
		v3(v);*/
		



		f3(0,1,2);
		f3(0,2,3);


		//this.computeCentroids();
		this.computeFaceNormals();
	}

	function v3 (x,y,z){
			scope.vertices.push( new THREE.Vector3(x,y,z));
		}
	function f3 (a,b,c){
			scope.faces.push( new THREE.Face3(a,b,c) );
		}
	

	//SETUP
	THREE.Geometry.call( this );
	this.draw();

}

Hokusai.prototype = new THREE.Geometry();
Hokusai.prototype.constructor = Hokusai;
