# Purpose and value

This project is a simple nodejs app that uses the openapi generated client to call the api and get the recommendations for a given user based on their purchase history. The main purpose of this project is to test how a direct call with text to the OpenAI api works and show the limitations and possibilities.

It showed that given the appropiate prompt the api can give good results, but even with the shorter outcome possible, it is not enough to process big amounts of data. It is also not possible to get the results for all the users in a single call.

# How to run

Make sure to install dependencies using nodejs 18.19.0 and run the api call document with npm start. You can also run the tests with npm test.

# Env variables

You should have defined the following env variables

- API_KEY: you openapi key

# Prompts used:

To generate sql tables:

"Genera un fichero sql para rellenar la tabla de users con 20 usuarios y un historial de compra con varios artículos para cada usuario en la tabla user_purchase_history utilizando productos reales con los product_id de la tabla info con nombres de usuario españoles"

To generate purchase history:

dada esta base de datos, genera un fichero sql para rellenar la tabla 'user_purchase_history' con un historial de 100 compras que incluya 'user_id', 'product_id' y 'purchase_date' sabiendo que esas columnas son texto, para usuarios existentes en la table 'users', sabiendo que el id de usuario en la table 'users' es 'user_id' y productos existentes en la tabla 'info' sabiendo que el id de producto es 'product_id'.
