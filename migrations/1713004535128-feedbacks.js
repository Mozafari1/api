'use strict'

module.exports.up = function (pgm) {
  pgm.createTable('feedbacks', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    role: { type: 'text', nullable: true },
    feedback: { type: 'text', nullable: true },
    contact_id: { type: 'integer', notNull: true },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', notNull: true },
    is_deleted: { type: 'boolean', default: false },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    approved_at: { type: 'timestamp', nullable: true },
    is_approved: { type: 'boolean', default: false },
    is_waiting: { type: 'boolean', default: false },
    is_sent: { type: 'boolean', default: false },
    url: { type: 'text', nullable: true },
    is_active: { type: 'boolean', default: true },
  }
   );
}

module.exports.down = function (pgm) {
   pgm.dropTable('feedbacks');
}