<template>
  <div class="Scene">
    <div class="front">
      <div class="buttons">
        <ul>
          <li>
            <div class="visible">
              visible:
              <input type="checkbox" v-model="sphere.visible" />
            </div>
          </li>
          <li>
            x:
            <input type="number" v-model="sphere.position.x" />
          </li>
          <li>
            y:
            <input type="number" v-model="sphere.position.y" />
          </li>
          <li>
            KeyPressed:
            {{ currentKey }}
          </li>
          <li>
            z:
            <input type="number" v-model="sphere.position.z" />
          </li>
        </ul>
      </div>
      <Sphere v-if="sphere.visible" :value="sphere" />
    </div>
    <div class="back">
      <canvas
        id="renderCanvas"
        ref="canvas"
        class="Scene-canvas"
        touch-action="none"
        oncontextmenu="return false"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector2,
  Vector3,
  HemisphericLight,
  PointLight,
  MeshBuilder,
  Mesh,
  PBRMaterial,
  FreeCamera,
  Color3,
  KeyboardEventTypes,
  PointerEventTypes
} from "@babylonjs/core";

import "@babylonjs/core/Meshes/meshBuilder";
import _ from "underscore";
import Sphere from "@/components/Sphere";

export default {
  name: "Scene",
  components: {
    Sphere
  },
  provide() {
    return {
      babylon: this.babylon
    };
  },

  data() {
    return {
      currentKey: null,
      events: [],
      babylon: {
        scene: undefined,
        sceneReady: false,
        canvas: undefined
      },

      sphere: {
        visible: true,
        position: {
          x: 0,
          y: 2,
          z: 0
        }
      }
    };
  },

  mounted() {
    this.createScene();
    this.babylon.sceneReady = true;
    this.babylon.canvas = this.$refs.canvas;
  },

  beforeUnmount() {
    this.babylon.scene.dispose();
    this.engine.dispose();
  },

  methods: {
    createScene() {
      // Create render loop, a camera and some basic lights:
      this.engine = new Engine(
        this.$refs.canvas,
        true,
        { preserveDrawingBuffer: true },
        false
      );

      this.babylon.scene = new Scene(this.engine);

      var camera = new FreeCamera(
        "Camera",
        new Vector3(0, 15, -30),
        this.babylon.scene
      );
      // camera.attachControl(this.$refs.canvas, true);
      camera.cameraRotation = new Vector2(0.05, 0.0);

      new HemisphericLight("light1", new Vector3(1, 1, 0), this.babylon.scene);
      new PointLight("light2", new Vector3(0, 1, -1), this.babylon.scene);

      this.sceneElement = new Mesh.CreateGround(
        "ground",
        20,
        20,
        20,
        this.babylon.scene
      );

      this.babylon.scene.onPointerObservable.add(pointerInfo => {
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN:
            console.log("POINTER DOWN");

            break;
          case PointerEventTypes.POINTERUP:
            console.log("POINTER UP");
            break;
          case PointerEventTypes.POINTERMOVE:
            console.log("POINTER MOVE");
            break;
          case PointerEventTypes.POINTERWHEEL:
            console.log("POINTER WHEEL");
            break;
          case PointerEventTypes.POINTERPICK:
            console.log("POINTER PICK");
            break;
          case PointerEventTypes.POINTERTAP:
            console.log("POINTER TAP");
            break;
          case PointerEventTypes.POINTERDOUBLETAP:
            console.log("POINTER DOUBLE-TAP");
            break;
        }
      });

      this.babylon.scene.onKeyboardObservable.add(kbInfo => {
        switch (kbInfo.type) {
          case KeyboardEventTypes.KEYDOWN:
            // console.log("KEY DOWN: ", kbInfo.event.key);
            this.currentKey = kbInfo.event.key;
            switch (kbInfo.event.key) {
              case "ArrowUp":
                // alert("ye dawg");
                this.sphere.position.z++;
                break;
              case "ArrowDown":
                this.sphere.position.z--;
                break;
              case "ArrowLeft":
                this.sphere.position.x--;
                break;
              case "ArrowRight":
                this.sphere.position.x++;
                break;
            }
            break;
          case KeyboardEventTypes.KEYUP:
            console.log("KEY UP: ", kbInfo.event.keyCode);
            break;
        }
      });

      this.engine.runRenderLoop(() => {
        this.babylon.scene.render();
      });
    },

    layout() {
      if (this.engine) this.engine.resize();
    }
  }
};
</script>

<style lang="scss">
.Scene {
  .front {
    position: absolute;
    z-index: 1;
    color: white;
    height: fit-content;
    width: fit-content;
    bottom: 0px;
    right: 0px;
    display: flex;

    .buttons {
      ul {
        list-style-type: none;
        padding: 0px;
        margin: 1rem 0.5rem;
        li {
          padding: 0.5rem;
          text-decoration: none;
          text-align: left;
          width: 250px;
        }
      }

      margin-top: auto;
      margin-left: auto;
    }
  }
  .back {
    z-index: -99;
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
.Scene-canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
  outline: none;
  display: block;
}
</style>
