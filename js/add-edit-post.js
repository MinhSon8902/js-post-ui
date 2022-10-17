import postApi from './api/postApi'
import { initPostForm, toast } from './utils'

async function handlePostFormSubmit(formValues) {
  console.log('submit from parent: ', formValues)
  return
  try {
    const savedPost = formValues.id
      ? await postApi.update(formValues)
      : await postApi.add(formValues)

    toast.success('Save post successfully!')
    setTimeout(() => {
      window.location.assign(`/post-detail.html?id=${savedPost.id}`)
    }, 2000)
  } catch (error) {
    console.log('failed to save post', error)
    toast.error(`Error: ${error.message}`)
  }
}

;(async () => {
  try {
    const searchParams = new URLSearchParams(window.location.search)
    const postId = searchParams.get('id')

    let defaultValues = Boolean(postId)
      ? await postApi.getById(postId)
      : {
          title: '',
          description: '',
          author: '',
          image: '',
        }

    initPostForm({
      formId: 'postForm',
      defaultValues,
      onSubmit: handlePostFormSubmit,
    })
  } catch (error) {
    console.log('failed to fetch post details: ', error)
  }
})()
