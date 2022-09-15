function showModal(modalElement) {
  if (!window.bootstrap) return
  const modal = new window.bootstrap.Modal(modalElement)
  if (modal) modal.show()
}

export function registerLightbox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId)
  if (!modalElement) return

  if (Boolean(modalElement.dataset.registered)) return

  const imageElement = modalElement.querySelector(imgSelector)
  const preButton = modalElement.querySelector(prevSelector)
  const nextButton = modalElement.querySelector(nextSelector)
  if (!imageElement || !preButton || !nextButton) return

  let imgList = []
  let currentIndex = 0

  function showImageAtIndex(index) {
    imageElement.src = imgList[index].src
  }

  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    currentIndex = [...imgList].findIndex((x) => x === target)
    console.log('album image click', { target, currentIndex, imgList })
    showImageAtIndex(currentIndex)
    showModal(modalElement)
  })

  preButton.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length
    showImageAtIndex(currentIndex)
  })
  nextButton.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length
    showImageAtIndex(currentIndex)
  })

  modalElement.dataset.registered = 'true'
}
