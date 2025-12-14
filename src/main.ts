import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

import { GameState } from '@core/state/GameState';
import { PointerSteerInput } from '@web/input/PointerSteerInput';
import { clamp } from '@core/util/math';

const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
const giftCounterEl = document.getElementById('giftCounter') as HTMLDivElement;
const hintEl = document.getElementById('hint') as HTMLDivElement;

const engine = new Engine(canvas, true, {
  preserveDrawingBuffer: false,
  stencil: false,
  antialias: true
});

function createScene(): Scene {
  const scene = new Scene(engine);

  const camera = new ArcRotateCamera('cam', Math.PI / 2, Math.PI / 3, 22, new Vector3(0, 1.5, 0), scene);
  camera.attachControl(canvas, true);
  camera.lowerRadiusLimit = 14;
  camera.upperRadiusLimit = 26;
  camera.wheelPrecision = 60;

  new HemisphericLight('light', new Vector3(0.2, 1, 0.1), scene);

  // Placeholder ground
  const ground = MeshBuilder.CreateGround('ground', { width: 30, height: 200 }, scene);
  ground.position.z = 70;

  // Placeholder "sleigh" (box)
  const sleigh = MeshBuilder.CreateBox('sleigh', { size: 1.2 }, scene);
  sleigh.position.y = 0.8;

  // Very simple state loop (Milestone 0)
  const state = new GameState();
  const input = new PointerSteerInput(canvas);

  let z = 0;

  scene.onBeforeRenderObservable.add(() => {
    const dt = scene.getEngine().getDeltaTime() / 1000;

    state.tick(dt);

    // Drive forward (placeholder)
    z += state.speed * dt;
    sleigh.position.z = z;

    // Steer
    const steer = input.steer; // -1..1
    sleigh.position.x = clamp(sleigh.position.x + steer * state.steerSpeed * dt, -10, 10);

    // HUD
    giftCounterEl.textContent = `🎁 ${state.gifts}`;
    hintEl.style.opacity = z < 10 ? '1' : '0';
  });

  // Resize
  window.addEventListener('resize', () => engine.resize());

  return scene;
}

const scene = createScene();
engine.runRenderLoop(() => scene.render());
