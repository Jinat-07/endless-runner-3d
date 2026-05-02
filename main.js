import * as THREE from 'three';

// 1. ENGINE SETUP
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. LIGHTING
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));

// 3. PLAYER & LANE LOGIC
let currentLane = 0; // -1: Left, 0: Center, 1: Right
const laneWidth = 3;

const playerGeo = new THREE.BoxGeometry(1, 1, 1);
const playerMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.y = 0.5;
scene.add(player);

// 4. THE WORLD (Road)
const roadGeo = new THREE.PlaneGeometry(10, 2000);
const roadMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
const road = new THREE.Mesh(roadGeo, roadMat);
road.rotation.x = -Math.PI / 2;
scene.add(road);

camera.position.z = 6;
camera.position.y = 3;

// 5. CONTROLS (PC)
window.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowLeft' || e.key === 'a') && currentLane > -1) currentLane--;
  if ((e.key === 'ArrowRight' || e.key === 'd') && currentLane < 1) currentLane++;
  if (e.key === ' ' || e.key === 'ArrowUp') jump();
});

// 6. JUMP LOGIC
let isJumping = false;
let jumpVelocity = 0;
function jump() {
  if (isJumping) return;
  isJumping = true;
  jumpVelocity = 0.2;
}

// 7. GAME LOOP
function animate() {
  requestAnimationFrame(animate);

  // Smooth Lane Movement (Lerp)
  const targetX = currentLane * laneWidth;
  player.position.x += (targetX - player.position.x) * 0.1;

  // Jump Physics
  if (isJumping) {
    player.position.y += jumpVelocity;
    jumpVelocity -= 0.01; // Gravity
    if (player.position.y <= 0.5) {
      player.position.y = 0.5;
      isJumping = false;
    }
  }

  // Endless Road Illusion
  road.position.z += 0.4; // The "Speed" of the game
  if (road.position.z > 500) road.position.z = 0;

  camera.lookAt(player.position.x, player.position.y + 1, player.position.z - 2);
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
