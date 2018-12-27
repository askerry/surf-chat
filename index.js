'use strict'

const { dialogflow, Image, Table } = require('actions-on-google')

const fetch = require('node-fetch')

const functions = require('firebase-functions')

const moment = require('moment')

// Instantiate the Dialogflow client.
const app = dialogflow({ debug: true })

const DEFUALT_TZ = -7

const SPOT_MAP = {
  'smith river kellog road': 652,
  'point st george': 653,
  'garths reef': 654,
  'whaler island': 655,
  'south beach': 656,
  'enderts beach': 657,
  'wilson creek': 658,
  'klamath rivermouth': 659,
  'gold bluffs beach': 660,
  'freshwater lagoon': 661,
  'patricks point': 662,
  'trinidad state beach': 663,
  'camel rock': 664,
  moonstone: 165,
  'little river state beach': 666,
  'mad river beach': 667,
  'samoa peninsula': 668,
  bunkers: 669,
  'north jetty': 670,
  'harbor entrance': 671,
  'south jetty': 189,
  'centerville beach': 673,
  'cape mendocino': 674,
  deadmans: 648,
  'third reef': 676,
  'no pass': 677,
  'dehaven creek': 678,
  'chadbourne gulch blues beach': 679,
  'seaside creek beach': 680,
  'ward avenue': 681,
  'virgin creek': 682,
  'caspar creek': 683,
  'big rivermouth': 684,
  'navarro rivermouth': 685,
  'manchester state beach alder creek': 686,
  'point arena': 687,
  'schooner gulch moat creek': 688,
  'gualala rivermouth': 689,
  'black point beach': 105,
  secrets: 690,
  'timber cove': 691,
  'the fort': 692,
  mystos: 693,
  'russian rivermouth': 106,
  'goat rock': 694,
  'salmon creek': 107,
  'doran beach': 108,
  'dillon beach': 109,
  'point reyes beach': 695,
  'drakes estero': 696,
  'the patch': 592,
  bolinas: 110,
  'stinson beach': 111,
  'fort cronkhite': 112,
  'crissy field': 800,
  'fort point': 113,
  'eagles point': 649,
  'ocean beach - kellys cove': 697,
  'ocean beach - vfw': 114,
  'ocean beach - noriega': 117,
  'ocean beach - sloat': 801,
  'sharp park': 619,
  'rockaway beach': 119,
  'linda mar': 120,
  'pedro point': 698,
  montara: 121,
  mavericks: 122,
  'princeton jetty': 123,
  'half moon bay beach': 124,
  'san gregorio state beach': 699,
  'pomponio state beach': 126,
  'pescadero state beach': 127,
  'pescadero cove': 700,
  'gazos creek': 701,
  'franklin point': 622,
  'ano nuevo': 118,
  'county line': 207,
  'waddell creek': 129,
  'waddell reefs': 600,
  'scotts creek': 128,
  'rims reef': 621,
  'davenport landing': 133,
  'laguna creek': 132,
  'four mile': 131,
  'three mile': 130,
  'natural bridges': 6,
  'stockton avenue': 146,
  'swift street': 145,
  getchell: 10,
  'mitchells cove': 144,
  'steamer lane': 2,
  cowells: 3,
  'the rivermouth': 143,
  'santa cruz harbor': 142,
  'murph bar': 141,
  blacks: 9,
  'sunny cove': 140,
  'santa marias': 8,
  '26th avenue': 7,
  'little windansea': 138,
  rockview: 137,
  'sewer peak': 5,
  'pleasure point': 1,
  '38th avenue': 4,
  'the hook': 147,
  'sharks cove': 148,
  'capitola jetties': 149,
  manresa: 150,
  'sunset beach': 136,
  'zmudowski state beach': 702,
  'moss landing state beach': 161,
  'salinas river state beach': 703,
  'marina state beach': 160,
  'del monte beach': 159,
  'lovers point': 158,
  'asilomar state beach': 156,
  'carmel beach': 154,
  'andrew molera': 153,
  'sand dollar': 152,
  'willow creek': 151,
  'san carpoforo creek': 167,
  lighthouse: 704,
  'arroyo laguna': 705,
  'pico creek': 642,
  'san simeon creek': 166,
  exotics: 706,
  'leffingwell landing': 707,
  'cayucos pier': 164,
  'studio drive': 599,
  'morro rock': 163,
  'hazard canyon': 708,
  'spooners cove': 709,
  'saint annes': 710,
  'pismo beach pier': 162,
  'santa maria rivermouth': 711,
  'surf beach': 712,
  jalama: 185,
  tajiguas: 713,
  refugio: 620,
  beavers: 714,
  'el capitan': 183,
  sands: 182,
  devereux: 181,
  pescaderos: 715,
  depressions: 180,
  'campus point': 179,
  poles: 178,
  'the pit': 641,
  leadbetter: 177,
  sandspit: 176,
  hammonds: 174,
  miramar: 173,
  'santa claus lane': 171,
  'carpinteria beach': 169,
  'tar pits': 168,
  rincon: 198,
  'la conchita': 197,
  'little rincon': 196,
  hobsons: 195,
  faria: 194,
  pitas: 640,
  mondos: 193,
  solimar: 192,
  'emma wood': 191,
  'ventura overhead': 639,
  'c street': 190,
  'san buenaventura state beach': 716,
  'santa clara rivermouth': 188,
  'mcgrath state beach': 187,
  'silver strand': 717,
  'port hueneme beach park': 718,
  'ormand beach': 719,
  'point mugu': 186,
  'leo carrillo': 638,
  zero: 720,
  'trancas point': 721,
  'zuma beach': 206,
  'point dume': 637,
  'latigo canyon': 636,
  malibu: 205,
  'big rock': 759,
  topanga: 388,
  'chart house': 635,
  sunset: 387,
  'santa monica jetties': 723,
  'santa monica municipal pier': 724,
  'bay street': 725,
  'rose avenue': 726,
  venice: 204,
  'toes overs': 727,
  'ballona creek': 728,
  'd and w': 729,
  'new jetty': 730,
  'el porto': 402,
  'manhattan beach': 203,
  hermosa: 202,
  'redondo breakwater': 201,
  'sapphire street': 731,
  'topaz street': 732,
  'torrance beach': 200,
  'rat shit': 733,
  haggertys: 396,
  'palos verdes cove': 633,
  indicator: 734,
  'lunada bay': 199,
  'abalone cove beach': 735,
  'royal palms state beach': 736,
  'cabrillo beach': 632,
  '64th place': 737,
  '72nd place': 738,
  'san gabriel rivermouth': 739,
  '7th street': 740,
  'seal beach pier': 222,
  '13th street': 601,
  'dolphin avenue': 741,
  'surfside jetty': 602,
  'anderson st': 603,
  'bolsa chica': 604,
  goldenwest: 220,
  '17th street': 605,
  'huntington pier': 221,
  'huntington beach': 643,
  'santa ana river jetties': 606,
  '56th street': 219,
  '40th street': 607,
  '36th street': 608,
  blackies: 651,
  'newport pier': 609,
  'newport point': 218,
  'the wedge': 217,
  'corona del mar': 216,
  'morro beach': 742,
  rockpile: 760,
  thalia: 611,
  'brooks street': 215,
  agate: 743,
  'salt creek': 214,
  doheny: 213,
  poche: 744,
  '204s': 745,
  'san clemente pier': 212,
  't street': 211,
  lasuen: 391,
  riviera: 644,
  calafia: 645,
  'state beach': 392,
  'north gate': 210,
  'cottons point': 209,
  'upper trestles': 623,
  'lower trestles': 208,
  church: 625,
  'san onofre': 239,
  trails: 614,
  'oceanside harbor': 238,
  'oceanside pier': 594,
  wisconsin: 628,
  cassidy: 629,
  tamarack: 237,
  'warm water jetty': 596,
  'terra mar': 597,
  campground: 630,
  ponto: 236,
  grandview: 400,
  beacons: 235,
  'stone steps': 746,
  'moonlight beach': 747,
  'd street': 401,
  swamis: 234,
  pipes: 233,
  'cardiff reef': 232,
  sandbox: 748,
  georges: 749,
  'seaside reef': 231,
  pillbox: 750,
  'del mar rivermouth': 751,
  'del mar beach': 752,
  '15th street - del mar': 230,
  'south del mar': 753,
  'torrey pines state beach': 754,
  'blacks beach': 229,
  'scripps pier': 228,
  'la jolla cove': 755,
  horseshoe: 756,
  'little point': 757,
  'simmons reef': 758,
  windansea: 227,
  'bird rock': 398,
  tourmaline: 399,
  'pacific beach': 226,
  'mission beach': 397,
  'dog beach': 761,
  'ocean beach jetty': 762,
  'ocean beach pier': 225,
  'sunset cliffs': 224,
  coronado: 598,
  'imperial beach': 223,
}

