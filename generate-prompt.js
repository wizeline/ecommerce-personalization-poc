import { PROMPT_TEMPLATE } from "./constants.js";

const stringify = (text) => JSON.stringify(text, null, 2);

export const generatePrompt = ({
  productsInfo,
  usersHistoryPurchaseInfo,
  userInfo,
}) => {
  console.log("USERINFO", userInfo);
  // console.log("PRODUCTSINFO", productsInfo)
  // console.log("PURCHASEINFO", usersHistoryPurchaseInfo)

  return PROMPT_TEMPLATE.replace("JSON_DE_PRODUCTOS", stringify(productsInfo))
    .replace(
      "JSON_DE_HISTORIAL_DE_COMPRAS",
      stringify(usersHistoryPurchaseInfo)
    )
    .replace("IDS_DE_USUARIOS", userInfo.map(({ id }) => id).join(","));
};
