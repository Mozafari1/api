/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE testd (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE testd;
    `);
};
