/**
 * normalizers.js
 * normalizer schemas
 */

import { normalize, Schema, arrayOf } from 'normalizr';


const normalizeSchemas = {
  entry: new Schema('entries'),
  standup: new Schema('standups'),
  user: new Schema('users'),
  standupTitles: new Schema('standupTitles'),
};

normalizeSchemas.standup.define({
  Entries: arrayOf(normalizeSchemas.entry),
});

normalizeSchemas.entry.define({
  User: normalizeSchemas.user,
});

export default normalizeSchemas;
