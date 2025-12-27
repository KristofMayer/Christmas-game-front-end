<template>
    <div>
        <h2>Merry Christmas!</h2>

        <p class="ending">{{ renderText(endingText) }}</p>

        <button @click="restart">Play again</button>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const playerName = computed(() => localStorage.getItem("playerName") || "");
const playerWish = computed(() => localStorage.getItem("playerWish") || "");

function renderText(raw) {
    return String(raw ?? "")
        .replaceAll("{{playerName}}", playerName.value || "player")
        .replaceAll("{{playerWish}}", playerWish.value || "your wish");
}

const router = useRouter();
const endingText =
    sessionStorage.getItem("ending_text") ||
    "Merry christmas! Your wish was sent to Santa.";

function restart() {
    sessionStorage.removeItem("ending_text");
    router.push("/");
}
</script>

<style scoped>
.ending {
    margin: 14px;
    line-height: 1.55;
}
button {
    padding: 10px 14px;
    border-radius: 10px;
    border: none;
}
</style>
