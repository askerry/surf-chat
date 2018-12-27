'use strict'

const { dialogflow, BasicCard, Table } = require('actions-on-google')

const fetch = require('node-fetch')

const functions = require('firebase-functions')

const moment = require('moment')

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true })

const SPOT_MAP = {
  'Smith River Kellog Road': 652,
  'Point St George': 653,
  'Garths Reef': 654,
  'Whaler Island': 655,
  'South Beach': 656,
  'Enderts Beach': 657,
  'Wilson Creek': 658,
  'Klamath Rivermouth': 659,
  'Gold Bluffs Beach': 660,
  'Freshwater Lagoon': 661,
  'Patricks Point': 662,
  'Trinidad State Beach': 663,
  'Camel Rock': 664,
  Moonstone: 165,
  'Little River State Beach': 666,
  'Mad River Beach': 667,
  'Samoa Peninsula': 668,
  Bunkers: 669,
  'North Jetty': 670,
  'Harbor Entrance': 671,
  'South Jetty': 189,
  'Centerville Beach': 673,
  'Cape Mendocino': 674,
  Deadmans: 648,
  'Third Reef': 676,
  'No Pass': 677,
  'DeHaven Creek': 678,
  'Chadbourne Gulch Blues Beach': 679,
  'Seaside Creek Beach': 680,
  'Ward Avenue': 681,
  'Virgin Creek': 682,
  'Caspar Creek': 683,
  'Big Rivermouth': 684,
  'Navarro Rivermouth': 685,
  'Manchester State Beach Alder Creek': 686,
  'Point Arena': 687,
  'Schooner Gulch Moat Creek': 688,
  'Gualala Rivermouth': 689,
  'Black Point Beach': 105,
  Secrets: 690,
  'Timber Cove': 691,
  'The Fort': 692,
  Mystos: 693,
  'Russian Rivermouth': 106,
  'Goat Rock': 694,
  'Salmon Creek': 107,
  'Doran Beach': 108,
  'Dillon Beach': 109,
  'Point Reyes Beach': 695,
  'Drakes Estero': 696,
  'The Patch': 592,
  Bolinas: 110,
  'Stinson Beach': 111,
  'Fort Cronkhite': 112,
  'Crissy Field': 800,
  'Fort Point': 113,
  'Eagles Point': 649,
  'Ocean Beach - Kellys Cove': 697,
  'Ocean Beach - VFW': 114,
  'Ocean Beach - Noriega': 117,
  'Ocean Beach - Sloat': 801,
  'Sharp Park': 619,
  'Rockaway Beach': 119,
  'Linda Mar': 120,
  'Pedro Point': 698,
  Montara: 121,
  Mavericks: 122,
  'Princeton Jetty': 123,
  'Half Moon Bay Beach': 124,
  'San Gregorio State Beach': 699,
  'Pomponio State Beach': 126,
  'Pescadero State Beach': 127,
  'Pescadero Cove': 700,
  'Gazos Creek': 701,
  'Franklin Point': 622,
  'Ano Nuevo': 118,
  'County Line': 207,
  'Waddell Creek': 129,
  'Waddell Reefs': 600,
  'Scotts Creek': 128,
  'Rims Reef': 621,
  'Davenport Landing': 133,
  'Laguna Creek': 132,
  'Four Mile': 131,
  'Three Mile': 130,
  'Natural Bridges': 6,
  'Stockton Avenue': 146,
  'Swift Street': 145,
  Getchell: 10,
  'Mitchells Cove': 144,
  'Steamer Lane': 2,
  Cowells: 3,
  'The Rivermouth': 143,
  'Santa Cruz Harbor': 142,
  'Murph Bar': 141,
  Blacks: 9,
  'Sunny Cove': 140,
  'Santa Marias': 8,
  '26th Avenue': 7,
  'Little Windansea': 138,
  Rockview: 137,
  'Sewer Peak': 5,
  'Pleasure Point': 1,
  '38th Avenue': 4,
  'The Hook': 147,
  'Sharks Cove': 148,
  'Capitola Jetties': 149,
  Manresa: 150,
  'Sunset Beach': 136,
  'Zmudowski State Beach': 702,
  'Moss Landing State Beach': 161,
  'Salinas River State Beach': 703,
  'Marina State Beach': 160,
  'Del Monte Beach': 159,
  'Lovers Point': 158,
  'Asilomar State Beach': 156,
  'Carmel Beach': 154,
  'Andrew Molera': 153,
  'Sand Dollar': 152,
  'Willow Creek': 151,
  'San Carpoforo Creek': 167,
  Lighthouse: 704,
  'Arroyo Laguna': 705,
  'Pico Creek': 642,
  'San Simeon Creek': 166,
  Exotics: 706,
  'Leffingwell Landing': 707,
  'Cayucos Pier': 164,
  'Studio Drive': 599,
  'Morro Rock': 163,
  'Hazard Canyon': 708,
  'Spooners Cove': 709,
  'Saint Annes': 710,
  'Pismo Beach Pier': 162,
  'Santa Maria Rivermouth': 711,
  'Surf Beach': 712,
  Jalama: 185,
  Tajiguas: 713,
  Refugio: 620,
  Beavers: 714,
  'El Capitan': 183,
  Sands: 182,
  Devereux: 181,
  Pescaderos: 715,
  Depressions: 180,
  'Campus Point': 179,
  Poles: 178,
  'The Pit': 641,
  Leadbetter: 177,
  Sandspit: 176,
  Hammonds: 174,
  Miramar: 173,
  'Santa Claus Lane': 171,
  'Carpinteria Beach': 169,
  'Tar Pits': 168,
  Rincon: 198,
  'La Conchita': 197,
  'Little Rincon': 196,
  Hobsons: 195,
  Faria: 194,
  Pitas: 640,
  Mondos: 193,
  Solimar: 192,
  'Emma Wood': 191,
  'Ventura Overhead': 639,
  'C Street': 190,
  'San Buenaventura State Beach': 716,
  'Santa Clara Rivermouth': 188,
  'McGrath State Beach': 187,
  'Silver Strand': 717,
  'Port Hueneme Beach Park': 718,
  'Ormand Beach': 719,
  'Point Mugu': 186,
  'Leo Carrillo': 638,
  Zero: 720,
  'Trancas Point': 721,
  'Zuma Beach': 206,
  'Point Dume': 637,
  'Latigo Canyon': 636,
  Malibu: 205,
  'Big Rock': 759,
  Topanga: 388,
  'Chart House': 635,
  Sunset: 387,
  'Santa Monica Jetties': 723,
  'Santa Monica Municipal Pier': 724,
  'Bay Street': 725,
  'Rose Avenue': 726,
  Venice: 204,
  'Toes Overs': 727,
  'Ballona Creek': 728,
  'D and W': 729,
  'New Jetty': 730,
  'El Porto': 402,
  'Manhattan Beach': 203,
  Hermosa: 202,
  'Redondo Breakwater': 201,
  'Sapphire Street': 731,
  'Topaz Street': 732,
  'Torrance Beach': 200,
  'Rat Shit': 733,
  Haggertys: 396,
  'Palos Verdes Cove': 633,
  Indicator: 734,
  'Lunada Bay': 199,
  'Abalone Cove Beach': 735,
  'Royal Palms State Beach': 736,
  'Cabrillo Beach': 632,
  '64th Place': 737,
  '72nd Place': 738,
  'San Gabriel Rivermouth': 739,
  '7th Street': 740,
  'Seal Beach Pier': 222,
  '13th Street': 601,
  'Dolphin Avenue': 741,
  'Surfside Jetty': 602,
  'Anderson St': 603,
  'Bolsa Chica': 604,
  Goldenwest: 220,
  '17th Street': 605,
  'Huntington Pier': 221,
  'Huntington Beach': 643,
  'Santa Ana River Jetties': 606,
  '56th Street': 219,
  '40th Street': 607,
  '36th Street': 608,
  Blackies: 651,
  'Newport Pier': 609,
  'Newport Point': 218,
  'The Wedge': 217,
  'Corona Del Mar': 216,
  'Morro Beach': 742,
  Rockpile: 760,
  Thalia: 611,
  'Brooks Street': 215,
  Agate: 743,
  'Salt Creek': 214,
  Doheny: 213,
  Poche: 744,
  '204s': 745,
  'San Clemente Pier': 212,
  'T Street': 211,
  Lasuen: 391,
  Riviera: 644,
  Calafia: 645,
  'State Beach': 392,
  'North Gate': 210,
  'Cottons Point': 209,
  'Upper Trestles': 623,
  'Lower Trestles': 208,
  Church: 625,
  'San Onofre': 239,
  Trails: 614,
  'Oceanside Harbor': 238,
  'Oceanside Pier': 594,
  Wisconsin: 628,
  Cassidy: 629,
  Tamarack: 237,
  'Warm Water Jetty': 596,
  'Terra Mar': 597,
  Campground: 630,
  Ponto: 236,
  Grandview: 400,
  Beacons: 235,
  'Stone Steps': 746,
  'Moonlight Beach': 747,
  'D Street': 401,
  Swamis: 234,
  Pipes: 233,
  'Cardiff Reef': 232,
  Sandbox: 748,
  Georges: 749,
  'Seaside Reef': 231,
  Pillbox: 750,
  'Del Mar Rivermouth': 751,
  'Del Mar Beach': 752,
  '15th Street - Del Mar': 230,
  'South Del Mar': 753,
  'Torrey Pines State Beach': 754,
  'Blacks Beach': 229,
  'Scripps Pier': 228,
  'La Jolla Cove': 755,
  Horseshoe: 756,
  'Little Point': 757,
  'Simmons Reef': 758,
  Windansea: 227,
  'Bird Rock': 398,
  Tourmaline: 399,
  'Pacific Beach': 226,
  'Mission Beach': 397,
  'Dog Beach': 761,
  'Ocean Beach Jetty': 762,
  'Ocean Beach Pier': 225,
  'Sunset Cliffs': 224,
  Coronado: 598,
  'Imperial Beach': 223,
}

