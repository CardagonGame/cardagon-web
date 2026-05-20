const dialog = reactive({
  open: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  color: 'primary',
})

let resolve: (v: boolean) => void

export function useConfirm() {
  function confirm(opts: Partial<typeof dialog> = {}) {
    Object.assign(
      dialog,
      {
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        color: 'primary',
      },
      opts,
    )
    dialog.open = true
    return new Promise<boolean>((r) => (resolve = r))
  }

  function answer(confirmed: boolean) {
    dialog.open = false
    resolve(confirmed)
  }

  return { dialog, confirm, answer }
}
