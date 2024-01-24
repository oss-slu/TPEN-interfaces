import Project from "./project"

describe("Project", () => {
    it("should create a project with a this config", () => {
        const project = new Project({
            name: "Test Project",
            email: "test@example.com",
        })
        expect(project.data.name).toBe("Test Project")
        expect(project.data.email).toBe("test@example.com")
    })

    it("should find a project with this id", () => {
        const project = new Project("someHash")
        expect(project.data.id).toBe("someHash")
    })
})
