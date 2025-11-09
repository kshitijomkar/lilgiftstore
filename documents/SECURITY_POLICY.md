# Security Policy - The Lil Gift Corner

**Version**: 1.0  
**Last Updated**: January 2025

---

## Security Measures

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)
- Token expiration (7 days default)

### Data Protection
- HTTPS in production (TLS 1.3)
- Environment variables for secrets
- No sensitive data in logs
- PCI compliance via Stripe

### API Security
- CORS configuration
- Input validation (Pydantic)
- Rate limiting (recommended)
- XSS prevention

---

## Reporting Vulnerabilities

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email: security@thelilgiftcorner.com
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We aim to respond within 48 hours.

---

## Security Best Practices

### For Developers
- Never commit secrets to Git
- Use strong, unique passwords
- Keep dependencies updated
- Follow OWASP guidelines
- Code review before merge

### For Administrators
- Change default admin password
- Rotate API keys regularly
- Monitor access logs
- Enable 2FA where possible
- Regular security audits

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| 2.0.x   | ✅ Yes    |
| < 2.0   | ❌ No     |

---

[\u2190 Release Guide](RELEASE_GUIDE.md) | [Contributing \u2192](CONTRIBUTING.md)
