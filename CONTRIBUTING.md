# Contributing to Sk8Meet

Thank you for your interest in contributing to Sk8Meet! This guide outlines the process for contributing and our workflow practices.

## Development Workflow

1. **Fork the repository** to your GitHub account

   ```bash
   # Navigate to https://github.com/sk8meet/sk8meet in your browser
   # Click the "Fork" button in the top-right corner
   ```

2. **Clone your fork** locally and set up the upstream remote

   ```bash
   # Clone your fork
   git clone https://github.com/YOUR-USERNAME/sk8meet.git
   cd sk8meet

   # Add the original repository as upstream
   git remote add upstream https://github.com/sk8meet/sk8meet.git

   # Verify remotes
   git remote -v
   ```

3. **Create a feature branch** from the main branch

   ```bash
   # Ensure you're on the main branch
   git checkout main

   # Pull the latest changes from upstream
   git pull upstream main

   # Create a new feature branch with a descriptive name
   git checkout -b feature/add-new-feature
   ```

4. **Make your changes** following our code style

   ```bash
   # Make your code changes
   # ...

   # Stage your changes
   git add .

   # Commit your changes with a descriptive message
   git commit -m "feat: Add new feature"

   # Push your branch to your fork
   git push origin feature/add-new-feature
   ```

5. **Submit a pull request** for review

   ```bash
   # Navigate to your fork on GitHub
   # Click "Compare & pull request" for your branch
   # Fill out the PR template with details about your changes
   # Click "Create pull request"
   ```

## Pull Request Process

We use a **squash and merge** strategy to maintain a clean, linear history:

1. Keep PRs focused on a single issue or feature
2. All commits in your branch will be squashed into a single commit when merged
3. Write a clear PR description explaining the purpose and implementation details
4. Reference any related issues using the `#issue-number` syntax

## Commit Messages

Since we squash commits, your individual commit messages on the branch are less critical. However, please:

- Use clear, descriptive messages for significant commits
- Follow the format: `[type]: Brief description` (e.g., `fix: Resolve login error`)
- Types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Code Style

- Follow the existing code style in the project
- Run linters before submitting your PR
- Write tests for new functionality

## Reporting Issues

- Use the issue templates when available
- Provide clear steps to reproduce bugs
- Include relevant environment details

## Project Structure

The project is organized into:

- `frontend/`: Next.js frontend application
- `backend/`: TypeScript backend service
- `documents/`: Project documentation

## Getting Help

If you have questions, please open an issue with the "question" label.

We appreciate your contributions and look forward to your involvement in the project!
