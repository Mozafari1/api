'use strict'

module.exports.up = function (next) {
  next.createTable('connections_type', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    is_deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
  })
}

module.exports.down = function (next) {
  next(dropTable('connections_type'))
}
