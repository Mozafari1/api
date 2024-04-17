'use strict'

module.exports.up = function (next) {
  next.createTable('prices', {
    id: { type: 'serial', primaryKey: true },
    package_name: { type: 'varchar(255)', notNull: true },
    title: { type: 'varchar(255)', notNull: true },
    price: { type: 'integer', notNull: true },
    description: { type: 'text', nullable: true },
    pointA: { type: 'varchar(255)', nullable: true },
    pointB: { type: 'varchar(255)', nullable: true },
    pointC: { type: 'varchar(255)', nullable: true },
    pointD: { type: 'varchar(255)', nullable: true },
    pointE: { type: 'varchar(255)', nullable: true },
    pointF: { type: 'varchar(255)', nullable: true },

    is_deleted: { type: 'boolean', default: false },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
    
  });
}

module.exports.down = function (next) {
  next.dropTable('prices');
}
