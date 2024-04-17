'use strict';

module.exports.up = function (next) {
  next.createTable('files', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(255)', notNull: true },
    file_name: { type: 'varchar(255)', notNull: true },
    size: { type: 'integer', notNull: true },
    type: { type: 'varchar(255)', notNull: true },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    is_deleted: { type: 'boolean', default: false },
    contact_id: { type: 'integer', nullable: true },
    project_id: { type: 'integer', nullable: true },
    service_id: { type: 'integer', nullable: true },
    price_id: { type: 'integer', nullable: true },
    blog_id: { type: 'integer', nullable: true },
    user_id: { type: 'integer', nullable: true },
    connection_type_id: { type: 'integer', nullable: true },
    special_type: { type: 'varchar(255)', nullable: true },
    is_invoice: { type: 'boolean', default: false },
    is_report: { type: 'boolean', default: false },
    is_contract: { type: 'boolean', default: false },
    is_invoice_sent: { type: 'boolean', default: false },
    is_report_sent: { type: 'boolean', default: false },
    is_contract_sent: { type: 'boolean', default: false },
    is_invoice_paid: { type: 'boolean', default: false },
    is_contract_signed: { type: 'boolean', default: false },
    is_offer: { type: 'boolean', default: false },
    is_offer_sent: { type: 'boolean', default: false },
    is_offer_accepted: { type: 'boolean', default: false },
    is_offer_declined: { type: 'boolean', default: false },
    

  });
}

module.exports.down = function (next) {
  next.dropTable('files');
}
