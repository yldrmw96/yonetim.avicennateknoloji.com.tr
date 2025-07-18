export const getMailPropertiesBySiteIdQuery = `SELECT pl.\`key\`, pl.value 
       FROM property_map pm
       JOIN property_list pl ON pm.property_id = pl.id
       WHERE pm.site_id = ? AND pm.property_group_id = 1
       AND pl.\`key\` IN ('smtp_host', 'smtp_port', 'smtp_username', 'smtp_password')
       `

export const getSeoPropertiesBySiteIdQuery = `SELECT pl.\`key\`, pl.value 
       FROM property_map pm
       JOIN property_list pl ON pm.property_id = pl.id
       WHERE pm.site_id = ? AND pm.property_group_id = 2
       AND pl.\`key\` IN ('meta_title', 'meta_description', 'meta_keywords', 'meta_author')`