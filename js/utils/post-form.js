import { setBackgroundImage, setFieldValue } from './common'

function setFormValues(form, formValue) {
  setFieldValue(form, '[name="title"]', formValue?.title)
  setFieldValue(form, '[name="author"]', formValue?.author)
  setFieldValue(form, '[name="description"]', formValue?.description)

  setFieldValue(form, '[name="imageUrl"]', formValue?.imageUrl)

  setBackgroundImage(document, '#postHeroImage', formValue?.imageUrl)
}

export function initPostForm({ formId, defaultValues, onSubmit }) {
  const form = document.getElementById(formId)
  if (!form) return

  console.log('form', form)

  setFormValues(form, defaultValues)
}
