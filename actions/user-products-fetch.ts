import { db } from "@/lib/db";

export async function getFilteredProducts(domainId: string, userId: string) {
    // Fetch all products
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  
    // Fetch domain-specific inclusions/exclusions
    const domain = await db.domain.findUnique({
      where: { id: domainId },
      select: {
        includedInIds: true,
        excludedFromIds: true,
      },
    });
  
    if (!domain) {
      throw new Error("Invalid domain ID");
    }
  
    // Filter products based on domain visibility rules
    const filteredProducts = products.filter((product) => {
      if (product.visibleToAllDomains) {
        return !product.excludedDomainIds.includes(domainId);
      } else {
        return product.includedDomainIds.includes(domainId);
      }
    });
  
    // Fetch product-specific overrides for the domain
    const productInfos = await db.productInfo.findMany({
      where: { domainId },
    });
  
    // Merge filtered products with ProductInfo data
    const mergedProducts = filteredProducts.map((product: { id: any; productName: any; stock: any; minProduct: any; maxProduct: any; price: any; description: any; }) => {
      const productInfo = productInfos.find((info: { productId: string; }) => info.productId === product.id);
  
      return {
        id: product.id,
        name: product.productName,
        stock: product.stock,
        minProduct: productInfo?.Min ?? product.minProduct,
        maxProduct: productInfo?.Max ?? product.maxProduct,
        price: productInfo?.Price ?? product.price,
        description: product.description,
      };
    });
  
    return mergedProducts;
  }
  

  export async function filterProductsByTeam(mergedProducts: any[], teamId: string) {
    // Fetch team-specific inclusions/exclusions
    const team = await db.team.findUnique({
      where: { id: teamId },
      select: {
        includedInIds: true,
        excludedFromIds: true,
      },
    });
  
    if (!team) {
      throw new Error("Invalid team ID");
    }
  
    // Filter products based on team visibility rules
    const teamFilteredProducts = mergedProducts.filter((product) => {
      if (product.visibleToAllTeams) {
        return !product.excludedTeamIds.includes(teamId);
      } else {
        return product.includedTeamIds.includes(teamId);
      }
    });
  
    // Fetch product-specific overrides for the team
    const productInfos = await db.productInfo.findMany({
      where: { teamId },
    });
  
    // Merge filtered products with ProductInfo data
    const finalProducts = teamFilteredProducts.map((product) => {
      const productInfo = productInfos.find((info) => info.productId === product.id);
  
      return {
        ...product,
        minProduct: productInfo?.Min ?? product.minProduct,
        maxProduct: productInfo?.Max ?? product.maxProduct,
        price: productInfo?.Price ?? product.price,
      };
    });
  
    return finalProducts;
  }
  

  export async function filterProductsByWalletType(mergedProducts: any[], walletTypeId: string) {
    // Fetch wallet-specific inclusions/exclusions
    const walletType = await db.walletType.findUnique({
      where: { id: walletTypeId },
      select: {
        includedInIds: true,
        excludedFromIds: true,
      },
    });
  
    if (!walletType) {
      throw new Error("Invalid walletType ID");
    }
  
    // Filter products based on wallet type visibility rules
    const walletFilteredProducts = mergedProducts.filter((product) => {
      if (product.visibleToAllWalletTypes) {
        return !product.excludedWalletTypeIds.includes(walletTypeId);
      } else {
        return product.includedWalletTypeIds.includes(walletTypeId);
      }
    });
  
    // Fetch product-specific overrides for the walletType
    const productInfos = await db.productInfo.findMany({
      where: { walletTypeId },
    });
  
    // Merge filtered products with ProductInfo data
    const finalProducts = walletFilteredProducts.map((product) => {
      const productInfo = productInfos.find((info) => info.productId === product.id);
  
      return {
        ...product,
        minProduct: productInfo?.Min ?? product.minProduct,
        maxProduct: productInfo?.Max ?? product.maxProduct,
        price: productInfo?.Price ?? product.price,
      };
    });
  
    return finalProducts;
  }
  
  export async function filterProductsForProUser(filteredProducts: any[], userId: string) {
    // Fetch user role
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    const isProUser = user.role === "PRO";
  
    if (!isProUser) {
      return filteredProducts; // No changes for non-PRO users
    }

    const proUser = await db.proUser.findUnique({
        where : { userId : userId}
    });
  
    // Fetch PRO-specific product information
    const proProductInfos = await db.productInfo.findMany({
      where: { proUserId : proUser?.id },
    });
  
    // Merge PRO pricing details with the filtered products
    const finalProducts = filteredProducts.map((product) => {
      const proProductInfo = proProductInfos.find((info) => info.productId === product.id);
  
      return {
        ...product,
        minProduct: proProductInfo?.Min ?? product.minProduct,
        maxProduct: proProductInfo?.Max ?? product.maxProduct,
        price: proProductInfo?.Price ?? product.price,
      };
    });
  
    return finalProducts;
  }
  

  export async function getFinalFilteredProducts(domainId: string, userId: string, teamId: string, walletTypeId: string) {
    try {
      // Step 1: Filter by Domain
      const domainFilteredProducts = (await getFilteredProducts(domainId, userId)) ?? [];
  
      // Step 2: Filter by Team
      const teamFilteredProducts = (await filterProductsByTeam(domainFilteredProducts, teamId)) ?? [];
  
      // Step 3: Filter by Wallet Type
      const walletFilteredProducts = (await filterProductsByWalletType(teamFilteredProducts, walletTypeId)) ?? [];
  
      // Step 4: Apply PRO Pricing (if applicable)
      const proFilteredProducts = (await filterProductsForProUser(walletFilteredProducts, userId)) ?? [];
  
      console.log("Final Filtered Products:", proFilteredProducts);
      return proFilteredProducts;
    } catch (error) {
      console.error("Error in getFinalFilteredProducts:", error);
      return []; // Always return an array to prevent "undefined" issues
    }
  }
  