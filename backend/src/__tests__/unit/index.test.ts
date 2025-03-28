import {
  jest,
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "@jest/globals";
import app from "../../index";
import { Server } from "http";

// Import the startServer function directly
import { startServer } from "../../index";

// Mock console.log to prevent actual logging during tests
const originalConsoleLog = console.log;
const mockConsoleLog = jest.fn();

beforeAll(() => {
  console.log = mockConsoleLog;
});

afterAll(() => {
  console.log = originalConsoleLog;
});

describe("Sk8Meet API", () => {
  // Test error handling middleware
  describe("Error Handling Middleware", () => {
    it("should handle errors with appropriate status and message", () => {
      // Mock error object
      const mockError = {
        status: 404,
        message: "Not Found",
        stack: "Mock error stack",
      };

      // Spy on console.error to prevent actual logging during test
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create a mock request and response
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockNext = jest.fn();

      // Find the error handling middleware (last middleware in the app)
      const errorMiddleware =
        app._router.stack[app._router.stack.length - 1].handle;

      // Call error middleware
      errorMiddleware(mockError, mockReq, mockRes, mockNext);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: "Not Found",
          status: 404,
        },
      });

      // Verify console.error was called with the error stack
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError.stack);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it("should handle errors with default 500 status when no status is provided", () => {
      // Mock error object without a specific status
      const mockError = {
        message: "Internal Server Error",
        stack: "Mock error stack",
      };

      // Spy on console.error to prevent actual logging during test
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      // Create a mock request and response
      const mockReq = {} as any;
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;
      const mockNext = jest.fn();

      // Find the error handling middleware (last middleware in the app)
      const errorMiddleware =
        app._router.stack[app._router.stack.length - 1].handle;

      // Call error middleware
      errorMiddleware(mockError, mockReq, mockRes, mockNext);

      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: {
          message: "Internal Server Error",
          status: 500,
        },
      });

      // Verify console.error was called with the error stack
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError.stack);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // Server Startup Tests
  describe("Server Startup", () => {
    let originalNodeEnv: string | undefined;
    let originalListen: typeof app.listen;
    let mockListen: jest.Mock<(port: number, callback?: () => void) => Server>;

    beforeEach(() => {
      // Store original environment and listen method
      originalNodeEnv = process.env.NODE_ENV;
      originalListen = app.listen;

      // Create a mock for app.listen
      mockListen = jest.fn((port: number, callback?: () => void) => {
        if (callback) callback!();
        return {} as Server;
      });
      app.listen = mockListen as any;

      // Reset console.log mock
      mockConsoleLog.mockClear();
    });

    afterEach(() => {
      // Restore original environment and listen method
      process.env.NODE_ENV = originalNodeEnv;
      app.listen = originalListen;
    });

    it("should start server when NODE_ENV is not 'test'", () => {
      // Set NODE_ENV to development
      process.env.NODE_ENV = "development";

      // Call startServer directly
      startServer();

      // Verify listen was called
      expect(mockListen).toHaveBeenCalled();

      // Verify console logs were called
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining("Server running on port")
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining("Health check:")
      );
    });

    it("should not start server when NODE_ENV is 'test'", () => {
      // Set NODE_ENV to test
      process.env.NODE_ENV = "test";

      // Spy on app.listen to ensure it's not called
      const listenSpy = jest.spyOn(app, "listen");

      // Call startServer directly
      startServer();

      // Verify listen was not called
      expect(listenSpy).not.toHaveBeenCalled();

      // Verify no console logs were made
      expect(mockConsoleLog).not.toHaveBeenCalled();

      // Restore the spy
      listenSpy.mockRestore();
    });
  });
});
