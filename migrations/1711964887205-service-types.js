'use strict'

module.exports.up = function (next) {
 next.createTable('service-types', {
    id: { type: 'serial', primaryKey: true },
    value: { type: 'varchar(255)', notNull: true },
    label: { type: 'varchar(255)', notNull: true },
    is_deleted: { type: 'boolean', default: false },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
    
  });
}

module.exports.down = function (next) {
  next.dropTable('service-types');
}
