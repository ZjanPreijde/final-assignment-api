module.exports = (batch, data) => {
  // Check startsAt
  if (!data.startsAt.toDate()) {
    let err = new Error('Please enter a valid start date needed!')
    err.status = 422
    throw err
  }

  // Check endsAt
  if (!data.endsAt.toDate()) {
    let err = new Error('Please enter a valid end date needed!')
    err.status = 422
    throw err
  }

  // Check startsAt <= endsAt
  if (data.endsAt.toDate() < data.startsAt.toDate()) {
    let err = new Error('End date can not be before start date!')
    err.status = 422
    throw err
  }
  batch.name     = date.name
  batch.startsAt = data.startsAt
  batch.endsAt   = data.endsAt
  return { batch }
}
