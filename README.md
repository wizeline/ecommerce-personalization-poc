# ecommerce-personalization-poc

We will be using nodejs 18.19.0

Prompts utilizados:

Para generar tablas sql:
"Genera un fichero sql para rellenar la tabla de users con 20 usuarios y un historial de compra con varios artículos para cada usuario en la tabla user_purchase_history utilizando productos reales con los product_id de la tabla info con nombres de usuario españoles"


Prompt para generar el purchase history (alternativo)

  dada esta base de datos, genera un fichero sql para rellenar la tabla 'user_purchase_history' con un historial de 100 compras que incluya 'user_id', 'product_id' y 'purchase_date' sabiendo que esas columnas son texto, para usuarios existentes en la table 'users', sabiendo que el id de usuario en la table 'users' es 'user_id' y productos existentes en la tabla 'info' sabiendo que el id de producto es 'product_id'.


Prompt para pedir remcomendaciones
 este es el JSON de un listado de productos de una tienda

   {JSON_DE_PRODUCTOS}

 Este JSON que aparece a continuación es un objeto donde cada key representa a un usuario de la tienda y como value, tiene un array con cada identificador de la lista de productos anterior que ha comprado

   {JSON_DE_HISTORIAL_DE_COMPRAS} 

 Para los usuarios con ID {IDS_DE_USUARIOS} generame un JSON con un objeto en la respuesta, donde la key sea el id de usuario y el value un array con tres identificadores de producto que le podríamos recomendar en base a su historial de compras.

 Respóndeme exclusivamente el JSON que te pido.

## Env variables

You should have defined the following env variables
* API_KEY: you openapi key