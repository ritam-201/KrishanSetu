import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'kisansetu_secret_key_2026';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token' });
  }
};

export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]` 
      });
    }
    next();
  };
};

export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Admin authentication token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.adminId || !['SUPER_ADMIN', 'ADMIN', 'STAFF_MANAGER'].includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden. Access restricted to authorized administrative personnel.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Admin session expired or invalid. Please log in again.' });
  }
};

export const requireAdminRole = (...allowedAdminRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Action requires administrative permission: [${allowedAdminRoles.join(', ')}]` 
      });
    }
    next();
  };
};
