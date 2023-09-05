const form = document.querySelector('.calculator__form')
const inputFields = document.querySelectorAll('.input-wrapper input')
const resultNumbers = document.querySelectorAll('.result__number')

const dayInput = document.querySelector('#day')
const dayError = dayInput.parentElement.querySelector('.error')
const dayResult = document.querySelector('#result-days')

const monthInput = document.querySelector('#month')
const monthError = monthInput.parentElement.querySelector('.error')
const monthResult = document.querySelector('#result-months')

const yearInput = document.querySelector('#year')
const yearError = yearInput.parentElement.querySelector('.error')
const yearResult = document.querySelector('#result-years')

const errorElements = document.querySelectorAll('.error')

let daysPerMonth = []
let day
let month
let year

form.addEventListener('submit', (e) => {
  e.preventDefault()

  daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  form.classList.remove('invalid')
  errorElements.forEach((el) => {
    el.innerText = ''
  })

  checkForEmptyInputs()

  validateYear()
  validateMonth()
  validateDay()

  if (
    dayInput.dataset.valid === 'true' &&
    monthInput.dataset.valid === 'true' &&
    yearInput.dataset.valid === 'true'
  ) {
    renderAge()
  }
})

function checkForEmptyInputs() {
  inputFields.forEach((input) => {
    input.dataset.valid = false
    if (input.value === '') {
      const errorEl = input.parentElement.querySelector('.error')
      errorEl.innerText = 'This field is required'
      invalidateForm()
    }
  })
}

function validateYear() {
  const pattern = /^\d{1,4}$/
  const input = yearInput.value
  const currYear = new Date().getFullYear()

  if (!pattern.test(input)) {
    yearError.innerText = 'Must be a valid year'
    invalidateForm()
  } else if (parseInt(input) > currYear) {
    yearError.innerText = 'Must be in the past'
    invalidateForm()
  } else {
    yearInput.dataset.valid = true
    year = parseInt(input)
    checkLeapYear()
  }
}

function validateMonth() {
  const pattern = /^\d{1,2}$/
  const input = monthInput.value

  if (!pattern.test(input) || parseInt(input) > 12) {
    monthError.innerText = 'Must be a valid month'
    invalidateForm()
  } else {
    monthInput.dataset.valid = true
    month = parseInt(input)
  }
}

function validateDay() {
  const pattern = /^\d{1,2}$/
  const input = dayInput.value

  if (!pattern.test(input) || parseInt(input) > 31) {
    dayError.innerText = 'Must be a valid day'
    invalidateForm()
  } else if (monthInput.dataset.valid) {
    const daysOfMonth = daysPerMonth[month - 1]
    if (parseInt(input) > daysOfMonth) {
      dayError.innerText = 'Must be a valid date'
      invalidateForm()
    } else {
      dayInput.dataset.valid = true
      day = parseInt(input)
    }
  }
}

function renderAge() {
  const now = new Date()
  const birthdate = new Date(`${year}-${month}-${day}`)
  const differenceDays = (now - birthdate) / 86400000

  const yearsOldExact = differenceDays / 365.25
  const yearsOld = Math.floor(yearsOldExact)

  const monthsOldExact = (yearsOldExact - yearsOld) * 12
  const monthsOld = Math.floor(monthsOldExact)

  const daysOldExact = (monthsOldExact - monthsOld) * 30.4167
  const daysOld = Math.floor(daysOldExact)

  renderOutput(yearResult, yearsOld)
  renderOutput(monthResult, monthsOld)
  renderOutput(dayResult, daysOld)
}

function renderOutput(element, value) {
  console.log(element, value)
  const increment = value / 150
  let c = 0

  const interval = setInterval(updateNumber, 1)

  function updateNumber() {
    if (c <= value) {
      element.innerText = Math.floor(c)
      c += increment
    } else {
      element.innerText = value
      clearInterval(interval)
    }
  }

  const unit = element.parentElement.querySelector('.result__unit')
  unit.innerText = value === 1 ? unit.dataset.unit : unit.dataset.unit + 's'
}

function invalidateForm() {
  if (form.classList.contains('invalid')) return

  form.classList.add('invalid')
  resultNumbers.forEach((el) => {
    el.innerText = '--'
  })
}

function checkLeapYear() {
  if (year % 4 !== 0) {
    return
  }
  if (year % 100 === 0 && year % 400 !== 0) return
  daysPerMonth[1] = 29
}
