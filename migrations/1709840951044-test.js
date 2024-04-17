'use strict';

module.exports.up = function (pgm) {
  pgm.createTable('testtb', {
    id: { type: 'serial', primaryKey: true },
    username: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

module.exports.down = function (pgm) {
  pgm.dropTable('testtb');
};
