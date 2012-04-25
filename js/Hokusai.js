function Hokusai (width, subs) {
	var scope  = this;

	THREE.Geometry.call( this );
	var w = width;

	var r = 1.42; //A4 ratio
	var h = w*r;

	
	for (var i=0; i<subs; i++){

		v3( -w/2, -h/2+h*i/subs,  0 );
		v3(  w/2, -h/2+h*i/subs,  0 );
	}

	for (var i=0; i< subs*2-2; i++){
			//console.log ("Hokusai: add faces: "+i);
			f3 (i, i+1, i+2);
	}

	//console.log ("Hokusai: this.vertices.length: " + this.vertices.length);
	//console.log ("Hokusai: this.faces.length: " + this.faces.length);

	this.computeFaceNormals();


	function v3 (x,y,z){
		scope.vertices.push( new THREE.Vector3(x,y,z));
	}
	function f3 (a,b,c){
		scope.faces.push( new THREE.Face3(a,b,c) );
	}

}

Hokusai.prototype = new THREE.Geometry();
Hokusai.prototype.constructor = Hokusai;
