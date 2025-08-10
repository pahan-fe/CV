<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="inner">
      <small>© {{ year }} Pavel Zagvozdin</small>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--bg-soft); border-top: 1px solid var(--accent); }
.inner { max-width: 1024px; margin: 0 auto; padding: 12px 16px; color: var(--fg); text-align: center; }
</style>
