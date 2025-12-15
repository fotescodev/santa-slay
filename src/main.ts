import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Engine } from '@babylonjs/core/Engines/engine';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Scene } from '@babylonjs/core/scene';

import { Game, GamePhase, ObstacleInstance, PickupInstance } from '@core/game/Game';
import { clamp } from '@core/util/math';
import { PointerSteerInput } from '@web/input/PointerSteerInput';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const giftCounterEl = document.getElementById('giftCounter') as HTMLDivElement;
const hintEl = document.getElementById('hint') as HTMLDivElement;
const statusEl = document.getElementById('status') as HTMLDivElement;
const restartButton = document.getElementById('restart') as HTMLButtonElement;

const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: false,
  stencil: false,
  antialias: true
});

const obstacleHeights = {
  tree: 3,
  rock: 1.3,
  fence: 1.1
};

interface Materials {
  snow: StandardMaterial;
  sleigh: StandardMaterial;
  tree: StandardMaterial;
  rock: StandardMaterial;
  fence: StandardMaterial;
  pickup: StandardMaterial;
}

function createMaterials(scene: Scene): Materials {
  const snow = new StandardMaterial('snow', scene);
  snow.diffuseColor = new Color3(0.9, 0.95, 1);

  const sleigh = new StandardMaterial('sleigh', scene);
  sleigh.diffuseColor = new Color3(0.87, 0.1, 0.18);

  const tree = new StandardMaterial('tree', scene);
  tree.diffuseColor = new Color3(0.1, 0.5, 0.2);

  const rock = new StandardMaterial('rock', scene);
  rock.diffuseColor = new Color3(0.6, 0.6, 0.65);

  const fence = new StandardMaterial('fence', scene);
  fence.diffuseColor = new Color3(0.7, 0.45, 0.2);

  const pickup = new StandardMaterial('pickup', scene);
  pickup.diffuseColor = new Color3(1, 0.85, 0.2);

  return { snow, sleigh, tree, rock, fence, pickup };
}

function createObstacleBases(scene: Scene, materials: Materials) {
  const tree = MeshBuilder.CreateCylinder('treeBase', { height: obstacleHeights.tree, diameterTop: 0.6, diameterBottom: 1.4 }, scene);
  tree.material = materials.tree;
  tree.setEnabled(false);

  const rock = MeshBuilder.CreateSphere('rockBase', { diameter: obstacleHeights.rock }, scene);
  rock.material = materials.rock;
  rock.setEnabled(false);

  const fence = MeshBuilder.CreateBox(
    'fenceBase',
    { height: obstacleHeights.fence, width: 2.4, depth: 0.4 },
    scene
  );
  fence.material = materials.fence;
  fence.setEnabled(false);

  return { tree, rock, fence } as const;
}

function createPickupBase(scene: Scene, materials: Materials) {
  const pickup = MeshBuilder.CreateSphere('pickupBase', { diameter: 1 }, scene);
  pickup.material = materials.pickup;
  pickup.setEnabled(false);
  return pickup;
}

function createScene() {
  const scene = new Scene(engine);
  scene.clearColor = new Color3(0.05, 0.08, 0.14).toColor4(1);
  const materials = createMaterials(scene);

  const camera = new ArcRotateCamera('cam', Math.PI / 2, Math.PI / 3, 18, new Vector3(0, 1.4, 10), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 16;
  camera.upperRadiusLimit = 22;
  camera.lowerBetaLimit = Math.PI / 4;
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.inputs.clear();

  new HemisphericLight('light', new Vector3(0.2, 1, 0.1), scene);

  const ground = MeshBuilder.CreateGround('ground', { width: 40, height: 2400 }, scene);
  ground.position.z = 1000;
  ground.material = materials.snow;

  const sleigh = MeshBuilder.CreateBox('sleigh', { height: 1.2, width: 1.2, depth: 2 }, scene);
  sleigh.position.y = 0.8;
  sleigh.material = materials.sleigh;

  const obstacleBases = createObstacleBases(scene, materials);
  const pickupBase = createPickupBase(scene, materials);

  return { scene, camera, sleigh, obstacleBases, pickupBase };
}

let game = new Game();
let obstacleMeshes = new Map<string, InstancedMesh>();
let pickupMeshes = new Map<string, InstancedMesh>();

function resetRun() {
  game = new Game();
  for (const mesh of obstacleMeshes.values()) mesh.dispose();
  for (const mesh of pickupMeshes.values()) mesh.dispose();
  obstacleMeshes = new Map();
  pickupMeshes = new Map();
  statusEl.textContent = '';
  restartButton.classList.remove('show');
}

const { scene, camera, sleigh, obstacleBases, pickupBase } = createScene();
const input = new PointerSteerInput(canvas);
const cameraTarget = new Vector3();

restartButton.addEventListener('click', (e) => {
  e.preventDefault();
  resetRun();
});

function syncObstacles(obstacles: ObstacleInstance[]) {
  const active = new Set<string>();
  for (const obstacle of obstacles) {
    active.add(obstacle.id);
    let mesh = obstacleMeshes.get(obstacle.id);
    if (!mesh) {
      const source = obstacleBases[obstacle.type];
      mesh = source.createInstance(`ob-${obstacle.id}`);
      obstacleMeshes.set(obstacle.id, mesh);
    }
    mesh.position.set(obstacle.x, obstacleHeights[obstacle.type] * 0.5, obstacle.z);
  }

  for (const [id, mesh] of obstacleMeshes) {
    if (!active.has(id)) {
      mesh.dispose();
      obstacleMeshes.delete(id);
    }
  }
}

function syncPickups(pickups: PickupInstance[]) {
  const active = new Set<string>();
  for (const pickup of pickups) {
    active.add(pickup.id);
    let mesh = pickupMeshes.get(pickup.id);
    if (!mesh) {
      mesh = pickupBase.createInstance(`pickup-${pickup.id}`);
      pickupMeshes.set(pickup.id, mesh);
    }
    mesh.position.set(pickup.x, 0.6, pickup.z);
    mesh.scaling.setAll(clamp(0.8 + pickup.value * 0.1, 0.8, 1.2));
  }

  for (const [id, mesh] of pickupMeshes) {
    if (!active.has(id)) {
      mesh.dispose();
      pickupMeshes.delete(id);
    }
  }
}

function updateHud(phase: GamePhase) {
  giftCounterEl.textContent = `🎁 ${game.state.gifts}`;
  hintEl.style.opacity = game.sleighZ < 10 && phase === 'running' ? '1' : '0';
  if (phase === 'finished') {
    statusEl.textContent = 'Finish! 🎉 Gifts delivered!';
  } else if (phase === 'out-of-gifts') {
    statusEl.textContent = 'Out of gifts! Tap Restart';
  } else {
    statusEl.textContent = '';
  }
  if (phase !== 'running') restartButton.classList.add('show');
}

scene.onBeforeRenderObservable.add(() => {
  const dt = scene.getEngine().getDeltaTime() / 1000;
  game.update(dt, input.steer);

  sleigh.position.x = game.sleighX;
  sleigh.position.z = game.sleighZ;

  syncObstacles(game.obstacles);
  syncPickups(game.pickups);

  cameraTarget.set(game.sleighX, 1.4, game.sleighZ + 8);
  camera.setTarget(cameraTarget);

  updateHud(game.phase);
});

window.addEventListener('resize', () => engine.resize());

engine.runRenderLoop(() => scene.render());
