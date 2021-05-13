<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Тикер</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            autocomplete="off"
            v-model="ticker"
            @keydown.enter="add"
            @input="autocomplite"
            type="text"
            name="wallet"
            id="wallet"
            class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
            placeholder="Например DOGE"
          />
        </div>
        <div
          v-if="ticker.length"
          class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
        >
          <span
            v-for="help in helps"
            :key="help"
            @click="addFromHelp(help)"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ help }}
          </span>
        </div>
        <div class="text-sm text-red-600" v-if="!validTickerName">
          Такой тикер уже добавлен
        </div>
      </div>
    </div>
    <add-button @click="add" type="button" :disabled="disabled" class="my-4" />
  </section>
</template>

<script>
import AddButton from "./AddButton";
export default {
  props: {
    helps: {
      require: true,
      default: false
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false,
    },
    validTickerName: {
      type: Boolean,
      require: true
    }
  },
  emits: {
    "add-ticker": (value) => typeof value === "string" && value.length > 0,
    "view-autocomlete": (value) => typeof value === "string" && value.length > 0
  },

  components: {
    AddButton,
  },
  data() {
    return {
      ticker: ""
    };
  },
  methods: {
    add() {
      if(this.disabled) {
        return
      }
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },

    addFromHelp(e) {
      this.ticker = e;
      this.add();
    },

    autocomplite(evt) {
      this.$emit("view-autocomlete", evt.target.value);
    },
  },
};
</script>