function findSpotId(locationQuery) {
  console.log(locationQuery)
  console.log(SPOT_MAP[locationQuery])
  let spotId = SPOT_MAP[locationQuery]
  return spotId
}

function getSpotInfo(conv, spotId, date, hrStrs) {
  const url = `http://api.spitcast.com/api/spot/forecast/${spotId}?dval=${date}`
  console.log(`Making request to ${url}`)
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(hrStrs)
      const matches = hrStrs.map(hrStr => {
        return data.filter(d => d.hour == hrStr)[0]
      })
      return constructInfoResponse(conv, matches)
    })
    .catch(error => {
      return apiErrorResponse(conv, error)
    })
}

function parseParams(params) {
  console.log(params)
  let locationQuery
  if (params.location) {
    locationQuery =
      params.location.city ||
      params.location['street-address'] ||
      params.location['subadmin-area']
  } else {
    locationQuery = params['geo-city']
  }
  const now = moment()
  let d
  let t
  if (params.date & params.time) {
    d = moment(params.date)
    t = moment(params.time)
  } else if (params.time) {
    t = moment(params.time)
    d = now
  } else if (params.date) {
    d = moment(params.date)
    if (d.date() == now.date()) {
      t = now
    } else {
      t = moment(params.date)
    }
  } else {
    d = now
    t = now
  }
  const dateStr = `${d.year()}${d.month() + 1}${d.date()}`
  const hrs = [t.hour(), t.hour() + 1, t.hour() + 2, t.hour() + 3]
  const hrStrs = hrs.map(hr => (hr > 12 ? `${hr - 12}PM` : `${hr}AM`))
  return { locationQuery, dateStr, hrStrs }
}

