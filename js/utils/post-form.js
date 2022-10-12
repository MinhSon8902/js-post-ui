import { randomNumber, setBackgroundImage, setFieldValue, setTextContent } from './common'
import * as yup from 'yup'

function setFormValues(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)
  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl)
  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

function getFormValue(form) {
  const formValues = {}
  const data = new FormData(form)
  for (const [key, value] of data) {
    formValues[key] = value
  }
  return formValues
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Please enter title'),
    author: yup
      .string()
      .required('Please enter author')
      .test(
        'at-least-two-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageUrl: yup
      .string()
      .required('Please random background image')
      .url('Please enter a valid URL'),
  })
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name="${name}"]`)
  if (element) element.setCustomValidity(error)
  setTextContent(element.parentElement, '.invalid-feedback', error)
}

async function validatePostForm(form, formValues) {
  try {
    ;['title', 'author', 'imageUrl'].forEach((name) => setFieldError(form, name, ''))

    const schema = getPostSchema()
    await schema.validate(formValues, { abortEarly: false })
  } catch (error) {
    console.log(error.name)
    console.log(error.inner)
    const errorLog = {}
    if (error.name === 'ValidationError' && Array.isArray(error.inner)) {
      for (const validationError of error.inner) {
        const name = validationError.path

        if (errorLog[name]) continue

        setFieldError(form, name, validationError.message)
        errorLog[name] = true
      }
    }
  }

  const isValid = form.checkValidity()
  if (!isValid) form.classList.add('was-validated')
  return isValid
}

function showLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = true
    button.textContent = 'Saving...'
  }
}

function hideLoading(form) {
  const button = form.querySelector('[name="submit"]')
  if (button) {
    button.disabled = false
    button.textContent = 'Save'
  }
}

function initRandomImage(form) {
  const randomButton = document.getElementById('postChangeImage')
  if (!randomButton) return

  randomButton.addEventListener('click', () => {
    const imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1368/400`

    setFieldValue(form, '[name="imageUrl"]', imageUrl)
    setBackgroundImage(document, '#postHeroImage', imageUrl)
  })
}

function imageSourceControl(form, selectedValue) {
  const controlList = form.querySelectorAll('[data-id="imageSource"]')
  controlList.forEach((control) => {
    control.hidden = control.dataset.imageSource !== selectedValue
  })
}

function initRadioImageSource(form) {
  const radioList = form.querySelectorAll('[name="imageSource"]')
  radioList.forEach((radio) => {
    radio.addEventListener('change', (event) => imageSourceControl(form, event.target.value))
  })
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  let submitting = false
  setFormValues(form, defaultValues)

  initRandomImage(form)
  initRadioImageSource(form, defaultValues)

  form.addEventListener('submit', async (event) => {
    event.preventDefault()

    if (submitting) return

    showLoading(form)
    submitting = true

    const formValues = getFormValue(form)
    formValues.id = defaultValues.id

    const isValid = await validatePostForm(form, formValues)
    if (isValid) await onSubmit?.(formValues)

    hideLoading(form)
    submitting = false
  })
}