function findSpotId(conv, locationQuery) {
  console.log(locationQuery)
  let spotId = SPOT_MAP[locationQuery]
  if (!spotId) {
    conv.add('I could not find any surf spot for ' + locationQuery)
    return
  }
  return spotId
}

function fetchSpotInfo(conv, spotId, date) {
  const url = `http://api.spitcast.com/api/spot/forecast/${spotId}?dval=${date}`
  console.log(`Making request to ${url}`)
  return fetch(url)
    .then(response => response.json())
    .catch(error => {
      console.error(error)
      conv.add(
        'We had a problem connecting to the spitcast API. Please try again later.'
      )
    })
}

function getImage(result) {
  // TODO: get image from the Google Places API
  const image = new Image({
    url:
      'https://www.citymb.info/Home/ShowPublishedImage/24205/636716545817630000',
    alt: result.spot_name,
  })
  return image
}

function getSpotInfo(conv, spotId, date, hrStrs) {
  const url = `http://api.spitcast.com/api/spot/forecast/${spotId}?dval=${date}`
  return fetchSpotInfo(conv, spotId, date).then(data => {
    console.log(hrStrs)
    const matches = hrStrs.map(hrStr => {
      return data.filter(d => d.hour == hrStr)[0]
    })
    return constructInfoResponse(conv, matches, getImage(matches[0]))
  })
}

