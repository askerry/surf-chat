#! /usr/bin/env node

const fetch = require('node-fetch')

function fetchSpots() {
  const url = 'http://api.spitcast.com/api/spot/all'
  console.log(url)
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data
    })
    .catch(error => {
      console.error(error)
    })
}

function createSpotMap(results) {
  console.log('Spot name to id map:')
  const map = {}
  results.forEach(r => {
    map[r.spot_name.toLocaleLowerCase()] = r.spot_id
  })
  console.log(JSON.stringify(map))
}

function createEntities(results) {
  console.log('Entity definitions:')
  results.forEach(r => {
    console.log(
      `"${r.spot_name}", "${r.spot_name}", "${r.spot_name.toLocaleLowerCase()}"`
    )
  })
}

module.exports.init = function() {
  fetchSpots().then(data => {
    createSpotMap(data)
    createEntities(data)
  })
}
