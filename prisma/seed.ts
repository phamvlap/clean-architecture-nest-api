import { ProductSeed } from './seeds/product.seed';

const seed = async () => {
  const ModelSeeds = [ProductSeed];

  for (const ModelSeed of ModelSeeds) {
    const modelSeed = new ModelSeed();
    await modelSeed.run();
  }
};

seed();
