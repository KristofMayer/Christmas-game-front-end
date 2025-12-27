<template>
    <div>
        <p>
            Please type your name and your most secret wish. Then you'll play a
            short decision-story (about 10 minutes) until your wish will be sent
            to Santa.
        </p>

        <form class="form" @submit.prevent="submitWish">
            <label>
                Your Name
                <input v-model.trim="name" maxlength="60" required />
            </label>

            <label>
                Your Wish
                <textarea
                    v-model.trim="wish"
                    maxlength="500"
                    rows="4"
                    required
                />
            </label>

            <button :disable="loading">
                {{ loading ? "Sending..." : "Start the game" }}
            </button>

            <p v-if="error" class="error">{{ error }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { apiFetch } from "../lib/api";

const router = useRouter();

const name = ref("");
const wish = ref("");
const loading = ref(false);
const error = ref("");

async function submitWish() {
    error.value = "";
    loading.value = true;

    try {
        const res = await apiFetch("/api/wishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: name.value, wish: wish.value }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to submit wish.");

        //info for session
        localStorage.setItem("playerName", name.value.trim());
        localStorage.setItem("playerWish", wish.value.trim());

        router.push("/game");
    } catch (e) {
        error.value = e.message || String(e);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.form {
    display: grid;
    gap: 12px;
    margin-top: 16px;
}
label {
    display: grid;
    gap: 6px;
}
input,
textarea {
    padding: 10px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.18);
    background: transparent;
    color: white;
}
button {
    padding: 10px 14px;
    border-radius: 10px;
    border: none;
}
.error {
    color: #ff9b9b;
}
</style>
