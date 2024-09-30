const Roles = require('./roles');
const { Action, Scope, Entity } = require('./permissions_parameters');

describe('Roles',()=>{
    test('properties are defined correctly', () =>{
        expect(Roles).toHaveProperty('OWNER', 'OWNER');
        expect(Roles).toHaveProperty('LEADER', 'LEADER');
        expect(Roles).toHaveProperty('CONTRIBUTOR', 'CONTRIBUTOR');
    });
});

describe('Action',()=>{
    test('properties are defined correctly', () =>{
        expect(Action).toHaveProperty('READ', 'READ');
        expect(Action).toHaveProperty('UPDATE', 'UPDATE');
        expect(Action).toHaveProperty('DELETE', 'DELETE');
        expect(Action).toHaveProperty('CREATE', 'CREATE');
        expect(Action).toHaveProperty('ALL', 'ALL');
    });
});

describe('Scope',()=>{
    test('properties are defined correctly', () =>{
        expect(Scope).toHaveProperty('METADATA', 'METADATA');
        expect(Scope).toHaveProperty('TEXT', 'TEXT');
        expect(Scope).toHaveProperty('ORDER', 'ORDER');
        expect(Scope).toHaveProperty('SELECTOR', 'SELECTOR');
        expect(Scope).toHaveProperty('DESCRIPTION', 'DESCRIPTION');
        expect(Scope).toHaveProperty('ALL', 'ALL');
    });
});

describe('Entity',()=>{
    test('properties are defined correctly', () =>{
        expect(Entity).toHaveProperty('PROJECT', 'PROJECT');
        expect(Entity).toHaveProperty('MEMBER', 'MEMBER');
        expect(Entity).toHaveProperty('LAYER', 'LAYER');
        expect(Entity).toHaveProperty('PAGE', 'PAGE');
        expect(Entity).toHaveProperty('LINE', 'LINE');
        expect(Entity).toHaveProperty('ROLE', 'ROLE');
        expect(Entity).toHaveProperty('PERMISSION', 'PERMISSION');
        expect(Entity).toHaveProperty('ALL', 'ALL');
    });
});