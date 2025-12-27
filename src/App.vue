<template>
    <main class="container">
        <div class="card">
            <header class="header">
                <h1>🎄 Christmas Wish Game</h1>
            </header>
            <section class="content">
                <router-view />
            </section>
        </div>
    </main>
</template>
<style>
.app {
    max-width: 760px;
    margin: 0 auto;
    padding: 24px;
    font-family:
        system-ui,
        -apple-system,
        Segoe UI,
        Roboto,
        Arial,
        sans-serif;
}

.header {
    margin-bottom: 20px;
}
.content {
    border: 1px solid rgba(255, 255, 255, 0.12);
    padding: 20px;
    border-radius: 12px;
}

input,
textarea,
button {
    font: inherit;
}
button {
    cursor: pointer;
}
</style>
