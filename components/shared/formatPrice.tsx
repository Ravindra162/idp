export function formatPrice(price: number, currency: string) {
  switch (currency) {
    case "USD":
      return price.toLocaleString("en-US", { style: "currency", currency: "USD" });
    case "PKR":
      return price.toLocaleString("en-PK", { style: "currency", currency: "PKR" });
    case "BTC":
      return price.toLocaleString("en-US", { style: "currency", currency: "BTC", minimumFractionDigits: 8 });
    default:
      return price.toLocaleString("en-IN", { style: "currency", currency: "INR" });
  }
}
