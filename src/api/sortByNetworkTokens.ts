import { networkTokens, compareString } from "./helpers";

export const sortByNetworkTokens = <T>(
  arr: T[],
  selector: (item: T) => string,
  order: string[] = networkTokens
) => {
  const allTokenSymbols = arr.map(selector);
  const atLeastOneNetworkTokenIncluded = order.some(networkSymbol =>
    allTokenSymbols.includes(networkSymbol)
  );

  return [...arr].sort((a, b) => {
    const aSymbol = selector(a);
    const bSymbol = selector(b);

    const aSymbolRank = order.findIndex(symbol =>
      compareString(symbol, aSymbol)
    );
    const bSymbolRank = order.findIndex(symbol =>
      compareString(symbol, bSymbol)
    );

    return bSymbolRank - aSymbolRank;
  });
};
