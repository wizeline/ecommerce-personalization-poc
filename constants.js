export const DB_PATH = './retailDB.sqlite';
export const PRODUCT_QUERY = 'SELECT product_id as id, product_name as name, description FROM info limit 1'; 
export const USER_HISTORY_PURCHASE_QUERY = 'SELECT user_id as id, product_id as product_id FROM user_purchase_history limit 1';
export const USER_QUERY = 'SELECT user_id as id FROM users limit 1';