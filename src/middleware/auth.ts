import jwt from "jsonwebtoken";

export function requireAuth(req:any,res:any,next:any){
  const token = req.cookies?.token; // Changed from access_token to token to match auth routes
  if (!token) return res.status(401).json({error:{code:"UNAUTHENTICATED"}});
  try { 
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as any;
    req.user = { id: decoded.userId, username: decoded.username, role: decoded.role };
    next(); 
  }
  catch { return res.status(401).json({error:{code:"UNAUTHENTICATED"}}); }
}

export function requireRole(role:"customer"|"admin"){
  return (req:any,res:any,next:any)=>{
    if (req.user?.role !== role) return res.status(403).json({error:{code:"FORBIDDEN"}});
    next();
  };
}