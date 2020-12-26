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
            KeyPressed
            <input
              type="text"
              @keydown.stop.prevent="keyEvent($event)"
              @keyup.stop.prevent="keyEvent($event)"
              @keypress.stop.prevent="keyEvent($event)"
            />
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
  Color3
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
          y: 5,
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
    keyEvent(event) {
      console.log("Key pressed:", event.key);
      this.events.unshift({
        type: event.type,
        details: _.pick(
          event,
          "charCode",
          "code",
          "detail",
          "key",
          "keyCode",
          "keyIdentifier",
          "keyLocation",
          "location",
          "repeat",
          "which"
        ),
        propagation: _.pick(
          event,
          "bubbles",
          "cancelBubble",
          "cancelable",
          "defaultPrevented",
          "eventPhase",
          "isTrusted",
          "returnValue",
          "timeStamp"
        ),
        modifiers: _.pick(event, "altKey", "ctrlKey", "metaKey", "shiftKey")
      });
    },
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
      camera.attachControl(this.$refs.canvas, true);
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
    height: 100%;
    width: 100%;
    display: flex;

    .buttons {
      ul {
        list-style-type: none;
        padding: 0px;
        margin: 0.5rem;
        li {
          padding: 0.5rem;
          text-decoration: none;
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
