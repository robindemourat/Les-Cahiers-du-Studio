<template>
  <div id="systemBar">
    <div class="fixedBand">
      <transition
        name="fade"
        :duration="850"
        >
        <div
          v-if="view === 'TimeLineView'"
          class="titleText font-small text-centered c-blanc"
          @mousedown="mousedown"
          @mousemove="mousemove"
          @mouseup="mouseup"
          >
          <i>Les Cahiers du Studio</i>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>


export default {
  props: ['view'],
  components: {
  },
  data() {
    return {
      is_dragged: false,
    }
  },

  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },

  watch: {
  },
  computed: {
  },
  methods: {
    mousedown(event) {
      console.log(`METHODS • SystemBar: mousedown`);
      this.is_dragged = false;
    },
    mousemove(event) {
      if(!this.is_dragged) {
        this.is_dragged = true;
      }
    },
    mouseup(event) {
      console.log(`METHODS • SystemBar: mouseup`);
      console.log(`with is_dragged = ${this.is_dragged}`);
      if(!this.is_dragged) {
        this.$root.closeFolder();
      }
      this.is_dragged = false;
    },
  }
}
</script>
<style>

</style>