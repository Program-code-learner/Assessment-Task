// Function to calculate the discount based on rules
function calculateDiscount(cart, rules) {
  let maxDiscount = 0;
  let appliedRule = '';

  // Check each discount rule and apply the most beneficial one
  for (const rule in rules) {
    const discount = rules[rule](cart);
    if (discount > maxDiscount) {
      maxDiscount = discount;
      appliedRule = rule;
    }
  }

  return { appliedRule, discountAmount: maxDiscount };
}

// Function to calculate the total amount
function calculateTotal(cart, discountAmount, shippingFee, giftWrapFee) {
  const subtotal = cart.reduce((acc, product) => acc + product.totalAmount, 0);
  const total = subtotal - discountAmount + shippingFee + giftWrapFee;
  return { subtotal, total };
}

// Main function to process the cart
function processCart(products, rules, shippingFee, giftWrapFee) {
  const cart = [];

  // Accept quantity and gift wrap information for each product
  for (const product of products) {
    const quantity = parseInt(prompt(`Enter quantity for ${product.name}:`), 10);
    const isGiftWrapped = prompt(`Is ${product.name} wrapped as a gift? (yes/no):`).toLowerCase() === 'yes';

    const totalAmount = quantity * product.price;
    const giftWrapCost = isGiftWrapped ? quantity * giftWrapFee : 0;

    cart.push({
      name: product.name,
      quantity,
      totalAmount,
      isGiftWrapped,
      giftWrapCost,
    });
  }

  // Calculate discount
  const { appliedRule, discountAmount } = calculateDiscount(cart, rules);

  // Calculate shipping fee
  const packages = Math.ceil(cart.reduce((acc, product) => acc + product.quantity, 0) / 10);
  const shippingTotal = packages * shippingFee;

  // Calculate total
  const { subtotal, total } = calculateTotal(cart, discountAmount, shippingTotal, giftWrapFee);

  // Output results
  console.log('\nOrder Details:');
  cart.forEach((product) => {
    console.log(`${product.name} - Quantity: ${product.quantity} - Total Amount: $${product.totalAmount}`);
  });

  console.log('\nSubtotal:', `$${subtotal.toFixed(2)}`);
  console.log(`Discount Applied (${appliedRule}): -$${discountAmount.toFixed(2)}`);
  console.log(`Shipping Fee: $${shippingTotal.toFixed(2)}`);
  console.log(`Gift Wrap Fee: $${cart.reduce((acc, product) => acc + product.giftWrapCost, 0).toFixed(2)}`);
  console.log('\nTotal:', `$${total.toFixed(2)}`);
}

// Example usage
const products = [
  { name: 'Product A', price: 20 },
  { name: 'Product B', price: 40 },
  { name: 'Product C', price: 50 },
];

const rules = {
  flat_10_discount: (cart) => cart.reduce((acc, product) => acc + product.totalAmount, 0) > 200 ? 10 : 0,
  bulk_5_discount: (cart) => cart.some((product) => product.quantity > 10) ? 0.05 * cart.find((product) => product.quantity > 10).totalAmount : 0,
  bulk_10_discount: (cart) => cart.reduce((acc, product) => acc + product.quantity, 0) > 20 ? 0.1 * cart.reduce((acc, product) => acc + product.totalAmount, 0) : 0,
  tiered_50_discount: (cart) => {
    const totalQuantity = cart.reduce((acc, product) => acc + product.quantity, 0);
    const qualifyingProduct = cart.find((product) => product.quantity > 15);
    return totalQuantity > 30 && qualifyingProduct ? 0.5 * qualifyingProduct.totalAmount : 0;
  },
};

const shippingFee = 5;
const giftWrapFee = 1;

processCart(products, rules, shippingFee, giftWrapFee);
