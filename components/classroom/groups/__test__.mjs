const Roles = require('./roles');
const { Action, Scope, Entity } = require('./permissions_parameters');


const testProperties = (obj, properties) => {
    properties.forEach(prop => {
        expect(obj).toHaveProperty(prop, prop);
    });
};

roleProperties = ['OWNER','LEADER','CONTRIBUTOR'];
actionProperties = ['READ','UPDATE','DELETE','CREATE','ALL']
scopeProperties = ['METADATA','TEXT','ORDER','SELECTOR','DESCRIPTION','ALL']
entityProperties = ['PROJECT','MEMBER','LAYER','PAGE','LINE','ROLE','PERMISSION','ALL']

describe('Roles',()=>{
    test('properties are defined correctly', () =>{
        testProperties(Roles,roleProperties);
    });
});

describe('Action',()=>{
    test('properties are defined correctly', () =>{
        testProperties(Action,actionProperties);
    });
});

describe('Scope',()=>{
    test('properties are defined correctly', () =>{
        testProperties(Scope,scopeProperties);
    });
});

describe('Entity',()=>{
    test('properties are defined correctly', () =>{
        testProperties(Entity,entityProperties);
    });
});