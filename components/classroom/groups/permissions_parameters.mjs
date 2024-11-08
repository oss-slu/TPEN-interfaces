const Action = {
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
    CREATE:'CREATE',
    ALL:'ALL'
};

const Scope = {
    METADATA: 'METADATA',
    TEXT: 'TEXT',
    ORDER: 'ORDER',
    SELECTOR: 'SELECTOR',
    DESCRIPTION: 'DESCRIPTION',
    ALL: 'ALL'
};

const Entity = {
    PROJECT: 'PROJECT',
    MEMBER: 'MEMBER',
    LAYER: 'LAYER',
    PAGE: 'PAGE',
    LINE: 'LINE',
    ROLE: 'ROLE',
    PERMISSION: 'PERMISSION',
    ALL: 'ALL'
};

module.exports = {
    Action,
    Scope,
    Entity
};