<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { IStickyNote } from '../../actions/project-board/stickynote/stickeyNoteTypes';

defineProps<{
    stickyNotes: IStickyNote[];
}>();

defineEmits<{
    (e: 'deleteStickyNote', stickyNote: IStickyNote): void;
}>();

const stickyNoteRefs = ref<HTMLElement[]>([]);

onMounted(() => {
    // Any initialization code for sticky notes can go here
});
</script>

<template>
    <template v-for="stickyNote in stickyNotes" :key="stickyNote.id">
        <div
            ref="stickyNoteRefs"
            :class="[
                'sticky-note',
                'sticky-note-' + stickyNote.id,
                'absolute flex flex-col min-h-30 w-[200px] shadow-md p-1 rounded-md cursor-pointer',
                stickyNote.color || 'bg-yellow-100'
            ]"
            :style="{
                top: `${stickyNote.dragPosition.y}px`,
                left: `${stickyNote.dragPosition.x}px`,
                width: `${stickyNote.resizePosition.x}px`,
                minHeight: `${stickyNote.resizePosition.y}px`,
                zIndex: 10
            }"
        >
            <div class="card-header flex justify-between items-center p-1 bg-white/20 rounded-t">
                <div class="flex-1 drag-handler sticky-note-handler">
                    <span class="text-xs text-gray-500">Drag me</span>
                </div>
                <button
                    @click.stop="$emit('deleteStickyNote', stickyNote)"
                    class="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                    title="Delete note"
                >
                    <TrashIcon class="w-4 h-4" />
                </button>
            </div>
            <div
                :class="[
                    'sticky-note-body',
                    'sticky-note-body-' + stickyNote.id,
                    'flex-1 p-2 bg-white/80 rounded-b outline-none',
                    'overflow-auto'
                ]"
                contenteditable="true"
                @input="() => {
                    // Handle content changes if needed
                }"
                v-html="stickyNote.body"
            ></div>
            <div class="sticky-note-resizer sticky-note-resizer-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize">
                <svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
            </div>
        </div>
    </template>
</template>

<style scoped>
.sticky-note {
    transition: box-shadow 0.2s ease-in-out;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.sticky-note:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.drag-handler {
    cursor: move;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.sticky-note-resizer-handle {
    opacity: 0;
    transition: opacity 0.2s;
}

.sticky-note:hover .sticky-note-resizer-handle {
    opacity: 1;
}
</style>
