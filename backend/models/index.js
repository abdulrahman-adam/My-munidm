import Product from "./Product.js";
import Sale from "./Sale.js";
import SaleItem from "./SaleItem.js";

const models = {
  Sale,
  SaleItem,
  Product,
};

/* run associations */
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export default models;