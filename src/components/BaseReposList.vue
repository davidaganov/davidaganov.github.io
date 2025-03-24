<script setup lang="ts">
import { ref, watch } from "vue"
import BaseCardRepo from "@/components/BaseCardRepo.vue"

interface ReposProps {
  id: number
  name: string
  description: string
  html_url: string
  topics: string[]
  homepage: string
}

interface Props {
  repos?: ReposProps[]
}

const props = defineProps<Props>()

const selectTag = ref("")
const sortRepos = ref<ReposProps[]>([])

const getUniqueTags = () => {
  if (!props.repos) return []

  return [
    ...new Set(props.repos.reduce((topics: string[], repo) => [...topics, ...repo.topics], []))
  ]
}

const handleTagClick = (tag: string) => {
  selectTag.value = tag === selectTag.value ? "" : tag
}

watch(selectTag, (newTag) => {
  if (props.repos) {
    sortRepos.value = props.repos.filter((item) => item.topics.some((i) => [newTag].includes(i)))
  }
})
</script>

<template>
  <div class="container">
    <div
      v-if="getUniqueTags().length"
      class="tags"
      role="listbox"
    >
      <button
        v-for="tag in getUniqueTags()"
        type="button"
        lang="en"
        role="option"
        :id="`tag-${tag}`"
        :class="['tag', { tagActive: tag === selectTag }]"
        :aria-selected="tag === selectTag"
        :aria-labelledby="`sortLabel tag-${tag}`"
        :key="tag"
        @click="handleTagClick(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <ul
      v-if="repos?.length"
      class="repos"
    >
      <BaseCardRepo
        :card="item"
        :key="item.id"
        v-for="item in (sortRepos.length === 0 ? repos : sortRepos).slice(0, 6)"
      />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
}

.repos {
  display: grid;
  gap: 30px;
  width: 100%;
  margin-top: 20px;

  @media (min-width: 769px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
  width: 100%;
  margin-bottom: 25px;
}

.tag {
  display: block;
  padding: 7px 10px;
  text-transform: capitalize;
  border-style: solid;
  border-width: 2px;
  color: var(--color-white-500);
  font: normal 10px var(--second-font);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: var(--color-white);
    color: var(--color-white);
  }

  &:focus-visible {
    color: var(--color-accent);
  }

  &.tagActive {
    border-color: var(--color-accent);
    color: var(--color-accent);

    @media (min-width: 576px) {
      &:hover {
        border-color: tomato;
        color: tomato;
      }

      &:focus-visible {
        color: tomato;
        border-color: tomato;
      }
    }
  }
}

.empty {
  margin-top: 30px;
  text-align: center;
  font: normal 20px var(--second-font);
  color: var(--color-white-700);
}

.emptySubtitle {
  margin-top: 20px;
  text-align: center;
  font: normal 20px var(--main-font);
  color: var(--color-white-700);
}
</style>
