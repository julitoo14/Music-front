<template>
    <div ref="modal" v-if="show" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <slot name="header" />
            </div>
            <div class="modal-body">
                <slot name="content" />
            </div>
            <div class="modal-footer">
                <slot name="footer" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref} from 'vue';
const modal = ref(null);
const clickListener = (e) => {
    if (e.target === modal.value) {
        emit('close');
    }
};

const closeOnEscapeListener = (e) => {
    if (e.key === "Escape") {
        emit('close');
    }
};

const props = defineProps({
    show: {
        default: false
    },
});

const emit = defineEmits(['close']);


onMounted(() => {
    window.addEventListener("click", clickListener);
    window.addEventListener("keydown", closeOnEscapeListener);
    modal.value.focus();
});

onBeforeUnmount(() => {
    window.removeEventListener("click", clickListener);
    window.removeEventListener("keydown", closeOnEscapeListener);
});


</script>

<style scoped>
.modal {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
}


.modal-content {
    position: relative;
    background-color: #e26565;
    margin: auto;
    padding: 0;
    width: 30%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    -webkit-animation-name: animatetop;
    -webkit-animation-duration: 0.4s;
    animation-name: animatetop;
    animation-duration: 0.4s;
    border: 3px solid rgb(10, 10, 10);
}


@-webkit-keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }

    to {
        top: 0;
        opacity: 1
    }
}

@keyframes animatetop {
    from {
        top: -300px;
        opacity: 0
    }

    to {
        top: 0;
        opacity: 1
    }
}

.modal-header {
    padding: 2px 16px;
    background-color: rgb(83, 83, 93);
    color: white;
    text-align: center;
}

.modal-body {
    padding: 16px;
    background-color: var(--background-color);

}

.modal-footer {
    padding: 2px 16px;
    background-color: rgb(83, 83, 93);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
}

@media screen and (max-width: 900px) {
  .modal-content{
    width: 60%;
  }
}
</style>