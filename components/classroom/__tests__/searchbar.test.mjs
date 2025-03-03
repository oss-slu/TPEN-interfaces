jest.resetModules(); // Clear module cache before each test

jest.mock("../../../api/events.mjs", () => ({
    eventDispatcher: {
        on: jest.fn(),
    },
})); //mocking before importing

import ProjectsList from "../../projects-list/index.mjs";
import {eventDispatcher} from "../../../api/events.mjs";

global.HTMLElement = class {}; // Mock HTMLElement

describe('ProjectsList Constructor', () => {
    it('should call eventDispatcher.on when instantiated', () => {
        const instance = new ProjectsList();
        expect(eventDispatcher.on).toHaveBeenCalledWith("tpen-user-loaded", expect.any(Function));
    });
});

//add more comprehensive tests here