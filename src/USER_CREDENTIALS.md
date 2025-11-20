# MiOA - User Credentials Reference

## 🔐 Strong Password Authentication

All user accounts now have strong, secure passwords following enterprise security standards:
- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, and special characters
- Unique per user

---

## 👥 User Accounts

### 1. Administrator Account
- **Username**: `admin`
- **Password**: `Adm!n@2024#Secure`
- **Role**: Administrator
- **Region**: All Regions
- **Permissions**: Full system access

---

### 2. Region Lead - US East
- **Username**: `john.doe`
- **Password**: `J0hn$D0e!2024#MiOA`
- **Role**: Region Lead
- **Region**: US-East
- **Permissions**: Region-specific access (US-East only)

---

### 3. Region Lead - EU Central
- **Username**: `jane.smith`
- **Password**: `J@ne$m!th#2024#EU`
- **Role**: Region Lead
- **Region**: EU-Central
- **Permissions**: Region-specific access (EU-Central only)

---

### 4. Migration Engineer
- **Username**: `mike.wilson`
- **Password**: `M!ke$W1ls0n@2024#Eng`
- **Role**: Migration Engineer
- **Region**: All Regions
- **Permissions**: Phase creation and execution only

---

## 🔒 Security Notes

- Passwords follow enterprise security standards
- No credentials displayed on login page
- Passwords should be changed on first login in production
- Consider implementing password expiration policies
- Enable MFA for production environments

---

## 📋 Password Requirements

✅ Minimum 16 characters  
✅ At least one uppercase letter  
✅ At least one lowercase letter  
✅ At least one number  
✅ At least one special character (!@#$)  
✅ No dictionary words  
✅ Unique per user  

---

**Generated**: 2024  
**For**: MiOA Platform - Migration, Innovation & Orchestration Assistant