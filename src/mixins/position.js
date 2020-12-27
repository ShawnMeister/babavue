export default {
  watch: {
    value: {
      handler: "applyPosition",
      deep: true
    }
  },

  methods: {
    applyPosition() {
      if (!this.sceneElement) return;

      this.sceneElement.position.x = this.value.position.x / 4;
      this.sceneElement.position.y = this.value.position.y / 4;
      this.sceneElement.position.z = this.value.position.z / 4;
    }
  }
};
