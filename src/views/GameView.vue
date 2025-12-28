<template>
    <div v-if="ready">
        <p class="meta">
            Player: <strong>{{ playerName }}</strong>
            <span class="spacer">•</span>
            Kindness: {{ vars.kindness }} | Bravery: {{ vars.bravery }} |
            Patience: {{ vars.patience }}
        </p>

        <article class="scene">
            <p class="text">{{ scene.text }}</p>

            <div class="choices">
                <button
                    v-for="choice in scene.choices"
                    :key="choice.text"
                    @click="pick(choice)"
                >
                    {{ choice.text }}
                </button>
            </div>
        </article>
    </div>

    <p v-else>Loading story...</p>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import game from "../game/game.json";

const router = useRouter();
//const playerName = localStorage.getItem("playerName") || "player";
const playerName = computed(() => localStorage.getItem("playerName") || "");
const playerWish = computed(() => localStorage.getItem("playerWish") || "");

function renderText(raw) {
    return String(raw ?? "")
        .replaceAll("{{playerName}}", playerName.value || "player")
        .replaceAll("{{playerWish}}", playerWish.value || "your wish");
}

const vars = reactive({
    kindness: game.variables.kindness,
    bravery: game.variables.bravery,
    patience: game.variables.patience,
});

const currentSceneId = ref(game.startSceneId);
const ready = ref(true);

const scene = computed(() => {
    const s = game.scenes.find((x) => x.id === currentSceneId.value);
    if (!s) throw new Error(`Scene not found: ${currentSceneId.value}`);
    return s;
});

function applyEffects(effects) {
    vars.kindness += effects.kindness ?? 0;
    vars.bravery += effects.bravery ?? 0;
    vars.patience += effects.patience ?? 0;
}

function checkEnding() {
    // very sall condition evaluatior supporting
    // kindness >= 4, bravery >= 4, patience >=4 etc
    for (const ending of game.endings) {
        const ok = evaluateCondition(ending.condition);
        if (ok) {
            sessionStorage.setItem("ending_text", ending.text);
            router.push("/end");
            return true;
        }
    }
    return false;
}

function evaluateCondition(cond) {
    const m = String(cond)
        .trim()
        .match(/^(kindness|bravery|patience)\s*(>=|<=|==|>|<)\s*(-?\d+)\s*$/);

    if (!m) return false;

    const [, key, op, numStr] = m;
    const left = vars[key];
    const right = Number(numStr);

    switch (op) {
        case ">=":
            return left >= right;
        case "<=":
            return left <= right;
        case "==":
            return left == right;
        case ">":
            return left > right;
        case "<":
            return left < right;
        default:
            return false;
    }
}

function pick(choice) {
    applyEffects(choice.effects || {});
    if (checkEnding()) return;

    currentSceneId.value = choice.nextSceneId;
    checkEnding();
}
</script>

<style>
.meta {
    opacity: 0.9;
    margin-bottom: 12px;
}
.spacer {
    margin: 0 8px;
    opacity: 0.6;
}
.scene {
    display: grid;
    gap: 14px;
}
.text {
    font-size: 1.05rem;
    line-height: 1.55;
}
.choices {
    display: grid;
    gap: 10px;
}

button {
    text-align: left;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
}

button:hover {
    border-color: rgba(255, 255, 255, 0.35);
}
</style>
