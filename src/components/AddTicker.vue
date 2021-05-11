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
            v-for="(help, i) in helps"
            :key="i"
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
    <add-button @click="add" type='button' :disabled="disabled" class="my-4" />
  </section>
</template>

<script>
import AddButton from "./AddButton";
export default {
  props: {
    validationData: {
      require: true
    },
    disabled: {
      type: Boolean,
      require: false,
      default: false
    }
  },
  emits: {
    'add-ticker': value => typeof value === 'string' && value.length > 0
  },

  components: {
    AddButton,
  },
  data() {
    return {
      ticker: '',
      validTickerName: true,
      helps: [],
    }
  },
  methods: {
    add() {
      this.$emit('add-ticker', this.ticker)
      this.ticker = "";
    },

    addFromHelp(e) {
      this.ticker = e;
      this.add();
    },

    autocomplite(evt) {
      this.validTickerName = true;

      let helpTickerKeys = [];

      for (const [key, value] of Object.entries(this.validationData)) {
        if (
          key.toLowerCase().startsWith(evt.target.value.toLowerCase()) ||
          value.FullName.toLowerCase().startsWith(
            evt.target.value.toLowerCase()
          ) ||
          value.Symbol.toLowerCase().startsWith(evt.target.value.toLowerCase())
        ) {
          helpTickerKeys.push(key);
        }
      }

      this.helps = helpTickerKeys.slice(0, 4);
    },

    isValidName(name) {
      let valid = true;
      this.tickers.forEach((e) => {
        if (e.name === name) {
          this.validTickerName = false;
          valid = false;
        }
      });
      return valid;
    },
  }
};
</script>
