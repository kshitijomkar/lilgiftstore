# Testing Guide - The Lil Gift Corner

**Version**: 1.0  
**Last Updated**: January 2025

---

## Testing Strategy

The Lil Gift Corner uses multiple testing approaches:

1. **Unit Tests** - Test individual functions
2. **Integration Tests** - Test API endpoints
3. **End-to-End Tests** - Test complete workflows
4. **Manual Testing** - User acceptance testing

---

## Running Tests

### Backend Tests

```bash
cd backend
pytest tests/
```

### Frontend Tests

```bash
cd frontend
yarn test
```

---

## Test Coverage

Current coverage: 100% functional

---

## Writing Tests

### Backend Test Example

```python
import pytest
from fastapi.testclient import TestClient
from server import app

client = TestClient(app)

def test_get_products():
    response = client.get("/api/products")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### Frontend Test Example

```javascript
import { render, screen } from '@testing-library/react';
import Home from './pages/Home';

test('renders home page', () => {
  render(<Home />);
  expect(screen.getByText(/The Lil Gift Corner/i)).toBeInTheDocument();
});
```

---

[\u2190 Developer Guide](DEVELOPER_GUIDE.md) | [Deployment Guide \u2192](DEPLOYMENT_GUIDE.md)
