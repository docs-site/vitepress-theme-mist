<script setup lang="ts" name="LinkCard">
import { useNamespace } from "@mist/composables";

defineOptions({ name: "LinkCard" });

const ns = useNamespace("link-card");

interface LinkCardProps {
  url: string;
  title: string;
  description: string;
  logo: string;
}

const props = defineProps<LinkCardProps>();
</script>

<template>
  <div :class="ns.b()">
    <a :href="props.url" target="_blank" :class="ns.e('link')">
      <div :class="ns.e('content')">
        <p :class="ns.e('title')">{{ props.title }}</p>
        <p :class="ns.e('description')">{{ props.description }}</p>
      </div>
      <div :class="ns.e('logo')">
        <img :src="props.logo" :alt="props.title" />
      </div>
    </a>
  </div>
</template>
