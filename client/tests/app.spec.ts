import { test as base, expect } from '@playwright/test';

// Generate unique email for each test run
const generateTestEmail = () => `test${Date.now()}@example.com`;

// Extend base test with authenticated context
const test = base.extend({
  authenticatedPage: async ({ page, context }, use) => {
    const email = generateTestEmail();
    const password = 'password123';

    // Signup
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.fill('[data-testid="confirm-password-input"]', password);
    await page.click('[data-testid="signup-submit"]');

    // Wait for redirect to login
    await page.waitForURL('/login', { timeout: 15000 });
    await page.waitForLoadState('networkidle');

    // Login
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);

    // Click login and wait for navigation
    await page.click('[data-testid="login-submit"]');

    // Wait for token to be set
    await page.waitForFunction(() => localStorage.getItem('token') !== null, { timeout: 15000 });

    // Navigate to tasks page
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');

    // Give extra time for React to render
    await page.waitForTimeout(2000);

    // Wait for task form to appear
    const taskForm = page.locator('[data-testid="task-form"]');
    await expect(taskForm).toBeVisible({ timeout: 15000 });

    await use(page);
  },
});

test.describe('TaskAlly E2E Tests', () => {

  test('Homepage shows welcome message', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Welcome to TaskAlly')).toBeVisible({ timeout: 10000 });
  });

  test('Homepage shows Login and Signup buttons when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('[data-testid="login-btn"]')).toBeVisible();
    await expect(page.locator('[data-testid="signup-btn"]')).toBeVisible();
  });

  test('Signup validation - passwords must match', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', 'test@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'differentpassword');
    await page.click('[data-testid="signup-submit"]');

    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/signup/);
  });

  test('Signup a new user successfully', async ({ page }) => {
    const uniqueEmail = generateTestEmail();

    await page.goto('/signup');
    await page.waitForLoadState('networkidle');

    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', uniqueEmail);
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.fill('[data-testid="confirm-password-input"]', 'password123');
    await page.click('[data-testid="signup-submit"]');

    await page.waitForURL('/login', { timeout: 15000 });
    await expect(page.locator('[data-testid="login-submit"]')).toBeVisible();
  });

  test('Login with valid credentials and redirect to home', async ({ page }) => {
    const email = generateTestEmail();
    const password = 'password123';

    // Signup first
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.fill('[data-testid="confirm-password-input"]', password);
    await page.click('[data-testid="signup-submit"]');
    await page.waitForURL('/login', { timeout: 15000 });

    // Login
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.click('[data-testid="login-submit"]');

    // Wait for token to be stored
    await page.waitForFunction(() => localStorage.getItem('token') !== null, { timeout: 15000 });

    // Navigate to tasks
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.locator('[data-testid="task-form"]')).toBeVisible({ timeout: 15000 });
  });

  test('Authenticated user sees "Go to Tasks" button on homepage', async ({ page }) => {
    const email = generateTestEmail();
    const password = 'password123';

    // Signup and login
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="name-input"]', 'Test User');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.fill('[data-testid="confirm-password-input"]', password);
    await page.click('[data-testid="signup-submit"]');
    await page.waitForURL('/login', { timeout: 15000 });

    await page.waitForLoadState('networkidle');
    await page.fill('[data-testid="email-input"]', email);
    await page.fill('[data-testid="password-input"]', password);
    await page.click('[data-testid="login-submit"]');

    await page.waitForFunction(() => localStorage.getItem('token') !== null, { timeout: 15000 });

    // Go to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('button:has-text("Go to Tasks")')).toBeVisible();
  });

  test('Add a task', async ({ authenticatedPage: page }) => {
    const taskTitle = 'Test Task ' + Date.now();

    await page.fill('[data-testid="task-input"]', taskTitle);
    await page.click('[data-testid="task-add-btn"]');

    await expect(page.locator(`text=${taskTitle}`).first()).toBeVisible({ timeout: 15000 });
  });

  test('Add multiple tasks', async ({ authenticatedPage: page }) => {
    const tasks = ['Task One', 'Task Two', 'Task Three'];

    for (const task of tasks) {
      await page.fill('[data-testid="task-input"]', task);
      await page.click('[data-testid="task-add-btn"]');
      await page.waitForTimeout(1500);
    }

    // Verify all tasks
    for (const task of tasks) {
      await expect(page.locator(`text=${task}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Toggle task completion', async ({ authenticatedPage: page }) => {
    const taskTitle = 'Task to Complete ' + Date.now();

    await page.fill('[data-testid="task-input"]', taskTitle);
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(1500);

    const taskText = page.locator(`text=${taskTitle}`).first();
    await taskText.click();
    await page.waitForTimeout(2000);

    const taskContainer = taskText.locator('xpath=ancestor::div[@data-testid]');
    await expect(taskContainer).toHaveClass(/bg-emerald-700/, { timeout: 10000 });
  });

  test('Edit a task', async ({ authenticatedPage: page }) => {
    const originalTitle = 'Original Task ' + Date.now();
    const updatedTitle = 'Updated Task ' + Date.now();

    await page.fill('[data-testid="task-input"]', originalTitle);
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(1500);

    const taskContainer = page.locator(`text=${originalTitle}`).locator('xpath=ancestor::div[@data-testid]');
    const taskIdAttr = await taskContainer.getAttribute('data-testid');
    const taskId = taskIdAttr?.replace('task-', '') || '';

    await page.click(`[data-testid="task-edit-btn-${taskId}"]`);
    await page.waitForTimeout(500);

    const editInput = page.locator(`[data-testid="task-edit-input-${taskId}"]`);
    await editInput.fill(updatedTitle);
    await page.click(`[data-testid="task-edit-btn-${taskId}"]`);

    await page.waitForTimeout(2000);
    await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('Delete a task', async ({ authenticatedPage: page }) => {
    const taskTitle = 'Task to Delete ' + Date.now();

    await page.fill('[data-testid="task-input"]', taskTitle);
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(1500);

    const taskContainer = page.locator(`text=${taskTitle}`).locator('xpath=ancestor::div[@data-testid]');
    const taskIdAttr = await taskContainer.getAttribute('data-testid');
    const taskId = taskIdAttr?.replace('task-', '') || '';

    await page.click(`[data-testid="task-delete-btn-${taskId}"]`);
    await page.waitForTimeout(2000);

    await expect(page.locator(`text=${taskTitle}`)).toHaveCount(0);
  });

  test('Cannot edit or delete completed task', async ({ authenticatedPage: page }) => {
    const taskTitle = 'Completed Task ' + Date.now();

    await page.fill('[data-testid="task-input"]', taskTitle);
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(1500);

    const taskText = page.locator(`text=${taskTitle}`).first();
    await taskText.click();
    await page.waitForTimeout(2000);

    const taskContainer = taskText.locator('xpath=ancestor::div[@data-testid]');
    const taskIdAttr = await taskContainer.getAttribute('data-testid');
    const taskId = taskIdAttr?.replace('task-', '') || '';

    const editBtn = page.locator(`[data-testid="task-edit-btn-${taskId}"]`);
    const deleteBtn = page.locator(`[data-testid="task-delete-btn-${taskId}"]`);

    await expect(editBtn).toBeDisabled();
    await expect(deleteBtn).toBeDisabled();
  });

  test('Clear all tasks', async ({ authenticatedPage: page }) => {
    const tasks = ['Clear Task 1', 'Clear Task 2', 'Clear Task 3'];

    for (const task of tasks) {
      await page.fill('[data-testid="task-input"]', task);
      await page.click('[data-testid="task-add-btn"]');
      await page.waitForTimeout(1000);
    }

    await page.click('[data-testid="task-clear-btn"]');
    await page.waitForTimeout(3000);

    for (const task of tasks) {
      await expect(page.locator(`text=${task}`)).toHaveCount(0);
    }
  });

  test('Task input validation - empty task', async ({ authenticatedPage: page }) => {
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(1000);

    await expect(page.locator('[data-testid="task-form"]')).toBeVisible();
  });

  test('Task persists after page reload', async ({ authenticatedPage: page }) => {
    const taskTitle = 'Persistent Task ' + Date.now();

    await page.fill('[data-testid="task-input"]', taskTitle);
    await page.click('[data-testid="task-add-btn"]');
    await page.waitForTimeout(2000);

    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await expect(page.locator(`text=${taskTitle}`).first()).toBeVisible({ timeout: 15000 });
  });

  test('Protected route redirects to login when not authenticated', async ({ page }) => {
    // Clear any existing tokens
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Try to access tasks page
    await page.goto('/tasks');
    await page.waitForLoadState('networkidle');

    // Should redirect to login or show login page
    await expect(page).toHaveURL(/\/login/);
  });

});

export { test, expect };