/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.addColumn('comments', {
    is_deleted: {
      type: 'INTEGER',
      default: 0,
    },
  })
};

exports.down = pgm => {};
