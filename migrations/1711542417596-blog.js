'use strict'

module.exports.up = function (pgm) {
 pgm.createTable('blogs', {
        id: { type: 'serial', primaryKey: true },
        title: { type: 'varchar(255)', notNull: true },
        description: { type: 'text', notNull: true },
        sub_description: { type: 'text', nullable: true },
        sub_sub_description: { type: 'text', nullable: true },
        user_id: { type: 'integer', notNull: true },
        is_deleted: { type: 'boolean', default: false },
        file_path: { type: 'varchar(255)' },
        file_name: { type: 'varchar(255)' },
        size: { type: 'integer' },
        created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
        updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
    });
}

module.exports.down = function (pgm) {
   pgm.dropTable('blogs');
}
