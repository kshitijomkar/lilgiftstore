# Release Guide - The Lil Gift Corner

**Version**: 1.0  
**Last Updated**: January 2025

---

## Versioning Strategy

We follow Semantic Versioning (SemVer): MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Current version: **2.0.0**

---

## Release Process

### 1. Preparation

- [ ] Create release branch: `release/v2.1.0`
- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Run all tests
- [ ] Update documentation

### 2. Testing

- [ ] Test on staging environment
- [ ] Perform UAT (User Acceptance Testing)
- [ ] Security scan
- [ ] Performance testing

### 3. Release

- [ ] Merge release branch to main
- [ ] Create Git tag: `git tag v2.1.0`
- [ ] Push tag: `git push origin v2.1.0`
- [ ] Deploy to production
- [ ] Monitor for issues

### 4. Communication

- [ ] Update release notes on GitHub
- [ ] Announce release (if public)
- [ ] Update documentation site

---

## Rollback Procedure

If critical issues discovered:

1. Identify problem commit
2. Revert to previous stable tag
3. Deploy previous version
4. Fix issue in hotfix branch
5. Create new release

---

[\u2190 Maintenance Guide](MAINTENANCE_GUIDE.md) | [Security Policy \u2192](SECURITY_POLICY.md)
