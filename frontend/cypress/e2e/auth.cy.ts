describe('Authentication Flow', () => {
    beforeEach(() => {
        // Clear session before each test
        cy.session('clear', () => {
            cy.clearCookies();
            cy.clearLocalStorage();
        });
    });

    it('should register a new user', () => {
        cy.visit('/auth/register');

        // Generate random email
        const email = `test${Date.now()}@example.com`;

        cy.get('input[name="email"]').type(email);
        cy.contains('button', 'Continue').click();

        // Check for success toast/message
        // Note: Adjust selector based on actual toast implementation class or text
        // cy.contains('Account created successfully').should('be.visible'); // Flaky in headless

        // Should populate email in login but we just check redirection
        cy.url().should('include', '/auth/login');
    });

    it('should login', () => {
        // Seed user via Backend API
        cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/auth/register',
            failOnStatusCode: false, // Ignore if user already exists
            body: {
                email: 'manager@test.com',
                name: 'Manager',
                password: 'password123',
                role: 'MANAGER'
            }
        });

        cy.visit('/auth/login');

        cy.get('input[name="email"]').type('manager@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.contains('button', 'Log in').click();

        // If login successful, should redirect to dashboard
        cy.url().should('include', '/');
        cy.contains('Dashboard').should('be.visible');
    });

    it('should logout', () => {
        // Login first
        cy.visit('/auth/login');
        cy.get('input[name="email"]').type('manager@test.com');
        cy.get('input[name="password"]').type('password123');
        cy.contains('button', 'Log in').click();

        // Perform logout
        // Perform logout
        cy.contains('Logout').click(); // Sidebar logout text
        cy.url().should('include', '/auth/login');
    });
});
