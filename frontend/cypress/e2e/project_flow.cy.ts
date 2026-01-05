describe('Project Flow', () => {
    beforeEach(() => {
        // Seed user
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/auth/register',
            failOnStatusCode: false,
            body: {
                email: 'manager@test.com',
                name: 'Manager',
                password: 'password123', // Set manual password
                role: 'MANAGER'
            }
        });

        // Login before project tests
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('manager@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.contains('button', 'Log in').click();
        cy.url().should('include', '/');
    });

    it('should create a new project', () => {
        // Navigate to create project via Sidebar
        cy.contains('Create Project').click();

        const projectName = `Project ${Date.now()}`;

        // Modal selectors
        cy.get('input[name="projectName"]').type(projectName);
        cy.get('textarea[name="description"]').type('Cypress Test Project');
        cy.get('input[name="budget"]').type('5000');

        cy.contains('button', 'Create project').click(); // Exact text match

        // Verify presence in list - Wait for reload or list update
        cy.contains(projectName).should('be.visible');
    });
});
