// ==========================================
// CACHE KEYS
// ==========================================

const CACHE_KEYS = {

  PROFILE_REACTION: "REACTIONS_",

  PROFILE_INTEREST: "PROFILE_INTEREST_DATA",

  PROFILE_BRIDE: "PROFILE_BRIDE",

  PROFILE_GROOM: "PROFILE_GROOM",

  PROFILE_OTHER: "PROFILE_OTHER",

  HEADER_BRIDE: "HEADER_BRIDE",

  HEADER_GROOM: "HEADER_GROOM",

  HEADER_OTHER: "HEADER_OTHER",

  USER_PROFILE: "USER_PROFILE_",

  HEADER_INDEX_BRIDE: "HEADER_INDEX_BRIDE",

  HEADER_INDEX_GROOM: "HEADER_INDEX_GROOM",

  HEADER_INDEX_OTHER: "HEADER_INDEX_OTHER",

};


// ==========================================
// CACHE EXPIRY (SECONDS)
// ==========================================

const CACHE_TIME = {

  // 10 Minutes
  REACTION: 600,

  // 5 Minutes
  INTEREST: 300,

  // 30 Minutes
  PROFILE: 1800,

  // 6 Hours
  HEADER: 21600

};


// ==========================================
// GET SCRIPT CACHE
// ==========================================

function getScriptCache() {

  return CacheService.getScriptCache();

}


// ==========================================
// GET CACHE
// Returns Object OR null
// ==========================================

function getCache(key) {

  try {

    if (!key) {
      return null;
    }

    const cache = getScriptCache();

    const value = cache.get(key);

    if (!value) {

      console.log("CACHE MISS:", key);

      return null;
    }

    console.log("CACHE HIT:", key);

    return JSON.parse(value);

  } catch (error) {

    console.error("getCache Error:", error);

    return null;

  }

}


// ==========================================
// SET CACHE
// ==========================================

function setCache(
  key,
  value,
  expirySeconds
) {

  try {

    if (
      !key ||
      value === undefined
    ) {

      return false;

    }

    expirySeconds =
      Number(
        expirySeconds ||
        CACHE_TIME.PROFILE
      );

    const cache =
      getScriptCache();

    cache.put(

      key,

      JSON.stringify(value),

      expirySeconds

    );

    console.log(
      "CACHE SAVED:",
      key,
      "Expiry:",
      expirySeconds,
      "seconds"
    );

    return true;

  }

  catch (error) {

    console.error(
      "setCache Error:",
      error
    );

    return false;

  }

}


function clearUserProfileCache(mobile) {

  mobile = String(mobile || "")
    .replace(/\D/g, "")
    .slice(-10);

  if (!mobile) {
    return;
  }

  removeCache(
    CACHE_KEYS.USER_PROFILE + mobile
  );

}

// ==========================================
// REMOVE SINGLE CACHE
// ==========================================

function removeCache(key) {

  try {

    if (!key) {

      return false;

    }

    getScriptCache()
      .remove(key);

    return true;

  }

  catch (error) {

    console.error(
      "removeCache Error:",
      error
    );

    return false;

  }

}


// ==========================================
// REMOVE MULTIPLE CACHES
// ==========================================

function removeCaches(keys) {

  try {

    if (
      !Array.isArray(keys) ||
      keys.length === 0
    ) {

      return false;

    }

    const cache =
      getScriptCache();

    keys.forEach(
      function(key) {

        if (key) {

          cache.remove(key);

        }

      }
    );

    return true;

  }

  catch (error) {

    console.error(
      "removeCaches Error:",
      error
    );

    return false;

  }

}


// ==========================================
// CLEAR ALL KNOWN CACHE
// (Useful during development)
// ==========================================

function clearKnownCaches() {

  removeCaches([

    CACHE_KEYS.PROFILE_INTEREST,

    CACHE_KEYS.PROFILE_BRIDE,

    CACHE_KEYS.PROFILE_GROOM,

    CACHE_KEYS.PROFILE_OTHER,

    CACHE_KEYS.HEADER_BRIDE,

    CACHE_KEYS.HEADER_GROOM,

    CACHE_KEYS.HEADER_OTHER

  ]);

  console.log(
    "Known caches cleared."
  );

}


