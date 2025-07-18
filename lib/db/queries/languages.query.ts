

/**
 * @params no params.
 */

export const getAllLanguagesQuery = `
  SELECT * FROM languages
`;

/**
 * @params site_id: string, site_id: string.
 */

export const getLanguagesBySiteIdQuery = `SELECT 
    l.*,
    (l.id = s.default_lang_id) AS isDefault 
    FROM languages l
    LEFT JOIN lang_site_map lsm ON l.id = lsm.lang_id 
    LEFT JOIN sites s ON s.id = ?
    WHERE 
    lsm.site_id = ? OR
    l.id = s.default_lang_id
    `;

/** 
 * @params code: string, name: string.
 */

export const addSupportedLanguageQuery = `
  INSERT INTO languages (code, name) VALUES (?, ?)
`;

/**
 * @params lang_id: string, site_id: string.
 */

export const addLanguageToSiteQuery = `
  INSERT INTO lang_site_map (lang_id, site_id) VALUES (?, ?)
`;