<script setup lang="ts"></script>

<template>
  <div class="blob first" />
  <div class="blob second" />
  <div class="blob third" />
</template>

<style scoped lang="scss">
.blob {
  position: absolute;
  background-color: var(--color-accent);
  border-radius: 30% 50% 20% 40%;
  opacity: 0.15;
  z-index: -1;
}

.first {
  height: 200px;
  width: 200px;
  left: 70%;
  top: 80%;
  animation:
    transform 20s ease-in-out infinite both alternate,
    movement_one 40s ease-in-out infinite both;
}

.second {
  top: -50px;
  transform: rotate(-180deg);
  animation:
    transform 30s ease-in-out infinite both alternate,
    movement_two 60s ease-in-out infinite both;

  @media (min-width: 1000px) {
    height: 500px;
    width: 500px;
    left: -150px;
  }

  @media (max-width: 999px) and (min-width: 576px) {
    width: 400px;
    height: 400px;
    left: -50px;
  }

  @media (max-width: 575px) {
    width: 350px;
    height: 350px;
    left: -100px;
  }
}

.third {
  @media (min-width: 769px) {
    height: 450px;
    width: 450px;
    left: 500px;
    top: -60px;
    transform: rotate(-180deg);
    animation:
      transform 30s ease-in-out infinite both alternate,
      movement_two 60s ease-in-out infinite both;
  }

  @media (max-width: 768px) {
    display: none;
  }
}

@keyframes transform {
  0%,
  100% {
    border-radius: 33% 67% 70% 30% / 30% 30% 70% 70%;
  }
  20% {
    border-radius: 37% 63% 51% 49% / 37% 65% 35% 63%;
  }
  40% {
    border-radius: 36% 64% 64% 36% / 64% 48% 52% 36%;
  }
  60% {
    border-radius: 37% 63% 51% 49% / 30% 30% 70% 70%;
  }
  80% {
    border-radius: 40% 60% 42% 58% / 41% 51% 49% 59%;
  }
}

@keyframes movement_one {
  0%,
  100% {
    transform: none;
  }
  50% {
    transform: translate(-50%, 20%) rotateY(10deg) scale(1.2);
  }
}

@keyframes movement_two {
  0%,
  500% {
    transform: none;
  }
  50% {
    transform: translate(30%, 10%) rotate(-200deg) scale(1.2);
  }
}
</style>
