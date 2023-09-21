let scene,
    camera,
    renderer,
    effect,
    cube,
    ambientLight,
    pointLight;

let mouse = {
	x: 0,
	y: 0
};

init();
render();

function init() {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xFFFFFF);

	// Renderer
    
    // setup container
    /*
    container = document.createElement('div');

    container.style.position = 'absolute';
    container.style.left = '0px';
    container.style.top = '0px';
    container.style.height = '100vh';
    container.style.width = '100vw';
    container.style.zIndex = '0';

    document.querySelector(".three-container").appendChild(container);
    */

	renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setClearColor(0xFFFFFF)
	renderer.setSize( window.innerWidth, window.innerHeight );
    
    effect = new THREE.AsciiEffect(renderer, ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwsubuccubusB@$');
    effect.setSize( window.innerWidth, window.innerHeight );

	document.querySelector('.three-container').appendChild(effect.domElement);

	// Camera
	let screenWidth = window.innerWidth,
			screenHeight = window.innerHeight,
			viewAngle = 75,
			nearDistance = 0.1,
			farDistance = 1000;
	camera = new THREE.PerspectiveCamera(viewAngle, screenWidth / screenHeight, nearDistance, farDistance);
	camera.position.z = 0.75;
	camera.lookAt(scene.position);

	// Lights
	// Ambient light
	ambientLight = new THREE.AmbientLight(0x333333, 0.025);
	scene.add(ambientLight);

	// Point light
	pointLight = new THREE.PointLight(0xFFFFFF, 10, 2, 10);
	pointLight.position.set(0, 0, 0);
	pointLight.castShadow = true;
	pointLight.shadow.bias = 0.0001;
	pointLight.mapSizeWidth = 2048; // Shadow Quality
	pointLight.mapSizeHeight = 2048; // Shadow Quality
	scene.add(pointLight);

	// Cube
	let cubeGeometry = new THREE.BoxGeometry( 0.75, 0.75, 0.75 );
	let cubeMaterial = new THREE.MeshPhongMaterial({ // Required For Shadows
		color: 0x888888,
		specular: 0x000000,
		shininess: 10
	});
	cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	cube.castShadow = true;
	cube.receiveShadow = true;
	cube.position.set(0, 0, -1);
	cube.rotation.x = 10;
	cube.rotation.y = 20;
	scene.add( cube );

	// Listeners
	document.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('resize', onResize);
}

// Render Loop
function render() {
	requestAnimationFrame( render );
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;
	effect.render( scene, camera );
}

// On mouse move
function onMouseMove(event) {
	event.preventDefault();
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	let vector = new THREE.Vector3(mouse.x, mouse.y, 1.0);
	vector.unproject(camera);
	let dir = vector.sub(camera.position).normalize();
	let distance = -camera.position.z / dir.z;
	let pos = camera.position.clone().add(dir.multiplyScalar(distance));
	pointLight.position.copy(pos);
};

// On resize
function onResize() {
	let width = window.innerWidth;
	let height = window.innerHeight;
	renderer.setSize(width, height);
    effect.setSize(width, height);
	camera.aspect = width/height;
	camera.updateProjectionMatrix();
}