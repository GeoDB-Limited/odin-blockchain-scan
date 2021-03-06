<template>
  <ModalBase class="exchange-form-modal" @close="onClose()">
    <template #title>
      <h3>Faucet</h3>
    </template>

    <template #main>
      <form
        class="app-form load-fog"
        :class="{ 'load-fog_show': isLoading }"
        @submit.prevent
      >
        <div class="app-form__field">
          <label class="app-form__field-lbl"> Asset </label>
          <select
            class="app-form__field-input"
            name="exchange-source-asset"
            v-model="form.asset"
            :disabled="isLoading"
          >
            <option v-for="asset in assets" :key="asset" :value="asset">
              {{ asset }}
            </option>
          </select>
          <p v-if="form.assetErr" class="app-form__field-err">
            {{ form.askCountErr }}
          </p>
        </div>

        <div class="app-form__footer">
          <button
            class="app-btn"
            type="button"
            @click="submit()"
            :disabled="!form.isValid || isLoading"
          >
            Request
          </button>
        </div>
      </form>
    </template>
  </ModalBase>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { callers } from '@/api/callers'
import { DialogHandler, dialogs } from '@/helpers/dialogs'
import { handleError, isErrorLike } from '@/helpers/errors'
import { preventIf } from '@/helpers/functions'
import { notifySuccess } from '@/helpers/notifications'
import { useForm, validators } from '@/composables/useForm'
import ModalBase from './ModalBase.vue'

const FaucetFormModal = defineComponent({
  components: { ModalBase },
  setup() {
    const assets = ['LOKI']
    const form = useForm({
      asset: [assets[0], validators.required, validators.oneOf(assets)],
    })
    const isLoading = ref(false)
    const onSubmit = dialogs.getHandler('onSubmit')
    const onClose = preventIf(dialogs.getHandler('onClose'), isLoading)

    const submit = async () => {
      isLoading.value = true
      try {
        const r = await callers.faucetRequest({
          denom: form.asset.val().toLowerCase(),
        })

        console.log(r)

        onSubmit()
        notifySuccess('Faucet request created')
      } catch (error) {
        if (!isErrorLike(error)) {
          console.warn('FaucetFormModal: Cannot decode error!')
          return
        }

        const indTime = error.message.indexOf('time')
        const errorStr = error.message.slice(10, indTime - 3)
        const timeStr = error.message.slice(indTime + 6, -1)

        const hours = Math.floor(+timeStr / 60 / 60)
        let minutes = Math.floor(
          Math.abs(+hours * 60 - +timeStr / 60)
        ).toString()
        let seconds = Math.floor(
          Math.abs(+hours * 60 * 60 + +minutes * 60 - +timeStr)
        ).toString()
        minutes = +minutes > 9 ? minutes : '0' + minutes
        seconds = +seconds > 9 ? seconds : '0' + seconds

        const newError = new Error(
          `You ${errorStr} in ${hours}:${minutes}:${seconds}`
        )

        handleError(newError)
      }
      isLoading.value = false
    }

    return {
      form: form.flatten(),
      isLoading,
      submit,
      assets,
      onClose,
    }
  },
})

export default FaucetFormModal
export function showFaucetFormDialog(callbacks?: {
  onSubmit?: DialogHandler
  onClose?: DialogHandler
}): Promise<unknown | null> {
  return dialogs.show(FaucetFormModal, callbacks)
}
</script>

<style scoped lang="scss"></style>
