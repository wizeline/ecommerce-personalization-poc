import fs from "fs";

export const generatePrompt = ({
  usersHistoryPurchaseInfo,
}) => {
  const profiles = fs.readFileSync("types_of_users.txt", 'utf8');
  const purchaseHistory = usersHistoryPurchaseInfo.map(({ description }) => `* ${description}\n\n`).join("");
  const template = `The following list is a purchase history that includes the descriptions of all the products a user has bought:

  PRODUCTS:
  ${purchaseHistory}
  
  Also, we have a list of customer profiles:

  CUSTOMER PROFILES:
  ${profiles}

  Please, give me the user profile number that best match the user purchase history:
  `;
  
  return template;
};