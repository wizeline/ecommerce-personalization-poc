# ecommerce-personalization-poc

Prompts utilizados:

Para generar tablas sql:
"Genera un fichero sql para rellenar la tabla de users con 20 usuarios y un historial de compra con varios artículos para cada usuario en la tabla user_purchase_history utilizando productos reales con los product_id de la tabla info con nombres de usuario españoles"


Prompt para generar el purchase history (alternativo)

  dada esta base de datos, genera un fichero sql para rellenar la tabla 'user_purchase_history' con un historial de 100 compras que incluya 'user_id', 'product_id' y 'purchase_date' sabiendo que esas columnas son texto, para usuarios existentes en la table 'users', sabiendo que el id de usuario en la table 'users' es 'user_id' y productos existentes en la tabla 'info' sabiendo que el id de producto es 'product_id'.
