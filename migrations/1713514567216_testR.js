/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE testR (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE testR;
    `);
};
