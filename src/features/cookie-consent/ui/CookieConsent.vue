<script setup lang="ts">
import { useConsent } from '../model/useConsent'

const { shouldShow, accept, decline } = useConsent()
const visible = ref(false)

onMounted(() => {
  if (shouldShow.value) {
    requestAnimationFrame(() => {
      visible.value = true
    })
  }
})

const handleAccept = () => {
  visible.value = false
  setTimeout(() => accept(), 350)
}

const handleDecline = () => {
  visible.value = false
  setTimeout(() => decline(), 350)
}
</script>

<template>
  <Transition name="consent">
    <div v-if="shouldShow && visible" class="consent-bar">
      <p class="consent-text">This site uses cookies for anonymous analytics.</p>
      <div class="consent-actions">
        <button class="consent-btn consent-btn--decline" @click="handleDecline">
          Opt out
        </button>
        <button class="consent-btn consent-btn--accept" @click="handleAccept">
          OK
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.consent-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 12px 24px;
  background: color-mix(in srgb, var(--card) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

.consent-text {
  color: var(--fg-secondary);
}

.consent-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.consent-btn {
  padding: 6px 16px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.consent-btn--decline {
  color: var(--muted);
  border: 1px solid var(--border);
}

.consent-btn--decline:hover {
  color: var(--fg-secondary);
  border-color: var(--muted);
}

.consent-btn--accept {
  background: var(--accent);
  color: var(--bg);
  border: 1px solid var(--accent);
}

.consent-btn--accept:hover {
  opacity: 0.85;
}

.consent-enter-active,
.consent-leave-active {
  transition: transform 0.35s ease-out, opacity 0.35s ease-out;
}

.consent-enter-from,
.consent-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: 500px) {
  .consent-bar {
    flex-direction: column;
    gap: 10px;
    padding: 14px 16px;
    text-align: center;
  }

  .consent-actions {
    width: 100%;
  }

  .consent-btn {
    flex: 1;
  }
}
</style>
