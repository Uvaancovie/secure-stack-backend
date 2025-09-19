export const validate = (schema: any) => (req: any, res: any, next: any) => {
  const parsed = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!parsed.success) {
    return res.status(400).json({ 
      error: { 
        code: "VALIDATION_ERROR", 
        details: parsed.error.issues 
      }
    });
  }
  // Merge validated data back to req
  if (parsed.data.body) req.body = parsed.data.body;
  if (parsed.data.query) req.query = parsed.data.query;
  if (parsed.data.params) req.params = parsed.data.params;
  next();
};