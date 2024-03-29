import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { BVHLoader } from 'three/addons/loaders/BVHLoader.js';

const clock = new THREE.Clock();

let camera, controls, scene, renderer;
let mixer;

init();
animate();

const loader = new BVHLoader();
loader.load('models/bvh/001_Neutral_0_mirror_x_1_0.bvh', function (result) {
    const skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);

    scene.add(result.skeleton.bones[0]);
    scene.add(skeletonHelper);

    // play animation
    mixer = new THREE.AnimationMixer(result.skeleton.bones[0]);
    mixer.clipAction(result.clip).play();
});

function init() {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.set(0, 200, 300);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    scene.add(new THREE.GridHelper(400, 10));

    // renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 300;
    controls.maxDistance = 700;

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);
}

