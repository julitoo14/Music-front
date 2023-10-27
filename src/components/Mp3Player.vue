
    <template>
        <div class="bottom-navbar">
          <audio autoplay controls @ended="$emit('ended')" :src="props.files"></audio>
        </div>
      </template>
      
      <script setup>
      const props = defineProps({
        files: {
          required: true,
          type: String,
        },  
      });

      const emit = defineEmits(["ended"]);
      </script>
      
      <style scoped>
      .bottom-navbar {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 10%;
        background-color: rgb(12, 12, 12);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
      }
      </style>
