const sinon = require('sinon');

// Setup Sinon for Jest
beforeEach(() => {
  // Create a sandbox for each test to isolate stubs, spies, and mocks
  global.sinonSandbox = sinon.createSandbox();
});

afterEach(() => {
  // Restore the sandbox after each test
  global.sinonSandbox.restore();
});