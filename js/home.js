import axiosClient from './api/axiosClient'
import postApi from './api/postApi'
import { setTextContent, truncateText, getUlPaginationElement } from './utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import debounce from 'lodash.debounce'
dayjs.extend(relativeTime)

function createPostElement(post) {
  if (!post) return
  const postTemplate = document.getElementById('postTemplate')
  if (!postTemplate) return

  const liElement = postTemplate.content.firstElementChild.cloneNode(true)
  if (!liElement) return

  // const titleElement = liElement.querySelector('[data-id="title"]')
  // if (titleElement) titleElement.textContent = post.title
  setTextContent(liElement, '[data-id="title"]', post.title)
  setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100))
  setTextContent(liElement, '[data-id="author"]', post.author)

  setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updateAt).fromNow()}`)

  // const descriptionElement = liElement.querySelector('[data-id="description"]')
  // if (descriptionElement) descriptionElement.textContent = post.description

  // const authorElement = liElement.querySelector('[data-id="author"]')
  // if (authorElement) authorElement.textContent = post.author

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]')
  if (thumbnailElement) {
    thumbnailElement.src = post.imageUrl
    thumbnailElement.addEventListener('error', () => {
      thumbnailElement.src =
        'https://images.unsplash.com/photo-1494548162494-384bba4ab999?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60'
    })
  }
  return liElement
}

function renderPostList(postList) {
  if (!Array.isArray(postList)) return
  const ulElement = document.getElementById('postsList')
  if (!ulElement) return

  ulElement.textContent = ''

  postList.forEach((post) => {
    const liElement = createPostElement(post)
    ulElement.appendChild(liElement)
  })
}

function renderPagination(pagination) {
  const ulPagination = getUlPaginationElement()
  if (!pagination || !ulPagination) return
  const { _page, _limit, _totalRows } = pagination
  const totalPages = Math.ceil(_totalRows / _limit)

  ulPagination.dataset.page = _page
  ulPagination.dataset.totalPages = totalPages

  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled')
  else ulPagination.firstElementChild?.classList.remove('disabled')

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled')
  else ulPagination.lastElementChild?.classList.remove('disabled')
}

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location)
    url.searchParams.set(filterName, filterValue)
    if (filterName === 'title_like') url.searchParams.set('_page', 1)

    history.pushState({}, '', url)

    const { data, pagination } = await postApi.getAll(url.searchParams)

    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('failed to fetch post list: ', error)
  }
}

function handlePrevClick(e) {
  e.preventDefault()
  const ulPagination = getUlPaginationElement()

  if (!ulPagination) return
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  if (page <= 1) return

  handleFilterChange('_page', page - 1)
}

function handleNextClick(e) {
  e.preventDefault()
  const ulPagination = getUlPaginationElement()

  if (!ulPagination) return
  const page = Number.parseInt(ulPagination.dataset.page) || 1
  const totalPages = ulPagination.dataset.totalPages
  if (page >= totalPages) return

  handleFilterChange('_page', page + 1)
}

function initPagination() {
  const ulPagination = getUlPaginationElement()
  if (!ulPagination) return
  const preLink = ulPagination.firstElementChild?.firstElementChild
  if (preLink) {
    preLink.addEventListener('click', handlePrevClick)
  }

  const nextLink = ulPagination.lastElementChild?.lastElementChild
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick)
  }

  console.log({ preLink, nextLink })
}

function initSearch() {
  const searchInput = document.getElementById('searchInput')
  if (!searchInput) return
  const queryParams = new URLSearchParams(window.location.search)
  if (queryParams.get('title_like')) {
    searchInput.value = queryParams.get('title_like')
  }
  const debounceSearch = debounce(
    (event) => handleFilterChange('title_like', event.target.value),
    500
  )

  if (!searchInput) return
  searchInput.addEventListener('input', debounceSearch)
}

;(async () => {
  try {
    const url = new URL(window.location)

    if (!url.searchParams.get('_limit')) {
      url.searchParams.set('_limit', 6)
    }
    if (!url.searchParams.get('_page')) {
      url.searchParams.set('_page', 1)
    }
    history.pushState({}, '', url)
    const queryParams = url.searchParams

    initPagination(queryParams)
    initSearch(queryParams)

    const { data, pagination } = await postApi.getAll(queryParams)

    renderPostList(data)
    renderPagination(pagination)
  } catch (error) {
    console.log('get all failed: ', error)
  }
})()
