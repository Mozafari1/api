'use strict'

module.exports.up = function (next) {
  next.createTable('projects', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    domain_name: { type: 'varchar(255)', null: true },
    status: { type: 'varchar(255)', nullable: true },
    service_type: { type: 'varchar(255)', nullable: true },
    is_deleted: { type: 'boolean', default: false },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
    contact_id: { type: 'integer', nullable: true },
    
  });
}

module.exports.down = function (next) {
  next.dropTable('projects');
}
