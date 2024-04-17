'use strict';

module.exports.up = function (pgm) {
  pgm.addColumn('testtb', {
    byen: {
      type: 'varchar(100)',
      notNull: true
    }
  });
};

module.exports.down = function (pgm) {
  pgm.dropColumn('testtb', 'byen');
};
