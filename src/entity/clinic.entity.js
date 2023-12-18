// import { EntitySchema } from "typeorm";
const typeorm = require('typeorm');

const Clinic = new typeorm.EntitySchema({
    name: 'Clinic',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false,
        },
        address: {
            type: 'text',
            nullable: false,
        }
    },
    relations: {
        timeSlots: {
            target: 'TimeSlot',
            type: 'one-to-many',
        }
    }
})

module.exports = Clinic;