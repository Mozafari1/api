'use strict'

module.exports.up = function (next) {
  next.createTable('contacts', {
    id: { type: 'serial', primaryKey: true },
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    phone_number: { type: 'varchar(20)' , nullable: true },
    address: { type: 'varchar(255)' , nullable: true },
    date_of_birth: { type: 'date' , nullable: true },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    created_at: { type: 'timestamp', default: next.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: next.func('current_timestamp') },
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', nullable: true },
    is_company: { type: 'boolean', notNull: true, default: false },
    company_name: { type: 'varchar(255)', nullable: true },
    company_address: { type: 'varchar(255)', nullable: true },
    company_phone_number: { type: 'varchar(20)', nullable: true },
    company_email: { type: 'varchar(255)', nullable: true },
    company_website: { type: 'varchar(255)', nullable: true },
    company_logo: { type: 'varchar(255)', nullable: true },
    company_description: { type: 'text', nullable: true },
    renewal_date: { type: 'date', nullable: true },
  });
}

module.exports.down = function (next) {
  next.dropTable('contacts');
}
