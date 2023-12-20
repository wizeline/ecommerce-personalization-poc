import { PROMPT_TEMPLATE } from "./constants"

const stringify = (text) => JSON.stringify(text, null, 2)

export const generatePrompt = ({ productsInfo, usersHistoryPurchaseInfo, userInfo }) => {

    return PROMPT_TEMPLATE
        .replace("JSON_DE_PRODUCTOS", stringify(productsInfo))
        .replace("JSON_DE_HISTORIAL_DE_COMPRAS", stringify(usersHistoryPurchaseInfo))
        .replace("IDS_DE_USUARIOS", userInfo.map(({ id }) => id).join(","));
}