<template>
  <div>
    <template v-if="formItem">
      <a-form :layout="layout">
        <a-form-item
          :colon="false"
          :label="label"
          :name="name"
          :required="required"
          :style="$attrs.style"
        >
          <div class="tag-input">
            <div v-for="(tag, index) in tagsValue" :key="tag" class="tag-input__tag">
              <span class="tag-input__tag-content">{{ tag }}</span>
              <close-outlined class="tag-input__tag-remove" @click="removeTag(index)" />
            </div>
            <input
              ref="inputTags"
              v-model="text"
              class="tag-input__text"
              :maxlength="maxLength"
              :placeholder="tagsValue.length > 0 ? '' : placeholder"
              :disabled="disabled"
              @focusout="addTag($event.target.value)"
              @keydown="handleKeyEvent"
            />
          </div>
        </a-form-item>
      </a-form>
    </template>

    <template v-else>
      <label v-if="label">{{ label }}</label>
      <div class="tag-input">
        <div v-for="(tag, index) in tagsValue" :key="tag" class="tag-input__tag">
          <span class="tag-input__tag-content">{{ tag }}</span>
          <close-outlined class="tag-input__tag-remove" @click="removeTag(index)" />
        </div>
        <input
          ref="inputTags"
          v-model="text"
          class="tag-input__text"
          :placeholder="placeholder"
          :disabled="disabled"
          @focusout="addTag($event.target.value)"
          @keydown="handleKeyEvent"
        />
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { CloseOutlined } from "@ant-design/icons-vue"
import { defineComponent, onUnmounted, ref, watch } from "vue"
import './tag-input.less';

export default defineComponent({
  name: "TagInput",

  components: {
    CloseOutlined,
  },

  props: {
    placeholder: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
      default: () => [],
    },
    isNotDuplicate: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    layout: {
      type: String,
      default: "vertical",
    },
    formItem: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    maxLength: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["change", "update:tags"],

  setup(props, { emit }) {
    const text = ref("")
    const tagsValue = ref(props.tags)

    watch(
      () => props.tags,
      (newVal) => {
        tagsValue.value = newVal
      }
    )

    const inputTags = ref<HTMLElement>()

    const createChangeEvent = () => {
      const e = new Event("change", { bubbles: true, cancelable: true })
      inputTags.value?.dispatchEvent(e)
    }

    const addTag = (val) => {
      const isExist = tagsValue.value.some((e) => e == val.trim())

      if (val.length > 0) {
        if (!props.isNotDuplicate || (props.isNotDuplicate && !isExist)) {
          tagsValue.value.push(val)
        }
      }

      emit("update:tags", tagsValue.value)
      emit("change", tagsValue.value)

      createChangeEvent()

      text.value = ""
    }

    const removeTag = (index) => {
      tagsValue.value.splice(index, 1)

      emit("update:tags", tagsValue.value)
      emit("change", tagsValue.value)

      createChangeEvent()
    }

    const handleKeyEvent = (event) => {
      const { keyCode } = event

      if ([13, 9].includes(keyCode)) {
        addTag(text.value)
      }

      if (keyCode === 8 && !text.value) {
        removeTag(tagsValue.value.length - 1)
      }
    }

    onUnmounted(() => {
      tagsValue.value.length = 0
    })

    return {
      text,
      tagsValue,
      addTag,
      removeTag,
      inputTags,
      handleKeyEvent,
    }
  },
})
</script>
