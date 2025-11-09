# Developer Guide - The Lil Gift Corner

**Version**: 1.0  
**Last Updated**: January 2025

---

## Getting Started

This guide helps developers contribute to The Lil Gift Corner project.

### Prerequisites
- Familiarity with React, Python, MongoDB
- Git knowledge
- Read [Installation Guide](INSTALLATION_GUIDE.md)

### Development Setup

1. Fork and clone repository
2. Follow [Installation Guide](INSTALLATION_GUIDE.md)
3. Create feature branch: `git checkout -b feature/your-feature`
4. Make changes and commit
5. Push and create pull request

---

## Project Structure

```
/app/
├── backend/          # FastAPI backend
│   ├── api/         # Modular API code
│   ├── server.py    # Main application
│   └── .env         # Environment variables
├── frontend/         # React frontend
│   ├── src/         # Source code
│   └── .env         # Environment variables
└── documents/        # Documentation
```

---

## Coding Standards

### Python (Backend)
- Follow PEP 8
- Use type hints
- Docstrings for functions
- 4 spaces indentation

### JavaScript (Frontend)
- Use ES6+ syntax
- Functional components with hooks
- 2 spaces indentation
- Descriptive variable names

---

## Git Workflow

1. Create feature branch from `main`
2. Make atomic commits with clear messages
3. Write tests for new features
4. Update documentation
5. Submit pull request

**Commit Message Format**:
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

---

## Testing

Run tests before committing:

```bash
# Backend
cd backend && pytest

# Frontend
cd frontend && yarn test
```

---

## Code Review Process

1. Self-review your code
2. Ensure tests pass
3. Request review from maintainers
4. Address feedback
5. Merge after approval

---

[\u2190 API Reference](API_REFERENCE.md) | [Testing Guide \u2192](TESTING_GUIDE.md)
