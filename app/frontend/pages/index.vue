<template>
  <v-layout
          column
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <h1 class="text-center display-1 my-4">
        {{ $t('tenders_list') }}
      </h1>

      <v-row dense>
        <tenders-grid/>
      </v-row>

    </v-flex>
  </v-layout>
</template>

<script>
import TendersGrid from '~/components/TendersGrid/TendersGrid.vue'

export default {
  components: {
      TendersGrid
  }
}
</script>
