import { setBackgroundImage, setFieldValue, setTextContent } from './common'

function setFormValues(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl)

  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValue(form) {
  const formValues = {}
  // ;['title', 'author', 'description', 'imageUrl'].forEach((name) => {
  //   const field = form.querySelector(`[name="${name}"]`)
  //   if (field) formValues[name] = field.value
  // })

  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

function getTitleError(form) {
  const titleElement = form.querySelector('[name="title"]')
  if (!titleElement) return

  if (titleElement.validity.valueMissing) return 'please enter title'

  return ''
}

function validatePostForm(form, formValues) {
  const errors = {
    title: getTitleError(form),
    // author: getAuthorError(form),
  }

  for (const key in errors) {
    const element = form.querySelector(`[name="${key}"]`)
    if (element) element.setCustomValidity(errors[key])
    setTextContent(form.parentElement, '.invalid-feedback', errors[key])
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid

  return false
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  console.log('form', form)

  setFormValues(form, defaultValues)

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    const formValues = getFormValue(form)
    console.log(formValues)
    if (!validatePostForm(form, formValues)) return
  })
}