function constructInfoResponse(conv, results) {
  const result = results[0]
  const rows = results.map(row => {
    const ft = Math.round(row.size_ft * 100) / 100 + 'ft'
    return [
      row.hour,
      row.shape_detail.swell,
      row.shape_detail.tide,
      row.shape_detail.wind,
      ft,
    ]
  })
  const table = new Table({
    title: result.spot_name,
    subtitle: `Surf forecast for ${result.date}.`,
    dividers: true,
    columns: ['time', 'swell', 'tide', 'wind', 'size'],
    rows,
  })
  conv.add(`Here's your surf report!`, table)
  return
}

function apiErrorResponse(conv, error) {
  console.error(error)
  conv.add('We had a problem connecting to spitcast. Please try again later.')
}

function surfForecastIntent(conv, params) {
  const { locationQuery, dateStr, hrStrs } = parseParams(params)
  if (!locationQuery) {
    conv.add("I didn't catch that. Where do you want to go?")
  }
  conv.add(`Checking the surf conditions for ${locationQuery} ...`)
  const spotId = findSpotId(locationQuery)
  if (!spotId) {
    conv.add('I could not find any surf spot for ' + locationQuery)
    return Promise.resolve()
  }
  return getSpotInfo(conv, spotId, dateStr, hrStrs)
}

app.intent('surf_forecast', intentWrapper)

function intentWrapper(conv, params) {
  return surfForecastIntent(conv, params)
    .then(function(result) {
      return Promise.resolve()
    })
    .catch(function(err) {
      console.error(err)
      conv.close('Uh oh, something unexpected happened.')
      return Promise.resolve()
    })
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
