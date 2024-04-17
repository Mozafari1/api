'use strict'

module.exports.up = function (next) {
  next.createTable('services', {
    id: { type: 'serial', primaryKey: true },
    title: { type: 'varchar(255)', notNull: true },
    less_content: { type: 'text', nullable: true },
    main_content: { type: 'text', nullable: true },
    sub_title: { type: 'varchar(255)', nullable: true },
    sub_content: { type: 'text', nullable: true },
    sub_points_title: { type: 'varchar(255)', nullable: true },
    sub_point_titleA: { type: 'varchar(255)', nullable: true },
    sub_point_contentA: { type: 'text', nullable: true },
    sub_point_titleB: { type: 'varchar(255)', nullable: true },
    sub_point_contentB: { type: 'text', nullable: true },
    sub_point_titleC: { type: 'varchar(255)', nullable: true },
    sub_point_contentC: { type: 'text', nullable: true },
    sub_point_titleD: { type: 'varchar(255)', nullable: true },
    sub_point_contentD: { type: 'text', nullable: true },
    sub_point_titleE: { type: 'varchar(255)', nullable: true },
    sub_point_contentE: { type: 'text', nullable: true },
    summary_title: { type: 'varchar(255)', nullable: true },
    summary_main_content: { type: 'text', nullable: true },
    summary_sub_content: { type: 'text', nullable: true },
    summary_sub_sub_content: { type: 'text', nullable: true },
    is_deleted: { type: 'boolean', default: false },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },

  });
}

module.exports.down = function (next) {
  next.dropTable('services');
}
