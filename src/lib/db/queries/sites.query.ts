export const getSitesByUserIdQuery = `
  SELECT s.* 
  FROM sites s
  RIGHT JOIN ownership o 
  ON o.site_id = s.id
  WHERE o.user_id = ?
`;
