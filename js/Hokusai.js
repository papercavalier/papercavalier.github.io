function Hokusai (width, subs) {
	var scope  = this;

	THREE.Geometry.call( this );
	var w = width;

	var r = 1.42; //A4 ratio
	var h = w*r;
	
	
	for (var i=0; i<subs+1; i++){
		//console.log ("Hokusai: add vertices: "+i);
		v3( -w/2, -h/2+h*i/subs,  0 );
		v3(  w/2, -h/2+h*i/subs,  0 );
	}
	//console.log ("Hokusai.js: this.vertices.length: " + this.vertices.length);

	var vNum = this.vertices.length-2;
	for (var i=0; i <vNum; i+=2){
			f4 (i, i+1, i+3, i+2);
	}
	//console.log ("Hokusai.js: this.faces.length: " + this.faces.length);

	var fNum = this.faces.length;
	for (var i= 0; i < fNum; i++){
		this.faceVertexUvs[ 0 ].push( 
			[	
				new THREE.UV(  0 , i/fNum ),
				new THREE.UV(  1 , i/fNum ),
				new THREE.UV(  1, (i+1)/fNum ),
				new THREE.UV(  0, (i+1)/fNum )
			] 
			);
	}
	//console.log ("Hokusai.js: this.faceVertexUvs[0].length: " + this.faceVertexUvs[0].length);

//this.computeFaceNormals();
//this.computeVertexNormals();

	//Face3
	/*
	var fNum = subs*2-2;
	for (var i=0; i < fNum; i++){
			//console.log ("Hokusai.js: add faces: "+i);
			f3 (i, i+1, i+2);
			
	}
	this.computeFaceNormals();
	this.computeVertexNormals();
	for (var i= 0; i < fNum; i++){
		this.faceVertexUvs[ 0 ].push( 
			[
				new THREE.UV( -w/2 , -h/2 + i/fNum*h     ),
				new THREE.UV(  w/2 , -h/2 + i/fNum*h     ),
				new THREE.UV( -w/2 , -h/2 + (i+1)/fNum*h )
				//new THREE.UV( ( i + 1 ) / gridX, iz / gridZ )
			] 
			);
	}
	*/

	this.computeCentroids();

	function v3 (x,y,z){
		scope.vertices.push( new THREE.Vector3(x,y,z));
	}
	function f3 (a,b,c){
		scope.faces.push( new THREE.Face3(a,b,c) );
	}
	function f4 (a,b,c,d){
		scope.faces.push( new THREE.Face4(a,b,c,d) );
	}
}

Hokusai.prototype = new THREE.Geometry();
Hokusai.prototype.constructor = Hokusai;
