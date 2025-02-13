export function formatPrice(price: number, currency:string) {
  if(currency === "USD"){
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  }
  return price.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
}