function _constructHourSet(t, numHrs = 4) {
  const hrStrs = []
  for (let i = 0; i <= numHrs; i++) {
    hrStrs.push(t.format('hA'))
    t.add(1, 'hours')
  }
  return hrStrs
}

function parseParams(params) {
  // Parse possible location parameters
  let locationQuery
  if (params.surf_spot) {
    locationQuery = params['surf_spot']
  } else if (params.location) {
    locationQuery =
      params.location.city ||
      params.location['street-address'] ||
      params.location['subadmin-area']
  } else {
    locationQuery = params['geo-city']
  }
  locationQuery = locationQuery.toLocaleLowerCase()
  if (locationQuery.endsWith('?')) {
    locationQuery.slice(0, -1)
  }
  // Parse possible date/time parameters
  const now = moment().add(DEFUALT_TZ, 'hours')
  const date = params.date ? moment(params.date).parseZone() : now
  let time
  if (params.time) {
    time = moment(params.time).parseZone()
  } else if (params.date && date.date() !== now.date()) {
    // If we are looking at a date other than today, and no time was provided,
    // default to 6AM.
    time = moment(params.date)
      .startOf('day')
      .add(6, 'hours')
  } else {
    time = now
  }
  const dateStr = `${date.year()}${date.month() + 1}${date.date()}`
  const hrStrs = _constructHourSet(time)
  return { locationQuery, dateStr, hrStrs }
}

function _fmtQuality(rawQuality) {
  let quality
  switch (rawQuality) {
    case 'Poor':
      quality = '★☆☆☆'
      break
    case 'Poor-Fair':
      quality = '★★☆☆'
      break
    case 'Fair':
      quality = '★★★☆'
      break
    case 'Fair-Good':
      quality = '★★★★'
      break
    case 'Good':
      quality = '🌟🌟🌟🌟'
      break
    default:
      quality = rawQuality
  }
  return quality
}

function constructInfoResponse(conv, results, image) {
  const result = results[0]
  const hrRows = results.map(row => {
    const ft = Math.round(row.size_ft * 100) / 100 + 'ft'
    return [
      row.hour,
      _fmtQuality(row.shape_detail.swell),
      _fmtQuality(row.shape_detail.tide),
      _fmtQuality(row.shape_detail.wind),
      ft,
    ]
  })
  const table = new Table({
    title: result.spot_name,
    subtitle: `Surf forecast for ${result.date}.`,
    dividers: true,
    columns: ['time', 'swell', 'tide', 'wind', 'size'],
    image,
    rows: hrRows,
  })
  conv.add(`Here's your surf report!`, table)
  return
}

function surfForecastIntent(conv, params) {
  const { locationQuery, dateStr, hrStrs } = parseParams(params)
  if (!locationQuery) {
    conv.add("I didn't catch that. Where do you want to go?")
  }
  conv.add(`Checking the surf conditions for ${locationQuery} ...`)
  const spotId = findSpotId(conv, locationQuery)
  if (spotId) {
    conv.data.spotId = spotId
    return getSpotInfo(conv, spotId, dateStr, hrStrs)
  } else {
    return Promise.resolve()
  }
}

function intentHandler(conv, params) {
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

app.intent('surf_forecast', intentHandler)

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)
