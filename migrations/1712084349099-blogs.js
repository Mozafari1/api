'use strict'

module.exports.up = function (pgm) {
 pgm.createTable('blogs', {
        id: { type: 'serial', primaryKey: true },
        title: { type: 'varchar(255)', notNull: true },
        description: { type: 'text', notNull: true },
        sub_description: { type: 'text', nullable: true },
        sub_sub_description: { type: 'text', nullable: true },
        created_by: { type: 'integer', notNull: true },
        updated_by: { type: 'integer', notNull: true },
        is_deleted: { type: 'boolean', default: false },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });
}

module.exports.down = function (pgm) {
   pgm.dropTable('blogs');
}