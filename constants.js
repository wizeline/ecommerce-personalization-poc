export const DB_PATH = "./retailDB.sqlite";
export const PRODUCT_QUERY =
  "SELECT product_id as id, product_name as name, description FROM info limit 150";
export const USER_HISTORY_PURCHASE_QUERY =
  "SELECT user_id as id, product_id as product_id FROM user_purchase_history limit 150";
export const USER_QUERY = "SELECT user_id as id FROM users limit 10";
export const PROMPT_TEMPLATE = `este es el JSON de un listado de productos de una tienda

JSON_DE_PRODUCTOS

Este JSON que aparece a continuación es un objeto donde cada key representa a un usuario de la tienda y como value, tiene un array con cada identificador de la lista de productos anterior que ha comprado

JSON_DE_HISTORIAL_DE_COMPRAS

Para los 10 usuarios con ID IDS_DE_USUARIOS generame un JSON con un objeto en la respuesta donde la key sea el id de usuario y el value un array con tres identificadores de producto para cada usuario que le podríamos recomendar en base a su historial de compras.

Respóndeme exclusivamente el JSON que te pido correctamente formateado.`;
