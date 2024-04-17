'use strict'


module.exports.up = async function (pgm) {
  await pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    first_name: { type: 'varchar(100)', notNull: true },
    last_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    active: { type: 'boolean', notNull: true, default: true },
    is_deleted: { type: 'boolean', notNull: true, default: false },
    activation_token: { type: 'varchar(255)' },
    activation_token_expires: { type: 'timestamp' },
    failed_login_attempts: { type: 'integer', notNull: true, default: 0 },
    phone_number: { type: 'varchar(20)' }, // Telefonnummer (valgfritt)
    address: { type: 'varchar(255)' }, // Adresse (valgfritt)
    city: { type: 'varchar(255)' }, // By (valgfritt)
    postal_code: { type: 'varchar(10)' }, // Postnummer (valgfritt)
    date_of_birth: { type: 'date' }, // Fødselsdato (valgfritt)
    gender: { type: 'varchar(10)' }, // Kjønn (valgfritt)
    role: { type: 'varchar(20)' }, // Rolle (valgfritt)
    language_preferences: { type: 'varchar(50)' }, // Språkpreferanser (valgfritt)
    code: { type: 'varchar(10)' }, // Bekreftelseskode
    last_seen: { type: 'timestamp' }, // Sist sett
    created_by: { type: 'integer', notNull: true },
    updated_by: { type: 'integer', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    updated_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
    ip_address: { type: 'varchar(50)' }, // IP-adresse
    requested_password_reset: { type: 'boolean', notNull: true, default: false }, // Nytt passord forespurt
    password_reset_token: { type: 'varchar(255)' }, // Nytt passord token
    password_reset_token_expires: { type: 'timestamp' }, // Nytt passord token utløper

  });
};


module.exports.down = async function (pgm) {
  await pgm.dropTable('users');
};
