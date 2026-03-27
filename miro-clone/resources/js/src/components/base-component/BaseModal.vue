
<script lang="ts" setup>
defineProps<{
    show: boolean;
}>();

const emit = defineEmits<{
    (e: "closeModal"): void;
}>();

function closeModal() {
    emit('closeModal');
}
</script>
<template>
    <div
        v-show="show"
        className="fixed z-[1000] inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out"
        @click.self="closeModal"
    >
        <div
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:w-2/3 md:w-1/2 lg:w-1/3 transform transition-transform duration-300 ease-out scale-95 opacity-0 animate-modalFadeIn"
        >
            <div className="flex justify-between items-center">
                <slot name="title"></slot>
                <button 
                    @click="closeModal"
                    class="text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label="Close modal"
                >
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- modal body -->
            <div class="py-4 ">
                <slot name="body"></slot>

            </div>
            <!-- end modal body  -->

            <div className="flex gap-2 justify-end mt-4">

                <slot name="footer"></slot>


            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
.animate-modalFadeIn {
    animation: modalFadeIn 0.3s ease-out forwards;
}
</style>


