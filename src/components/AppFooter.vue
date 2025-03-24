<script setup lang="ts">
import BaseSocial from "@/components/BaseSocial.vue"
</script>

<template>
  <footer
    class="footer"
    id="footer"
    role="contentinfo"
  >
    <div class="container">
      <a
        href="https://github.com/davidaganov/davidaganov.github.io"
        class="author inline-link inline-link--white"
        target="_blank"
        rel="noreferrer"
      >
        {{ $t("contacts.description") }}&nbsp;
        <br />
        {{ $t("contacts.author") }}
      </a>

      <BaseSocial class="social" />

      <a
        class="inline-link inline-link--white"
        href="mailto:davidaganov21@gmail.com"
      >
        davidaganov21@gmail.com
      </a>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  margin-top: auto;
  padding-bottom: 30px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.author {
  text-align: center;
  color: var(--color-white-700) !important;

  &:hover {
    color: var(--color-white) !important;
  }

  @media (min-width: 1000px) {
    margin-bottom: 5px;
  }

  @media (min-width: 375px) {
    br {
      display: none;
    }
  }
}

.social {
  @media (max-width: 999px) {
    margin: 10px 0;
  }
}
</style>
