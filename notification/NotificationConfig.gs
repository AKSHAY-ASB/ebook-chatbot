/**
 * ============================================================
 * NOTIFICATION MODULE
 * File: NotificationConfig.gs
 * Purpose: Central configuration/constants
 * ============================================================
 */

const NOTIFICATION_CONFIG = Object.freeze({

  // Notification sheet
  SHEET_NAME: 'Notifications',

  // Read status
  READ_STATUS: Object.freeze({
    UNREAD: 'NO',
    READ: 'YES'
  }),

  // Notification row status
  STATUS: Object.freeze({
    ACTIVE: 'ACTIVE',
    DELETED: 'DELETED'
  }),

  // Supported notification events
  EVENT_TYPE: Object.freeze({
    LIKE: 'LIKE',
    DISLIKE: 'DISLIKE',
    INTEREST_SENT: 'INTEREST_SENT',
    INTEREST_ACCEPTED: 'INTEREST_ACCEPTED',
    INTEREST_DECLINED: 'INTEREST_DECLINED',
    MUTUAL_MATCH: 'MUTUAL_MATCH'
  }),

  // Source identifiers
  SOURCE: Object.freeze({
    PROFILE_REACTION: 'ProfileReaction',
    PROFILE_INTEREST: 'ProfileInterest',
    INTEREST_RESPONSE: 'InterestResponse',
    MATCHING: 'Matching'
  }),

  // Notification sheet columns
  COLUMNS: Object.freeze({
    CREATED_AT: 1,
    NOTIFICATION_ID: 2,
    RECIPIENT_MOBILE: 3,
    RECIPIENT_NAME: 4,
    RECIPIENT_TYPE: 5,
    RECIPIENT_PROFILE_ID: 6,
    ACTOR_MOBILE: 7,
    ACTOR_NAME: 8,
    ACTOR_TYPE: 9,
    ACTOR_PROFILE_ID: 10,
    EVENT_TYPE: 11,
    REFERENCE_ID: 12,
    TARGET_TYPE: 13,
    TARGET_PROFILE_ID: 14,
    TARGET_NAME: 15,
    TITLE: 16,
    MESSAGE: 17,
    IS_READ: 18,
    READ_AT: 19,
    SOURCE: 20,
    EVENT_KEY: 21,
    STATUS: 22
  }),

  // Sheet header row
  HEADER_ROW: 1,

  // Maximum notifications returned by one read request
  DEFAULT_LIMIT: 50,

  // Maximum allowed notification read limit
  MAX_LIMIT: 100
});