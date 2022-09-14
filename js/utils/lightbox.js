export function registerLightbox() {
  document.addEventListener('click', (event) => {
    const { target } = event
    if (target.tagName !== 'IMG' || !target.dataset.album) return

    let imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`)
    const index = [...imgList].findIndex((x) => x === target)
    console.log('album image click', { target, index, imgList })
  })
}
