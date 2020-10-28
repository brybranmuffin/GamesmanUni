export interface TRawGameData {
  status: string;
  response: {
    gameId: string;
    name: string;
    variants: Array<{
      variantId: string;
      description: string;
      status: string;
      startPosition: string;
    }>;
  };
}
