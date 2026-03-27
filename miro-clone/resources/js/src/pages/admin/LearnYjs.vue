<script lang="ts" setup>
import { onMounted, ref } from 'vue';

// TODO: Uncomment and fix the import when learnYjs.ts is available
// import { useYjs } from './learnYjs';

const val = ref(0);
// const { messages, updateData, triggerAction } = useYjs();
const messages = ref<string[]>([]);

// Mock functions until learnYjs is implemented
const updateData = () => {
    console.log('updateData called');
};

const triggerAction = (value: number) => {
    console.log('triggerAction called with:', value);
};

const userTyping = () => {
    if (window.Echo) {
        window.Echo.private(`chat.${2}`)
            .whisper('typing', {
                name: "ben",
                userId: 1
            });
    }
};

onMounted(() => {
    updateData();
    messages.value = [];
});
</script>

<template>
    <div>
        <!-- <h1>Realtime {{ message }} </h1> -->
        <input type="text" v-model="val" @keydown="userTyping" placeholder="message....">
        <button @click="triggerAction(val)">Click here bro</button>
        <br><br>


        users messages:{{ messages }}
        <div>
            <!-- <input type="text" placeholder="message...."> -->
        </div>
    </div>
</template>
