import value0 from './schema-2.js';
export default {
["__schema96"]: {
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/definitions/__schema97"
    },
    "addToTitle": {
      "$ref": "#/definitions/__schema98"
    }
  },
  "required": [
    "text",
    "addToTitle"
  ],
  "additionalProperties": false
},
["__schema97"]: {
  "type": "string",
  "maxLength": 500
},
["__schema98"]: {
  "type": "boolean"
},
["__schema99"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema100"
    },
    "mobile": {
      "$ref": "#/definitions/__schema100"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema100"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema101"
    },
    "px": {
      "$ref": "#/definitions/__schema102"
    }
  },
  "required": [
    "mode",
    "px"
  ],
  "additionalProperties": false
},
["__schema101"]: {
  "type": "string",
  "enum": [
    "width",
    "height"
  ]
},
["__schema102"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 9007199254740991
},
["__schema103"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema104"
    },
    "mobile": {
      "$ref": "#/definitions/__schema104"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema104"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ]
},
["__schema105"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/borderRadius"
    },
    "mobile": {
      "$ref": "#/definitions/borderRadius"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema106"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema107"
    },
    "mobile": {
      "$ref": "#/definitions/__schema107"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema107"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema108"
    },
    "right": {
      "$ref": "#/definitions/__schema109"
    },
    "bottom": {
      "$ref": "#/definitions/__schema110"
    },
    "left": {
      "$ref": "#/definitions/__schema111"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema108"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema109"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema110"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema111"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema112"]: {
  "type": "string",
  "maxLength": 150
},
["__schema113"]: {
  "type": "boolean"
},
["videoBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema114"
    },
    "settings": {
      "$ref": "#/definitions/videoBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "Video block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": [
        "VIDEO_PREVIEW"
      ]
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": [
        "VIDEO_PREVIEW"
      ]
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema114"]: {
  "type": "string",
  "const": "video"
},
["videoBlockSettings"]: {
  "type": "object",
  "properties": {
    "videoLink": {
      "$ref": "#/definitions/__schema115"
    },
    "altText": {
      "$ref": "#/definitions/__schema96"
    },
    "customThumbnail": {
      "$ref": "#/definitions/__schema116"
    },
    "playButtonStyle": {
      "$ref": "#/definitions/__schema118"
    },
    "size": {
      "$ref": "#/definitions/__schema99"
    },
    "alignment": {
      "$ref": "#/definitions/__schema103"
    },
    "radius": {
      "$ref": "#/definitions/__schema105"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "paddings": {
      "$ref": "#/definitions/__schema119"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema120"
    }
  },
  "required": [
    "videoLink",
    "altText",
    "playButtonStyle",
    "size",
    "alignment",
    "radius",
    "hideElement",
    "paddings",
    "includeInOutput",
    "anchorLinkName",
    "responsiveMobile"
  ],
  "additionalProperties": false,
  "description": "Video block settings."
},
["__schema115"]: {
  "type": "string"
},
["__schema116"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema117"
    }
  },
  "required": [
    "src"
  ],
  "additionalProperties": false,
  "description": "Custom thumbnail settings for a video block. Absence disables custom thumbnail."
},
["videoCustomThumbnail"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema117"
    }
  },
  "required": [
    "src"
  ],
  "additionalProperties": false,
  "description": "Custom thumbnail settings for a video block. Absence disables custom thumbnail."
},
["__schema117"]: {
  "type": "string"
},
["__schema118"]: {
  "type": "string",
  "enum": [
    "NONE",
    "red",
    "white",
    "black",
    "blue",
    "whiteCircle",
    "blackCircle",
    "greyCircle",
    "blackCircleInverse"
  ]
},
["__schema119"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema107"
    },
    "mobile": {
      "$ref": "#/definitions/__schema107"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema120"]: {
  "type": "boolean"
},
["timerBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema121"
    },
    "settings": {
      "$ref": "#/definitions/timerBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "Timer block.",
  "x-stripo-setDocumentState": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": false,
      "mergeService": false
    },
    "delete": {
      "browser": false,
      "mergeService": false
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": false,
      "mergeService": false
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": [
        "TIMER_PREVIEW"
      ]
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema121"]: {
  "type": "string",
  "const": "timer"
},
["timerBlockSettings"]: {
  "type": "object",
  "properties": {
    "altText": {
      "$ref": "#/definitions/__schema96"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema122"
    },
    "size": {
      "$ref": "#/definitions/__schema99"
    },
    "alignment": {
      "$ref": "#/definitions/__schema103"
    },
    "margins": {
      "$ref": "#/definitions/__schema106"
    },
    "endDate": {
      "$ref": "#/definitions/__schema123"
    },
    "timeZone": {
      "$ref": "#/definitions/__schema124"
    },
    "link": {
      "$ref": "#/definitions/__schema125"
    },
    "displayDays": {
      "$ref": "#/definitions/__schema126"
    },
    "labelsLetterCase": {
      "$ref": "#/definitions/__schema127"
    },
    "separator": {
      "$ref": "#/definitions/__schema128"
    },
    "labelsLanguage": {
      "$ref": "#/definitions/__schema129"
    },
    "retinaDisplaySupport": {
      "$ref": "#/definitions/__schema130"
    },
    "expirationImageSrc": {
      "$ref": "#/definitions/__schema91"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    },
    "digitsFontFamily": {
      "$ref": "#/definitions/__schema131"
    },
    "digitsFontSize": {
      "$ref": "#/definitions/__schema132"
    },
    "digitsFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "digitsAdvancedColorSettings": {
      "$ref": "#/definitions/__schema133"
    },
    "labelsFontFamily": {
      "$ref": "#/definitions/__schema131"
    },
    "labelsFontSize": {
      "$ref": "#/definitions/__schema132"
    },
    "labelsFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "labelsAdvancedColorSettings": {
      "$ref": "#/definitions/__schema135"
    },
    "separatorFontFamily": {
      "$ref": "#/definitions/__schema131"
    },
    "separatorFontSize": {
      "$ref": "#/definitions/__schema132"
    },
    "separatorFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    }
  },
  "required": [
    "altText",
    "responsiveMobile",
    "size",
    "alignment",
    "margins",
    "endDate",
    "timeZone",
    "link",
    "displayDays",
    "separator",
    "labelsLanguage",
    "retinaDisplaySupport",
    "expirationImageSrc",
    "hideElement",
    "includeInOutput",
    "anchorLinkName",
    "digitsFontFamily",
    "digitsFontSize",
    "digitsFontColor",
    "labelsFontFamily",
    "labelsFontSize",
    "labelsFontColor",
    "separatorFontFamily",
    "separatorFontSize",
    "separatorFontColor",
    "backgroundColor"
  ],
  "additionalProperties": false,
  "description": "Timer block settings."
},
["__schema122"]: {
  "type": "boolean"
},
["__schema123"]: {
  "type": "string"
},
["__schema124"]: {
  "type": "string",
  "enum": [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Godthab",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "Asia/Novokuznetsk",
    "America/Kentucky/Monticello",
    "America/Kralendijk",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Lower_Princes",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Marigot",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montserrat",
    "America/Nassau",
    "America/New_York",
    "America/Nipigon",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Ojinaga",
    "America/Panama",
    "America/Pangnirtung",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Barthelemy",
    "America/St_Johns",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Thunder_Bay",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "America/Yellowknife",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Arctic/Longyearbyen",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom_Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/St_Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Canada/Atlantic",
    "Canada/Central",
    "Canada/Eastern",
    "Canada/Mountain",
    "Canada/Newfoundland",
    "Canada/Pacific",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Bratislava",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Busingen",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle_of_Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kiev",
    "Europe/Kyiv",
    "Europe/Kirov",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Mariehamn",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Podgorica",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/San_Marino",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Uzhgorod",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zaporozhye",
    "Europe/Zaporizhia",
    "Europe/Zurich",
    "GMT",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Enderbury",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis",
    "US/Alaska",
    "US/Arizona",
    "US/Central",
    "US/Eastern",
    "US/Hawaii",
    "US/Mountain",
    "US/Pacific",
    "UTC"
  ]
},
["__schema125"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema93"
    },
    {
      "type": "null"
    }
  ]
},
["__schema126"]: {
  "type": "boolean"
},
["__schema127"]: {
  "type": "string",
  "enum": [
    "CAPITALIZE",
    "UPPER",
    "LOWER"
  ]
},
["__schema128"]: {
  "type": "string",
  "maxLength": 100
},
["__schema129"]: {
  "type": "string",
  "enum": [
    "id",
    "ms",
    "bs",
    "bg",
    "da",
    "de",
    "et",
    "en",
    "es",
    "fr",
    "hr",
    "it",
    "lv",
    "lt",
    "hu",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "sk",
    "sl",
    "sr",
    "fi",
    "sv",
    "vi",
    "tr",
    "cz",
    "el",
    "ru",
    "uk",
    "he",
    "ar",
    "th",
    "zh",
    "ja",
    "ko"
  ]
},
["__schema130"]: {
  "type": "boolean"
},
["__schema131"]: {
  "type": "string",
  "enum": [
    "arial,'helvetica neue',helvetica,sans-serif",
    "'comic sans ms','marker felt-thin',arial,sans-serif",
    "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace",
    "georgia,times,'times new roman',serif",
    "helvetica,'helvetica neue',arial,verdana,sans-serif",
    "'lucida sans unicode','lucida grande',sans-serif",
    "tahoma,verdana,segoe,sans-serif",
    "'times new roman',times,baskerville,georgia,serif",
    "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif",
    "verdana,geneva,sans-serif",
    "arvo,courier,georgia,serif",
    "lato,'helvetica neue',helvetica,arial,sans-serif",
    "lora,georgia,'times new roman',serif",
    "merriweather,georgia,'times new roman',serif",
    "'merriweather sans','helvetica neue',helvetica,arial,sans-serif",
    "'noticia text',georgia,'times new roman',serif",
    "'open sans','helvetica neue',helvetica,arial,sans-serif",
    "'playfair display',georgia,'times new roman',serif",
    "roboto,'helvetica neue',helvetica,arial,sans-serif",
    "'source sans pro','helvetica neue',helvetica,arial,sans-serif"
  ]
},
["__schema132"]: {
  "type": "integer",
  "minimum": 8,
  "maximum": 72
},
["__schema133"]: {
  "type": "object",
  "properties": {
    "days": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "hours": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "minutes": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "seconds": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "days",
    "hours",
    "minutes",
    "seconds"
  ],
  "additionalProperties": false
},
["__schema134"]: {
  "type": "object",
  "properties": {
    "days": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "hours": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "minutes": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "seconds": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "days",
    "hours",
    "minutes",
    "seconds"
  ],
  "additionalProperties": false
},
["__schema135"]: {
  "type": "object",
  "properties": {
    "days": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "hours": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "minutes": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "seconds": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "days",
    "hours",
    "minutes",
    "seconds"
  ],
  "additionalProperties": false
},
["socialBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema136"
    },
    "settings": {
      "$ref": "#/definitions/__schema137"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "Social block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema136"]: {
  "type": "string",
  "const": "social"
},
["__schema137"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema138"
    },
    {
      "$ref": "#/definitions/__schema156"
    }
  ]
},
["__schema138"]: {
  "type": "object",
  "properties": {
    "style": {
      "$ref": "#/definitions/__schema139"
    },
    "iconSize": {
      "$ref": "#/definitions/__schema140"
    },
    "spaceBetweenIcons": {
      "$ref": "#/definitions/__schema141"
    },
    "alignment": {
      "$ref": "#/definitions/__schema144"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema145"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    },
    "networks": {
      "minItems": 1,
      "type": "array",
      "items": {
        "$ref": "#/definitions/__schema151"
      }
    },
    "textCustomization": {
      "type": "boolean",
      "const": false
    }
  },
  "required": [
    "style",
    "iconSize",
    "spaceBetweenIcons",
    "alignment",
    "backgroundColor",
    "hideElement",
    "margins",
    "includeInOutput",
    "anchorLinkName",
    "networks",
    "textCustomization"
  ],
  "additionalProperties": false
},
["__schema139"]: {
  "type": "string",
  "enum": [
    "custom",
    "logoColored",
    "logoBlack",
    "logoGray",
    "logoWhite",
    "circleColored",
    "circleColoredBordered",
    "roundedColored",
    "roundedColoredBordered",
    "squareColored",
    "squareColoredBordered",
    "circleBlack",
    "circleBlackBordered",
    "roundedBlack",
    "roundedBlackBordered",
    "squareBlack",
    "squareBlackBordered",
    "circleGray",
    "circleGrayBordered",
    "roundedGray",
    "roundedGrayBordered",
    "squareGray",
    "squareGrayBordered",
    "circleWhite",
    "circleWhiteBordered",
    "roundedWhite",
    "roundedWhiteBordered",
    "squareWhite",
    "squareWhiteBordered"
  ]
},
["__schema140"]: {
  "type": "integer",
  "minimum": 16,
  "maximum": 64
},
["__schema141"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema142"
    },
    "mobile": {
      "$ref": "#/definitions/__schema143"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema142"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema143"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema144"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema104"
    },
    "mobile": {
      "$ref": "#/definitions/__schema104"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema145"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema146"
    },
    "mobile": {
      "$ref": "#/definitions/__schema146"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema146"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema147"
    },
    "right": {
      "$ref": "#/definitions/__schema148"
    },
    "bottom": {
      "$ref": "#/definitions/__schema149"
    },
    "left": {
      "$ref": "#/definitions/__schema150"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema147"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema148"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema149"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema150"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema151"]: {
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "twitter",
            "xcom",
            "facebook",
            "youtube",
            "askfm",
            "behance",
            "dribbble",
            "flickr",
            "foursquare",
            "googleplus",
            "instagram",
            "lastfm",
            "linkedin",
            "myspace",
            "pinterest",
            "soundcloud",
            "tumblr",
            "vimeo",
            "hangouts",
            "messenger",
            "skype",
            "snapchat",
            "telegram",
            "viber",
            "whatsapp",
            "email",
            "website",
            "mapmarker",
            "world",
            "address",
            "phone",
            "share",
            "rss",
            "appstore",
            "googleplay",
            "windowsstore",
            "wechat",
            "weibo",
            "blogger",
            "medium",
            "dropbox",
            "googledrive",
            "slack",
            "github",
            "pdf",
            "doc",
            "xls",
            "ppt",
            "xing",
            "meetup",
            "fleeped",
            "tripAdvisor",
            "spotify",
            "tiktok",
            "workplace",
            "gmail",
            "iTunesPodcasts",
            "zoom",
            "teams",
            "onedrive",
            "discord",
            "twitch",
            "line",
            "patreon",
            "kofi",
            "yammer",
            "buyMeACoffee",
            "huaweiAppGallery",
            "googleBusiness",
            "reddit",
            "strava",
            "goodreads",
            "yelp",
            "google",
            "mastodon",
            "glassdoor",
            "threads",
            "bluesky",
            "digg",
            "meet"
          ]
        },
        "link": {
          "$ref": "#/definitions/__schema152"
        },
        "title": {
          "$ref": "#/definitions/__schema154"
        }
      },
      "required": [
        "type",
        "title"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "const": "custom"
        },
        "link": {
          "$ref": "#/definitions/__schema152"
        },
        "title": {
          "$ref": "#/definitions/__schema154"
        },
        "icon": {
          "$ref": "#/definitions/__schema155"
        }
      },
      "required": [
        "type",
        "title",
        "icon"
      ],
      "additionalProperties": false
    }
  ]
},
["__schema152"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema94"
    },
    "href": {
      "$ref": "#/definitions/__schema153"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema153"]: {
  "type": "string",
  "minLength": 1
},
["__schema154"]: {
  "type": "string",
  "maxLength": 100
},
["__schema155"]: {
  "type": "string"
},
["__schema156"]: {
  "type": "object",
  "properties": {
    "style": {
      "$ref": "#/definitions/__schema139"
    },
    "iconSize": {
      "$ref": "#/definitions/__schema140"
    },
    "spaceBetweenIcons": {
      "$ref": "#/definitions/__schema141"
    },
    "alignment": {
      "$ref": "#/definitions/__schema144"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema145"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    },
    "networks": {
      "minItems": 1,
      "type": "array",
      "items": {
        "$ref": "#/definitions/__schema157"
      }
    },
    "textCustomization": {
      "type": "boolean",
      "const": true
    }
  },
  "required": [
    "style",
    "iconSize",
    "spaceBetweenIcons",
    "alignment",
    "backgroundColor",
    "hideElement",
    "margins",
    "includeInOutput",
    "anchorLinkName",
    "networks",
    "textCustomization"
  ],
  "additionalProperties": false
},
["__schema157"]: {
  "oneOf": [
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "twitter",
            "xcom",
            "facebook",
            "youtube",
            "askfm",
            "behance",
            "dribbble",
            "flickr",
            "foursquare",
            "googleplus",
            "instagram",
            "lastfm",
            "linkedin",
            "myspace",
            "pinterest",
            "soundcloud",
            "tumblr",
            "vimeo",
            "hangouts",
            "messenger",
            "skype",
            "snapchat",
            "telegram",
            "viber",
            "whatsapp",
            "email",
            "website",
            "mapmarker",
            "world",
            "address",
            "phone",
            "share",
            "rss",
            "appstore",
            "googleplay",
            "windowsstore",
            "wechat",
            "weibo",
            "blogger",
            "medium",
            "dropbox",
            "googledrive",
            "slack",
            "github",
            "pdf",
            "doc",
            "xls",
            "ppt",
            "xing",
            "meetup",
            "fleeped",
            "tripAdvisor",
            "spotify",
            "tiktok",
            "workplace",
            "gmail",
            "iTunesPodcasts",
            "zoom",
            "teams",
            "onedrive",
            "discord",
            "twitch",
            "line",
            "patreon",
            "kofi",
            "yammer",
            "buyMeACoffee",
            "huaweiAppGallery",
            "googleBusiness",
            "reddit",
            "strava",
            "goodreads",
            "yelp",
            "google",
            "mastodon",
            "glassdoor",
            "threads",
            "bluesky",
            "digg",
            "meet"
          ]
        },
        "link": {
          "$ref": "#/definitions/__schema152"
        },
        "title": {
          "$ref": "#/definitions/__schema154"
        },
        "alt": {
          "$ref": "#/definitions/__schema158"
        }
      },
      "required": [
        "type",
        "title",
        "alt"
      ],
      "additionalProperties": false
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "const": "custom"
        },
        "link": {
          "$ref": "#/definitions/__schema152"
        },
        "title": {
          "$ref": "#/definitions/__schema154"
        },
        "alt": {
          "$ref": "#/definitions/__schema158"
        },
        "icon": {
          "$ref": "#/definitions/__schema155"
        }
      },
      "required": [
        "type",
        "title",
        "alt",
        "icon"
      ],
      "additionalProperties": false
    }
  ]
},
["__schema158"]: {
  "type": "string",
  "maxLength": 500
},
["htmlBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema159"
    },
    "settings": {
      "$ref": "#/definitions/__schema160"
    },
    "content": {
      "$ref": "#/definitions/__schema161"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "HTML block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema159"]: {
  "type": "string",
  "const": "html"
},
["__schema160"]: {
  "type": "object",
  "properties": {
    "margins": {
      "$ref": "#/definitions/__schema106"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    }
  },
  "required": [
    "margins",
    "includeInOutput",
    "hideElement",
    "anchorLinkName"
  ],
  "additionalProperties": false
},
["__schema161"]: {
  "type": "string"
},
["buttonBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema162"
    },
    "settings": {
      "$ref": "#/definitions/buttonBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "Button block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema162"]: {
  "type": "string",
  "const": "button"
},
["buttonBlockSettings"]: {
  "type": "object",
  "properties": {
    "link": {
      "$ref": "#/definitions/__schema163"
    },
    "text": {
      "$ref": "#/definitions/__schema175"
    },
    "alignment": {
      "$ref": "#/definitions/__schema176"
    },
    "fixedHeight": {
      "$ref": "#/definitions/__schema177"
    },
    "icon": {
      "$ref": "#/definitions/__schema180"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema185"
    },
    "margins": {
      "$ref": "#/definitions/__schema185"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLink": {
      "$ref": "#/definitions/__schema188"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "fontSize": {
      "$ref": "#/definitions/fontSize"
    },
    "textStyle": {
      "$ref": "#/definitions/buttonsTextStyle"
    },
    "fitContainer": {
      "$ref": "#/definitions/responsiveBoolean"
    },
    "blockBackgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "borderRadius": {
      "$ref": "#/definitions/borderRadius"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "fontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "text",
    "alignment",
    "hideElement",
    "padding",
    "margins",
    "includeInOutput",
    "anchorLink",
    "backgroundColor",
    "fontFamily",
    "fontSize",
    "textStyle",
    "fitContainer",
    "blockBackgroundColor",
    "borderRadius",
    "border",
    "fontColor"
  ],
  "additionalProperties": false,
  "description": "Button block settings."
},
["__schema163"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema165"
    },
    {
      "$ref": "#/definitions/__schema168"
    }
  ]
},
["__schema164"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema165"
    },
    {
      "$ref": "#/definitions/__schema168"
    }
  ]
},
["__schema165"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema166"
    },
    "value": {
      "$ref": "#/definitions/__schema167"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false
},
["__schema166"]: {
  "type": "string",
  "enum": [
    "site",
    "anchor",
    "email",
    "phone",
    "sms",
    "telegram",
    "viber",
    "file",
    "other"
  ]
},
["__schema167"]: {
  "type": "string"
},
["__schema168"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema169"
    },
    "value": {
      "$ref": "#/definitions/__schema170"
    },
    "salesforce": {
      "$ref": "#/definitions/__schema171"
    }
  },
  "required": [
    "type",
    "value",
    "salesforce"
  ],
  "additionalProperties": false
},
["__schema169"]: {
  "type": "string",
  "const": "salesforce_mc"
},
["__schema170"]: {
  "type": "string"
},
["__schema171"]: {
  "type": "object",
  "properties": {
    "trackingAlias": {
      "$ref": "#/definitions/__schema172"
    },
    "linkTo": {
      "$ref": "#/definitions/__schema173"
    },
    "conversion": {
      "$ref": "#/definitions/__schema174"
    }
  },
  "required": [
    "trackingAlias",
    "linkTo",
    "conversion"
  ],
  "additionalProperties": false
},
["__schema172"]: {
  "type": "string",
  "maxLength": 100
},
["__schema173"]: {
  "type": "string"
},
["__schema174"]: {
  "type": "boolean"
},
["__schema175"]: {
  "type": "string"
},
["__schema176"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema104"
    },
    "mobile": {
      "$ref": "#/definitions/__schema104"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema177"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema178"
    },
    "alignment": {
      "$ref": "#/definitions/__schema179"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false
},
["__schema178"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 9007199254740991
},
["__schema179"]: {
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ]
},
["__schema180"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema181"
    },
    "width": {
      "$ref": "#/definitions/__schema182"
    },
    "align": {
      "$ref": "#/definitions/__schema183"
    },
    "indent": {
      "$ref": "#/definitions/__schema184"
    }
  },
  "required": [
    "src",
    "width",
    "align",
    "indent"
  ],
  "additionalProperties": false
},
["__schema181"]: {
  "type": "string",
  "minLength": 1
},
["__schema182"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 128
},
["__schema183"]: {
  "type": "string",
  "enum": [
    "left",
    "right"
  ]
},
["__schema184"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 400
},
["__schema185"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema186"
    },
    "mobile": {
      "$ref": "#/definitions/__schema186"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema186"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema187"
    },
    "right": {
      "$ref": "#/definitions/__schema187"
    },
    "bottom": {
      "$ref": "#/definitions/__schema187"
    },
    "left": {
      "$ref": "#/definitions/__schema187"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema187"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema188"]: {
  "type": "string",
  "maxLength": 150
},
["fontSize"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema189"
    },
    "mobile": {
      "$ref": "#/definitions/__schema190"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive font sizes for desktop and mobile."
},
["__schema189"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["__schema190"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["buttonsTextStyle"]: {
  "type": "object",
  "properties": {
    "bold": {
      "$ref": "#/definitions/__schema191"
    },
    "italic": {
      "$ref": "#/definitions/__schema192"
    }
  },
  "required": [
    "bold",
    "italic"
  ],
  "additionalProperties": false,
  "description": "Button text style settings."
},
["__schema191"]: {
  "type": "boolean"
},
["__schema192"]: {
  "type": "boolean"
},
["responsiveBoolean"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema193"
    },
    "mobile": {
      "$ref": "#/definitions/__schema194"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive boolean values for desktop and mobile."
},
["__schema193"]: {
  "type": "boolean"
},
["__schema194"]: {
  "type": "boolean"
},
["spacerBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema195"
    },
    "settings": {
      "$ref": "#/definitions/__schema196"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
  "description": "Spacer block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema195"]: {
  "type": "string",
  "const": "spacer"
}
};
