'use strict'

module.exports.up = function (next) {
  next.createTable('inboxes', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    message: { type: 'text', nullable: true },
    is_deleted: { type: 'boolean', default: false },
    created_from_ip: { type: 'varchar(255)', nullable: true },
    is_responded: { type: 'boolean', default: false },
    phone_number: { type: 'varchar(255)', nullable: true },
    service_type: { type: 'varchar(255)', nullable: true },
    is_customer: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },

  });
}
module.exports.down = function (next) {
  next.dropTable('inboxes');
}