// ==========================================
// CLEAR USER REACTION CACHE
// ==========================================

function clearUserReactionCache(mobile) {

  mobile =
    String(mobile || "")
      .replace(/\D/g, "")
      .slice(-10);

  if (!mobile) {
    return;
  }

  removeCache(
    CACHE_KEYS.PROFILE_REACTION + mobile
  );

}


function clearProfileDataCaches() {

  removeCaches([

    CACHE_KEYS.PROFILE_BRIDE,

    CACHE_KEYS.PROFILE_GROOM,

    CACHE_KEYS.PROFILE_OTHER

  ]);

}

function clearHeaderCaches() {

removeCaches([
    CACHE_KEYS.HEADER_BRIDE,
    CACHE_KEYS.HEADER_GROOM,
    CACHE_KEYS.HEADER_OTHER,
    CACHE_KEYS.HEADER_INDEX_BRIDE,
    CACHE_KEYS.HEADER_INDEX_GROOM,
    CACHE_KEYS.HEADER_INDEX_OTHER
]);

}


// ==========================================
// CHECK CACHE EXISTS
// ==========================================

function cacheExists(key) {

  try {

    const cache =
      getScriptCache();

    return cache.get(key) !== null;

  }

  catch (error) {

    console.error(
      "cacheExists Error:",
      error
    );

    return false;

  }

}


// ==========================================
// GET CACHE SIZE INFO
// (Debug Only)
// ==========================================

function logCacheInfo(key) {

  try {

    const data =
      getCache(key);

    console.log({

      key: key,

      exists:
        data !== null,

      type:
        typeof data

    });

  }

  catch (error) {

    console.error(error);

  }

}


// ==========================================
// GET PROFILE SHEET DATA
// ==========================================

function getProfileSheetData(sheetName) {

  const sheet =
    SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(sheetName);

  if (!sheet) {

    return null;

  }

  return sheet
    .getDataRange()
    .getDisplayValues();

}


// ==========================================
// GET PROFILE HEADERS
// ==========================================

function getProfileHeaders(sheetName) {

  let cacheKey = "";

  switch (sheetName) {

    case "वधू":
      cacheKey = CACHE_KEYS.HEADER_BRIDE;
      break;

    case "वर":
      cacheKey = CACHE_KEYS.HEADER_GROOM;
      break;

    case "इतर":
      cacheKey = CACHE_KEYS.HEADER_OTHER;
      break;

    default:
      return null;

  }

  let headers = getCache(cacheKey);

  if (headers) {

    return headers;

  }

  const data =
    getProfileSheetData(sheetName);

  if (!data || data.length === 0) {

    return null;

  }

  headers =
    data[0].map(function(header) {

      return normalizeHeader(header);

    });

  setCache(

    cacheKey,

    headers,

    CACHE_TIME.HEADER

  );

  return headers;

}

// ==========================================
// GET PROFILE HEADER INDEXES
// ==========================================

function getProfileHeaderIndexes(sheetName) {

  let cacheKey = "";

  switch (sheetName) {

    case "वधू":
      cacheKey = CACHE_KEYS.HEADER_INDEX_BRIDE;
      break;

    case "वर":
      cacheKey = CACHE_KEYS.HEADER_INDEX_GROOM;
      break;

    case "इतर":
      cacheKey = CACHE_KEYS.HEADER_INDEX_OTHER;
      break;

    default:
      return null;

  }

  let indexes = getCache(cacheKey);

  if (indexes) {

    return indexes;

  }

  const headers =
      getProfileHeaders(sheetName);

  if (!headers) {

    return null;

  }

  indexes = {

    idIndex:
      findProfileHeader(headers, "ID"),

    nameIndex:
      findProfileHeader(headers, "नाव :"),

    mobile1Index:
      findProfileHeader(headers, "संपर्क क्रमांक १ :"),

    mobile2Index:
      findProfileHeader(headers, "संपर्क क्रमांक २ :")

  };

  setCache(

      cacheKey,

      indexes,

      CACHE_TIME.HEADER

  );

  return indexes;

}